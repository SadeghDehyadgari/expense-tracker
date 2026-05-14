import { useState, useEffect, useRef, useCallback } from 'react';

// Helper: fetch with timeout to prevent hanging on network loss
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(id));
};

/**
 * Custom hook for fetching data from a URL.
 * Supports silent refetch (doesn't trigger loading state) with timeout.
 *
 * @param {string} url - The endpoint to fetch.
 * @param {number} timeout - Request timeout in milliseconds (default 10000).
 * @returns {object} { data, loading, error, refetch }
 */
const useFetch = (url, timeout = 10000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  // Core fetch logic – returns the parsed JSON or throws an error
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
        setError(null);
      }

      try {
        // CHANGED: use fetchWithTimeout to prevent hanging
        const res = await fetchWithTimeout(url, { signal: controller.signal }, timeout);
        if (!res.ok) throw new Error('خطا در ارتباط با سرور');
        const json = await res.json();
        setData(json);
        if (!silent) setLoading(false);
        return json; // NEW: return data so caller can await and catch errors
      } catch (err) {
        // CHANGED: always set error and re-throw to allow caller to handle (e.g., show toast)
        if (err.name !== 'AbortError') {
          setError(err.message);
        } else {
          setError('درخواست با خطای timeout مواجه شد');
        }
        if (!silent) setLoading(false);
        throw err; // re-throw so refetch() can be caught
      }
    },
    [url, timeout]
  );

  // Initial fetch on mount / url change
  useEffect(() => {
    fetchData(false);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Public refetch – silent by default, but throws on failure
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useFetch;
