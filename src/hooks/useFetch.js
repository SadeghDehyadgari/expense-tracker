import { useState, useEffect, useRef, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// [NEW] Helper to map local '/api/' paths to MockAPI's '/api/v1/' structure.
// [NEW] This prevents us from changing all endpoint strings in the rest of the app.
const buildApiUrl = (path) => {
  return `${BASE_URL}${path.replace(/^\/api\//, '/api/v1/')}`;
};

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
 * @param {string} url - The endpoint to fetch (e.g., '/api/transactions').
 * @param {number} timeout - Request timeout in milliseconds (default 10000).
 * @returns {object} { data, loading, error, refetch }
 */
const useFetch = (url, timeout = 10000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // [NEW] Construct the full URL using the buildApiUrl helper
  const fullUrl = buildApiUrl(url);

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
        // [OLD] const res = await fetchWithTimeout(url, { signal: controller.signal }, timeout);
        // [NEW] Use fullUrl to hit the MockAPI endpoint directly
        const res = await fetchWithTimeout(fullUrl, { signal: controller.signal }, timeout);
        if (!res.ok) throw new Error('خطا در ارتباط با سرور');
        const json = await res.json();
        setData(json);
        if (!silent) setLoading(false);
        return json; // NEW: return data so caller can await and catch errors
      } catch (err) {
        // CHANGED: always set error and re-throw to allow caller to handle (e.g., show toast)
        if (err.name !== 'AbortError') {
          setError('خطا در ارتباط با سرور');
        } else {
          setError('درخواست با خطای timeout مواجه شد');
        }
        if (!silent) setLoading(false);
        throw err; // re-throw so refetch() can be caught
      }
    },
    // [OLD] [url, timeout]
    // [NEW] Added fullUrl to dependencies since it's used inside fetchData
    [fullUrl, timeout]
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

// [NEW] Export buildApiUrl so other contexts can use it for POST/PUT/DELETE requests
export { buildApiUrl };
export default useFetch;
