import { useEffect, useState } from 'react';
import axios from 'axios';

function EmployeePortal() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('https://localhost:5000/api/payments/all'); // endpoint returns all transactions
        setTransactions(res.data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Could not load transactions. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
          <h2 className="h4 mb-0 fw-bold text-primary">Employee Portal</h2>
        </div>
        <div className="card-body">
          <h5>All Customer Transactions</h5>
          <p className="text-muted">View all payments submitted by customers.</p>

          {loading ? (
            <p>Loading transactions...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <ul className="list-group mt-3">
              {transactions.length === 0 ? (
                <li className="list-group-item text-muted">No transactions yet.</li>
              ) : (
                transactions.map((tx, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between flex-column flex-md-row">
                    <div>
                      <strong>{tx.customer_name}</strong> — {tx.currency} {tx.amount} to {tx.provider}
                    </div>
                    <div className={'text-success' }>
                      Completed
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeePortal;
