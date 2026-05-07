import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for fetching data from a URL.
 * Supports silent refetch (doesn't trigger loading state).
 *
 * Returns { data, loading, error, refetch }.
 */
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep a ref for the current AbortController so we can abort stale requests
  const abortControllerRef = useRef(null);

  // Core fetch logic reused by both initial fetch and refetch
  const fetchData = useCallback(
    async (silent = false) => {
      // Abort any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (!silent) {
        setLoading(true);
        setError(null);
      } else {
        // For silent fetch we only reset error; loading stays unchanged
        setError(null);
      }

      try {
        const res = await fetch(url, { signal: controller.signal });
        // CHANGED: throw Persian error message directly (preserved from original context)
        if (!res.ok) throw new Error('خطا در ارتباط با سرور');
        const json = await res.json();
        // Reverse to match previous behavior (most recent first)
        json.reverse();
        setData(json);
        if (!silent) {
          setLoading(false);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          // CHANGED: use err.message directly (already Persian)
          setError(err.message);
          if (!silent) {
            setLoading(false);
          }
        }
        // AbortError – do nothing
      }
    },
    [url]
  );

  // Initial fetch on mount / url change
  useEffect(() => {
    fetchData(false); // not silent -> shows loading
    // On cleanup, abort any pending request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Public refetch function that can be called silently (without loading)
  // Made async so callers can await it (e.g., after mutation).
  const refetch = useCallback(async () => {
    await fetchData(true); // silent update
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useFetch;
