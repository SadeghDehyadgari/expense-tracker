import { useState, useMemo, useEffect } from 'react'; // CHANGED: removed useRef

/**
 * Custom hook for pagination logic.
 * Follows Command-Query Separation: commands (goToPage, nextPage, prevPage) modify internal state,
 * query values (currentPage, totalPages, currentItems, pageNumbers) are derived.
 *
 * @param {Array} items - The list of items to paginate (e.g., filtered transactions).
 * @param {number} pageSize - Number of items per page.
 * @returns {Object} Pagination state and control functions.
 */
const usePagination = (items, pageSize) => {
  const [currentPage, setCurrentPage] = useState(1);

  // NEW: Directly reset to page 1 whenever items or pageSize change.
  //      setCurrentPage(1) does NOT cause an extra render if already 1.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [items, pageSize]);

  // NEW: Direct computation of totalPages (no useEffect needed)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // NEW: we clamp the page to valid range directly during render
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Get items for current page (using safeCurrentPage)
  const currentItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, safeCurrentPage, pageSize]);

  // Generate array of page numbers to display (using safeCurrentPage)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, isCurrent: i === safeCurrentPage });
      }
      return pages;
    }

    let start = Math.max(1, safeCurrentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push({ number: i, isCurrent: i === safeCurrentPage });
    }
    return pages;
  }, [safeCurrentPage, totalPages]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (safeCurrentPage < totalPages) {
      setCurrentPage(safeCurrentPage + 1);
    }
  };

  const prevPage = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage(safeCurrentPage - 1);
    }
  };

  return {
    currentPage: safeCurrentPage,
    totalPages,
    currentItems,
    pageNumbers,
    goToPage,
    nextPage,
    prevPage,
  };
};

export default usePagination;
