// TransactionContext.jsx
import { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';

const TransactionContext = createContext();

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };

    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        loading: false,
        error: null,
      };

    // KEPT for future (not used in current API flow)
    case 'ADD_TRANSACTION': {
      const newTransaction = {
        ...action.payload,
        id: Date.now(),
      };
      return {
        ...state,
        transactions: [newTransaction, ...state.transactions],
      };
    }

    // NEW: add a transaction directly to state (optimistic)
    case 'PREPEND_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    // NEW: update a transaction in place
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    // KEPT for compatibility, will use UPDATE_TRANSACTION instead
    case 'EDIT_TRANSACTION': {
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id
            ? { ...transaction, ...action.payload.updatedData }
            : transaction
        ),
      };
    }

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((transaction) => transaction.id !== action.payload),
      };

    default:
      return state;
  }
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Initial fetch with cleanup (AbortController) and client-side sort
  useEffect(() => {
    const abortController = new AbortController();
    const loadTransactions = async () => {
      dispatch({ type: 'SET_LOADING' });
      try {
        const res = await fetch('http://localhost:3000/transactions', {
          signal: abortController.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch');
        let data = await res.json();
        // NEW: sort descending by id so newest transactions appear first
        data.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        dispatch({ type: 'SET_TRANSACTIONS', payload: data });
      } catch (err) {
        // Don't update state if the request was aborted
        if (err.name !== 'AbortError') {
          dispatch({ type: 'SET_ERROR', payload: err.message });
        }
      }
    };
    loadTransactions();
    // Cleanup: abort fetch if provider unmounts
    return () => abortController.abort();
  }, []);

  // Memoize async functions so they don't change on every render
  const addTransaction = useCallback(async (data) => {
    try {
      const res = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Could not add transaction');
      const newTransaction = await res.json();
      dispatch({ type: 'PREPEND_TRANSACTION', payload: newTransaction });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []); // No dependencies, dispatch is stable

  const editTransaction = useCallback(async (id, updatedData) => {
    try {
      const res = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Could not edit transaction');
      const updatedTransaction = await res.json();
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Could not delete transaction');
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  // Memoize the context value to avoid unnecessary re-renders of consumers
  const contextValue = useMemo(
    () => ({ state, dispatch, addTransaction, editTransaction, deleteTransaction }),
    [state, addTransaction, editTransaction, deleteTransaction]
  );

  return <TransactionContext.Provider value={contextValue}>{children}</TransactionContext.Provider>;
};

export default TransactionContext;
