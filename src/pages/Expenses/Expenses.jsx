// CHANGED: Now a simple wrapper; all modal & delete logic moved to TransactionTable
// (to eliminate prop drilling — TransactionTable uses TransactionContext directly).
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import './Expenses.css';

function Expenses() {
  return (
    <div className="expenses-page">
      <TransactionTable />
    </div>
  );
}

export default Expenses;
