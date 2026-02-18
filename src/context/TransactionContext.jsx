import { createContext, useReducer, useEffect } from 'react';
import {
  loadTransactionsFromStorage,
  saveTransactionsToStorage,
} from '../utils/localStorageHelpers';

const TransactionContext = createContext();

const initialState = {
  transactions: loadTransactionsFromStorage(),
};

const transactionReducer = (state, action) => {
  switch (action.type) {
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

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((transaction) => transaction.id !== action.payload),
      };

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

    default:
      return state;
  }
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  useEffect(() => {
    saveTransactionsToStorage(state.transactions);
  }, [state.transactions]);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;
