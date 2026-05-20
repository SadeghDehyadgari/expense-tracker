import { useContext, useEffect, useState } from 'react';
import TransactionContext from '../../context/TransactionContext';
import { toPersianDigits, formatNumber, truncateWords } from '../../utils/formatters';
import { useTooltip } from '../../hooks/useTooltip';
import Modal from '../Modal/Modal';
import AddTransactionForm from '../AddTransactionForm/AddTransactionForm';
import { useToast } from '../../hooks/useToast';
import useTransactionFilters from '../../hooks/useTransactionFilters';
import useTransactionModal from '../../hooks/useTransactionModal';
import useDeleteConfirmation from '../../hooks/useDeleteConfirmation';
import useKebabMenu from '../../hooks/useKebabMenu';
// NEW: Import pagination hook and component
import usePagination from '../../hooks/usePagination';
import Pagination from '../Pagination/Pagination';
import TransactionToolbar from './TransactionToolbar';
import './TransactionTable.css';
import PlusIcon from '../../assets/Outline/Plus.svg';
import DeleteIcon from '../../assets/Outline/Delete.svg';
import EditSquareIcon from '../../assets/Outline/Edit Square.svg';
import DangerCircleIcon from '../../assets/Outline/Danger Circle.svg';

const TransactionTable = () => {
  // NEW: Responsive page size detection
  const [pageSize, setPageSize] = useState(window.innerWidth < 768 ? 8 : 13);

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 768 ? 8 : 13);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const {
    show: showDeleteModal,
    deleting,
    confirmDelete,
    cancelDelete,
    handleConfirmDelete,
  } = useDeleteConfirmation(deleteTransaction, showErrorToast);

  const {
    filteredTransactions,
    sortOrder,
    setSortOrder,
    fromDateObj,
    toDateObj,
    setFromDateObj,
    setToDateObj,
  } = useTransactionFilters(transactions);

  // NEW: Use pagination hook with filtered transactions and dynamic page size
  const { currentItems, currentPage, totalPages, pageNumbers, goToPage, nextPage, prevPage } =
    usePagination(filteredTransactions, pageSize);

  const { openMenuId, menuAbove, menuRef, buttonRefs, handleKebabClick, closeMenu } =
    useKebabMenu();

  const isEmpty = filteredTransactions.length === 0;

  const {
    tooltip,
    triggerRef: tooltipTriggerRef,
    hideTooltip,
    handleMouseEnter: tooltipMouseEnter,
    handleMouseLeave: tooltipMouseLeave,
    handleClick: tooltipClick,
  } = useTooltip();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltip.visible &&
        tooltipTriggerRef.current &&
        !tooltipTriggerRef.current.contains(event.target)
      ) {
        hideTooltip();
      }
    };

    if (tooltip.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltip.visible, hideTooltip, tooltipTriggerRef]);

  useEffect(() => {
    if (!tooltip.visible) return;

    const handleScroll = () => hideTooltip();
    window.addEventListener('scroll', handleScroll, true);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [tooltip.visible, hideTooltip]);

  const KebabIcon = (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="2" cy="2" r="1.5" fill="#6B7580" />
      <circle cx="2" cy="8" r="1.5" fill="#6B7580" />
      <circle cx="2" cy="14" r="1.5" fill="#6B7580" />
    </svg>
  );

  const toolbarProps = {
    fromDateObj,
    toDateObj,
    sortOrder,
    onFromDateChange: setFromDateObj,
    onToDateChange: setToDateObj,
    onSortOrderChange: setSortOrder,
  };

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
          <>
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
                {/* CHANGED: Use currentItems instead of filteredTransactions */}
                {currentItems.map((transaction) => {
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
                          onClick={(e) => handleKebabClick(transaction.id, e)}
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
                              onClick={() => {
                                openEditModal(transaction);
                                closeMenu();
                              }}
                            >
                              <img
                                src={EditSquareIcon}
                                alt="ویرایش"
                                className="dropdown-item-icon"
                              />
                              <span>ویرایش</span>
                            </button>
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                confirmDelete(transaction.id);
                                closeMenu();
                              }}
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
            {/* NEW: Pagination component - show only if there are transactions and more than one page */}
            {filteredTransactions.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageNumbers={pageNumbers}
                onPageChange={goToPage}
                onNext={nextPage}
                onPrev={prevPage}
                hasNext={currentPage < totalPages}
                hasPrev={currentPage > 1}
              />
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <Modal title={editingTransaction ? 'ویرایش تراکنش' : 'افزودن تراکنش'} onClose={closeModal}>
          <AddTransactionForm
            mode={editingTransaction ? 'edit' : 'add'}
            initialData={editingTransaction}
            onCancel={closeModal}
          />
        </Modal>
      )}

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
              autoFocus
              disabled={deleting}
            >
              {deleting ? 'در حال حذف...' : 'حذف'}
            </button>
          </div>
        </Modal>
      )}

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
