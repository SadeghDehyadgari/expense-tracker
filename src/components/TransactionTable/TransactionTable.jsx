import { useContext, useState, useEffect, useRef } from 'react'; // CHANGED: added useMemo
import TransactionContext from '../../context/TransactionContext';
import { toPersianDigits, formatNumber, truncateWords } from '../../utils/formatters';
import { useTooltip } from '../../hooks/useTooltip';
// NEW: Imports needed for self‑contained modal handling
import Modal from '../Modal/Modal';
import AddTransactionForm from '../AddTransactionForm/AddTransactionForm';
import { useToast } from '../../hooks/useToast';
// NEW: Import custom hook for filtering/sorting
import useTransactionFilters from '../../hooks/useTransactionFilters';
// NEW: Import extracted toolbar component
import TransactionToolbar from './TransactionToolbar';
// NEW: Import formatJalaliDate helper
import { formatJalaliDate } from '../../utils/jalaliDateUtils';
import './TransactionTable.css';
import PlusIcon from '../../assets/Outline/Plus.svg';
import DeleteIcon from '../../assets/Outline/Delete.svg';
import EditSquareIcon from '../../assets/Outline/Edit Square.svg';
import DangerCircleIcon from '../../assets/Outline/Danger Circle.svg';

const TransactionTable = () => {
  // CHANGED: All modal/delete state now lives here
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    transactionId: null,
  });
  const [deleting, setDeleting] = useState(false);

  const deleteButtonRef = useRef(null);

  // NEW: useToast for error toasts
  const { showErrorToast } = useToast();

  // CHANGED: destructure all needed from context
  const { transactions, loading, error, fetchTransactions, deleteTransaction } =
    useContext(TransactionContext);

  // NEW: Use filtering & sorting hook
  const {
    filteredTransactions,
    fromDate,
    toDate,
    sortOrder,
    setFromDate,
    setToDate,
    setSortOrder,
  } = useTransactionFilters(transactions);

  const isEmpty = filteredTransactions.length === 0;

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuAbove, setMenuAbove] = useState(false);
  const menuRef = useRef(null);
  const buttonRefs = useRef({});

  // NEW: State for date picker objects (to display selected dates)
  const [fromDateObj, setFromDateObj] = useState(null);
  const [toDateObj, setToDateObj] = useState(null);

  // Tooltip logic (unchanged)
  const {
    tooltip,
    triggerRef: tooltipTriggerRef,
    hideTooltip,
    handleMouseEnter: tooltipMouseEnter,
    handleMouseLeave: tooltipMouseLeave,
    handleClick: tooltipClick,
  } = useTooltip();

  // Focus the delete confirmation button when it appears
  useEffect(() => {
    if (deleteConfirmation.show && deleteButtonRef.current) {
      deleteButtonRef.current.focus();
    }
  }, [deleteConfirmation.show]);

  // Merge close-handler for dropdown and tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId !== null && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
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

  // Flip dropdown direction
  useEffect(() => {
    if (openMenuId === null || !menuRef.current) {
      return;
    }

    const timer = requestAnimationFrame(() => {
      const dropdown = menuRef.current;
      const button = buttonRefs.current[openMenuId];
      if (!dropdown || !button) return;

      const scrollContainer = dropdown.closest('.table-content.with-transactions');
      if (!scrollContainer) return;

      const dropdownRect = dropdown.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      setMenuAbove(dropdownRect.bottom > containerRect.bottom - 4);
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

  // ---------- Modal & delete handlers ----------

  const handleOpenModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteClick = (transactionId) => {
    setDeleteConfirmation({ show: true, transactionId });
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteTransaction(deleteConfirmation.transactionId);
      setDeleteConfirmation({ show: false, transactionId: null });
    } catch {
      showErrorToast('خطا در حذف تراکنش');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, transactionId: null });
  };

  // Kebab menu handlers
  const handleKebabClick = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const KebabIcon = (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="2" cy="2" r="1.5" fill="#6B7580" />
      <circle cx="2" cy="8" r="1.5" fill="#6B7580" />
      <circle cx="2" cy="14" r="1.5" fill="#6B7580" />
    </svg>
  );

  // NEW: Handlers for date pickers using shared helper
  const handleFromDateChange = (selectedDay) => {
    if (selectedDay) {
      const formatted = formatJalaliDate(selectedDay);
      setFromDate(formatted);
      setFromDateObj(selectedDay);
    } else {
      setFromDate('');
      setFromDateObj(null);
    }
  };

  const handleToDateChange = (selectedDay) => {
    if (selectedDay) {
      const formatted = formatJalaliDate(selectedDay);
      setToDate(formatted);
      setToDateObj(selectedDay);
    } else {
      setToDate('');
      setToDateObj(null);
    }
  };

  // NEW: Create an object of toolbar props to avoid repetition
  const toolbarProps = {
    fromDate,
    toDate,
    sortOrder,
    fromDateObj,
    toDateObj,
    onFromDateChange: handleFromDateChange,
    onToDateChange: handleToDateChange,
    onSortOrderChange: setSortOrder,
  };

  // ---- Loading state (with toolbar) ----
  if (loading) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">تراکنش‌ها</h2>
          <button className="add-transaction-button" onClick={handleOpenModal}>
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

  // ---- Error state (with toolbar) ----
  if (error) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">تراکنش‌ها</h2>
          <button className="add-transaction-button" onClick={handleOpenModal}>
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

  // ---- Main render (with toolbar and filtered transactions) ----
  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">تراکنش‌ها</h2>
        <button className="add-transaction-button" onClick={handleOpenModal}>
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
                            onClick={() => handleEditTransaction(transaction)}
                          >
                            <img src={EditSquareIcon} alt="ویرایش" className="dropdown-item-icon" />
                            <span>ویرایش</span>
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => handleDeleteClick(transaction.id)}
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

      {/* ===== MODALS (unchanged) ===== */}
      {isModalOpen && (
        <Modal
          title={editingTransaction ? 'ویرایش تراکنش' : 'افزودن تراکنش'}
          onClose={handleCloseModal}
        >
          <AddTransactionForm
            mode={editingTransaction ? 'edit' : 'add'}
            initialData={editingTransaction}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}

      {deleteConfirmation.show && (
        <Modal title="" onClose={handleCancelDelete} className="delete-confirmation-modal">
          <p>آیا از حذف تراکنش اطمینان دارید؟</p>
          <div className="delete-actions">
            <button className="cancel-button" onClick={handleCancelDelete} disabled={deleting}>
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
