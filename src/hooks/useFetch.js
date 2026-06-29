import { useState, useEffect, useRef, useCallback } from 'react';

// [NEW] Define the base URL for MockAPI from environment variables.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// [NEW] Helper to map local '/api/' paths to MockAPI's '/api/v1/' structure.
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

const useFetch = (url, timeout = 10000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fullUrl = buildApiUrl(url);

  const fetchData = useCallback(
    async (silent = false) => {
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
        const res = await fetchWithTimeout(fullUrl, { signal: controller.signal }, timeout);
        if (!res.ok) throw new Error('خطا در ارتباط با سرور');
        const json = await res.json();
        setData(json);
        if (!silent) setLoading(false);
        return json;
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('خطا در ارتباط با سرور');
        } else {
          setError('درخواست با خطای timeout مواجه شد');
        }
        if (!silent) setLoading(false);
        throw err;
      }
    },
    [fullUrl, timeout]
  );

  useEffect(() => {
    // [NEW] Disable ESLint rule for React Compiler to allow fetching on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData(false);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export { buildApiUrl };
export default useFetch;
