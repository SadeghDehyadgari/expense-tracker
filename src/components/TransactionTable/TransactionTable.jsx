import { useContext, useState, useEffect, useRef } from 'react';
import TransactionContext from '../../context/TransactionContext';
import { toPersianDigits, formatNumber, truncateWords } from '../../utils/formatters'; // MODIFIED: added truncateWords
import { useTooltip } from '../../hooks/useTooltip'; // NEW: custom tooltip hook
import './TransactionTable.css';
import PlusIcon from '../../assets/Outline/Plus.svg';
import DeleteIcon from '../../assets/Outline/Delete.svg';
import EditSquareIcon from '../../assets/Outline/Edit Square.svg';
import DangerCircleIcon from '../../assets/Outline/Danger Circle.svg';

const TransactionTable = ({ onAddTransactionClick, onEditTransaction, onDeleteTransaction }) => {
  const { state } = useContext(TransactionContext);
  const transactions = state.transactions;
  const isEmpty = transactions.length === 0;

  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuAbove, setMenuAbove] = useState(false);
  const menuRef = useRef(null);
  const buttonRefs = useRef({});

  // NEW: Tooltip logic extracted to a custom hook
  const {
    tooltip,
    triggerRef: tooltipTriggerRef,
    hideTooltip,
    handleMouseEnter: tooltipMouseEnter,
    handleMouseLeave: tooltipMouseLeave,
    handleClick: tooltipClick,
  } = useTooltip();

  // MODIFIED: Merged close-handler for both dropdown and tooltip
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

  // Flip dropdown direction if it overflows the scroll container
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

  // NEW: Hide tooltip on any scroll to prevent misalignment
  useEffect(() => {
    if (!tooltip.visible) return;

    const handleScroll = () => hideTooltip();
    window.addEventListener('scroll', handleScroll, true);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [tooltip.visible, hideTooltip]);

  const handleKebabClick = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (id) => {
    onDeleteTransaction(id);
    setOpenMenuId(null);
  };

  const handleEdit = (transaction) => {
    onEditTransaction(transaction);
    setOpenMenuId(null);
  };

  const KebabIcon = (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="2" cy="2" r="1.5" fill="#6B7580" />
      <circle cx="2" cy="8" r="1.5" fill="#6B7580" />
      <circle cx="2" cy="14" r="1.5" fill="#6B7580" />
    </svg>
  );

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">تراکنش‌ها</h2>
        <button className="add-transaction-button" onClick={onAddTransactionClick}>
          <img src={PlusIcon} alt="Plus" className="button-icon" />
          افزودن تراکنش
        </button>
      </div>

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
              {transactions.map((transaction) => {
                const truncatedDesc = truncateWords(transaction.description, 5); // changed from 10 to 5
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
                    {/* MODIFIED: Description cell with tooltip trigger */}
                    <td className="cell-description">
                      {transaction.description ? (
                        hasMoreWords ? (
                          // Long description: attach tooltip handlers
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
                          // Short description: no tooltip, plain span
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
                          <button className="dropdown-item" onClick={() => handleEdit(transaction)}>
                            <img src={EditSquareIcon} alt="ویرایش" className="dropdown-item-icon" />
                            <span>ویرایش</span>
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => handleDelete(transaction.id)}
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

      {/* NEW: Tooltip portal */}
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
