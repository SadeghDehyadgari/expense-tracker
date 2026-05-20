import { useState, useMemo, useRef, useEffect } from 'react';

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

  // Track previous dependencies to avoid unnecessary resets
  const prevItemsRef = useRef(items);
  const prevPageSizeRef = useRef(pageSize);

  // Reset to first page only when items or pageSize actually change and current page is not already 1
  useEffect(() => {
    const itemsChanged = prevItemsRef.current !== items;
    const pageSizeChanged = prevPageSizeRef.current !== pageSize;

    if ((itemsChanged || pageSizeChanged) && currentPage !== 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(1);
    }

    prevItemsRef.current = items;
    prevPageSizeRef.current = pageSize;
  }, [items, pageSize, currentPage]);

  // NEW: Direct computation of totalPages (no useEffect needed)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // NEW: Direct computation of safe current page – this replaces the second useEffect
  // OLD: used to have a useEffect that corrected out-of-range pages
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

  // Command: go to specific page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Command: go to next page
  const nextPage = () => {
    if (safeCurrentPage < totalPages) {
      setCurrentPage(safeCurrentPage + 1);
    }
  };

  // Command: go to previous page
  const prevPage = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage(safeCurrentPage - 1);
    }
  };

  return {
    currentPage: safeCurrentPage, // OLD: returned currentPage directly, NEW: returns clamped version
    totalPages,
    currentItems,
    pageNumbers,
    goToPage,
    nextPage,
    prevPage,
  };
};

export default usePagination;
