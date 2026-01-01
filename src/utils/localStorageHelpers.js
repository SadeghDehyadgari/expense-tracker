const STORAGE_KEY = 'expenseTrackerData';

export const loadTransactionsFromStorage = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error in loading localStorage', error);
  }
  return [];
};

export const saveTransactionsToStorage = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error in saving localStorage', error);
  }
};
