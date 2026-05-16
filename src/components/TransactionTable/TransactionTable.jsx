import { useContext, useState, useEffect, useRef } from 'react';
import TransactionContext from '../../context/TransactionContext';
import { toPersianDigits, formatNumber, truncateWords } from '../../utils/formatters';
import { useTooltip } from '../../hooks/useTooltip';
import Modal from '../Modal/Modal';
import AddTransactionForm from '../AddTransactionForm/AddTransactionForm';
import { useToast } from '../../hooks/useToast';
import useTransactionFilters from '../../hooks/useTransactionFilters';
// NEW: Import transaction modal hook
import useTransactionModal from '../../hooks/useTransactionModal';
// NEW: Import delete confirmation hook
import useDeleteConfirmation from '../../hooks/useDeleteConfirmation';
import TransactionToolbar from './TransactionToolbar';
import './TransactionTable.css';
import PlusIcon from '../../assets/Outline/Plus.svg';
import DeleteIcon from '../../assets/Outline/Delete.svg';
import EditSquareIcon from '../../assets/Outline/Edit Square.svg';
import DangerCircleIcon from '../../assets/Outline/Danger Circle.svg';

const TransactionTable = () => {
  // NEW: Use transaction modal hook instead of local state
  const {
    isOpen: isModalOpen,
    editingTransaction,
    openAddModal,
    openEditModal,
    closeModal,
  } = useTransactionModal();

  const { showErrorToast } = useToast();
  const { transactions, loading, error, fetchTransactions, deleteTransaction } =
    useContext(TransactionContext);

  // NEW: Use delete confirmation hook
  const deleteButtonRef = useRef(null);
  const {
    show: showDeleteModal,
    deleting,
    confirmDelete,
    cancelDelete,
    handleConfirmDelete,
  } = useDeleteConfirmation(deleteTransaction, showErrorToast);

  // CHANGED: Use filtering & sorting hook – now also provides object states and setters for date picker
  const {
    filteredTransactions,
    sortOrder,
    setSortOrder,
    fromDateObj,
    toDateObj,
    setFromDateObj,
    setToDateObj,
  } = useTransactionFilters(transactions);

  const isEmpty = filteredTransactions.length === 0;

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuAbove, setMenuAbove] = useState(false);
  const menuRef = useRef(null);
  const buttonRefs = useRef({});

  // Tooltip logic (unchanged)
  const {
    tooltip,
    triggerRef: tooltipTriggerRef,
    hideTooltip,
    handleMouseEnter: tooltipMouseEnter,
    handleMouseLeave: tooltipMouseLeave,
    handleClick: tooltipClick,
  } = useTooltip();

  // NEW: Focus delete button when modal opens
  useEffect(() => {
    if (showDeleteModal && deleteButtonRef.current) {
      deleteButtonRef.current.focus();
    }
  }, [showDeleteModal]);

  // Merge close-handler for dropdown and tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
        // Reset menu direction when menu is closed by clicking outside
        setMenuAbove(false);
      }
      if (
        tooltip.visible &&
        tooltipTriggerRef.current &&
        !tooltipTriggerRef.current.contains(event.target)
      ) {
        hideTooltip();
      }
    };

    if (openMenuId !== null || tooltip.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId, tooltip.visible, hideTooltip, tooltipTriggerRef]);

  // Flip dropdown direction based on button position (without calling setState for null case)
  useEffect(() => {
    if (openMenuId === null) return;

    const timer = requestAnimationFrame(() => {
      const button = buttonRefs.current[openMenuId];
      if (!button) return;

      const scrollContainer = button.closest('.table-content.with-transactions');
      if (!scrollContainer) return;

      const buttonRect = button.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const dropdownHeight = 100;
      const spaceBelow = containerRect.bottom - buttonRect.bottom;
      const spaceAbove = buttonRect.top - containerRect.top;

      setMenuAbove(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    });

    return () => cancelAnimationFrame(timer);
  }, [openMenuId]);

  // Hide tooltip on scroll
  useEffect(() => {
    if (!tooltip.visible) return;

    const handleScroll = () => hideTooltip();
    window.addEventListener('scroll', handleScroll, true);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [tooltip.visible, hideTooltip]);

  const handleKebabClick = (id) => {
    setOpenMenuId((prev) => {
      const newId = prev === id ? null : id;
      // Reset menu direction when menu is being closed
      if (newId === null) setMenuAbove(false);
      return newId;
    });
  };

  const KebabIcon = (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="2" cy="2" r="1.5" fill="#6B7580" />
      <circle cx="2" cy="8" r="1.5" fill="#6B7580" />
      <circle cx="2" cy="14" r="1.5" fill="#6B7580" />
    </svg>
  );

  // NEW: toolbar props using hook's object states and setters directly
  const toolbarProps = {
    fromDateObj,
    toDateObj,
    sortOrder,
    onFromDateChange: setFromDateObj,
    onToDateChange: setToDateObj,
    onSortOrderChange: setSortOrder,
  };

  // Loading state (with toolbar)
  if (loading) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">تراکنش‌ها</h2>
          <button className="add-transaction-button" onClick={openAddModal}>
            <img src={PlusIcon} alt="Plus" className="button-icon" />
            افزودن تراکنش
          </button>
        </div>
        <TransactionToolbar {...toolbarProps} />
        <div className="table-content">
          <p className="loading-text">در حال بارگذاری تراکنش‌ها...</p>
        </div>
      </div>
    );
  }

  // Error state (with toolbar)
  if (error) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">تراکنش‌ها</h2>
          <button className="add-transaction-button" onClick={openAddModal}>
            <img src={PlusIcon} alt="Plus" className="button-icon" />
            افزودن تراکنش
          </button>
        </div>
        <TransactionToolbar {...toolbarProps} />
        <div className="table-content">
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={() => fetchTransactions()}>
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main render (with toolbar and filtered transactions)
  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">تراکنش‌ها</h2>
        <button className="add-transaction-button" onClick={openAddModal}>
          <img src={PlusIcon} alt="Plus" className="button-icon" />
          افزودن تراکنش
        </button>
      </div>

      <TransactionToolbar {...toolbarProps} />

      <div className={`table-content ${!isEmpty ? 'with-transactions' : ''}`}>
        {isEmpty ? (
          <div className="empty-state-content">
            <img src={DangerCircleIcon} alt="No transactions" className="empty-state-icon" />
            <p className="empty-state-text">شما هنوز تراکنشی وارد نکرده‌اید</p>
          </div>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th className="header-date">تاریخ</th>
                <th className="header-income">درآمد (تومان)</th>
                <th className="header-expense">هزینه (تومان)</th>
                <th className="header-description">شرح</th>
                <th className="header-actions"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const truncatedDesc = truncateWords(transaction.description, 5);
                const hasMoreWords =
                  transaction.description && transaction.description.split(' ').length > 5;

                return (
                  <tr key={transaction.id}>
                    <td className="cell-date">{toPersianDigits(transaction.date)}</td>
                    <td className="cell-income">
                      {transaction.income > 0 ? (
                        <>
                          {formatNumber(transaction.income)}+
                          <span className="currency-label"> تومان</span>
                        </>
                      ) : null}
                    </td>
                    <td className="cell-expense">
                      {transaction.expense > 0 ? (
                        <>
                          {formatNumber(transaction.expense)}-
                          <span className="currency-label"> تومان</span>
                        </>
                      ) : null}
                    </td>
                    <td className="cell-description">
                      {transaction.description ? (
                        hasMoreWords ? (
                          <span
                            className="description-text has-tooltip"
                            onClick={tooltipClick(transaction.description)}
                            onMouseEnter={tooltipMouseEnter(transaction.description)}
                            onMouseLeave={tooltipMouseLeave}
                            ref={
                              tooltip.visible && tooltip.text === transaction.description
                                ? tooltipTriggerRef
                                : null
                            }
                            aria-label={transaction.description}
                          >
                            {truncatedDesc}
                          </span>
                        ) : (
                          <span className="description-text" aria-label={transaction.description}>
                            {truncatedDesc}
                          </span>
                        )
                      ) : null}
                    </td>
                    <td className="cell-actions">
                      <button
                        className="kebab-button"
                        ref={(el) => (buttonRefs.current[transaction.id] = el)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleKebabClick(transaction.id);
                        }}
                        aria-label="منوی اقدامات"
                      >
                        {KebabIcon}
                      </button>

                      {openMenuId === transaction.id && (
                        <div
                          ref={menuRef}
                          className={`dropdown-menu ${menuAbove ? 'dropdown-menu-above' : ''}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="dropdown-item"
                            onClick={() => openEditModal(transaction)}
                          >
                            <img src={EditSquareIcon} alt="ویرایش" className="dropdown-item-icon" />
                            <span>ویرایش</span>
                          </button>
                          <button
                            className="dropdown-item"
                            // NEW: Use confirmDelete from hook
                            onClick={() => confirmDelete(transaction.id)}
                          >
                            <img src={DeleteIcon} alt="حذف" className="dropdown-item-icon" />
                            <span>حذف</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals - using closeModal from hook */}
      {isModalOpen && (
        <Modal title={editingTransaction ? 'ویرایش تراکنش' : 'افزودن تراکنش'} onClose={closeModal}>
          <AddTransactionForm
            mode={editingTransaction ? 'edit' : 'add'}
            initialData={editingTransaction}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {/* NEW: Delete confirmation modal using hook state */}
      {showDeleteModal && (
        <Modal title="" onClose={cancelDelete} className="delete-confirmation-modal">
          <p>آیا از حذف تراکنش اطمینان دارید؟</p>
          <div className="delete-actions">
            <button className="cancel-button" onClick={cancelDelete} disabled={deleting}>
              انصراف
            </button>
            <button
              className="delete-confirm-button"
              onClick={handleConfirmDelete}
              ref={deleteButtonRef}
              disabled={deleting}
            >
              {deleting ? 'در حال حذف...' : 'حذف'}
            </button>
          </div>
        </Modal>
      )}

      {/* Tooltip portal (unchanged) */}
      {tooltip.visible && (
        <div
          id={`tooltip-${tooltip.text.replace(/\s/g, '')}`}
          className="description-tooltip"
          role="tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <span>{tooltip.text}</span>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
