import { toPersianDigits } from '../../utils/formatters';
import ArrowRight from '../../assets/Outline/Arrow - Right 2.svg';
import ArrowLeft from '../../assets/Outline/Arrow - Left 2.svg';
import './Pagination.css';

/**
 * Pagination component – RTL friendly, displays page numbers and navigation arrows.
 *
 * @param {number} totalPages - Total number of pages.
 * @param {Array} pageNumbers - Array of { number, isCurrent } objects.
 * @param {function} onPageChange - Callback when a page number is clicked.
 * @param {function} onNext - Callback for next page arrow.
 * @param {function} onPrev - Callback for previous page arrow.
 * @param {boolean} hasNext - Whether a next page exists.
 * @param {boolean} hasPrev - Whether a previous page exists.
 */
const Pagination = ({
  totalPages,
  pageNumbers,
  onPageChange,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      {/* Next arrow (goes to the right in RTL) */}
      <button
        className={`pagination-arrow ${!hasPrev ? 'disabled' : ''}`}
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="صفحه قبل"
      >
        <img src={ArrowRight} alt="قبلی" />
      </button>

      <div className="pagination-numbers">
        {pageNumbers.map((page) => (
          <button
            key={page.number}
            className={`pagination-number ${page.isCurrent ? 'active' : ''}`}
            onClick={() => onPageChange(page.number)}
            aria-label={`صفحه ${toPersianDigits(page.number)}`}
            aria-current={page.isCurrent ? 'page' : undefined}
          >
            {toPersianDigits(page.number)}
          </button>
        ))}
      </div>

      {/* Previous arrow (goes to the left in RTL) */}
      <button
        className={`pagination-arrow ${!hasNext ? 'disabled' : ''}`}
        onClick={onNext}
        disabled={!hasNext}
        aria-label="صفحه بعد"
      >
        <img src={ArrowLeft} alt="" />
      </button>
    </div>
  );
};

export default Pagination;
