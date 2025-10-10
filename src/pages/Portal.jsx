import { useEffect, useState } from 'react';

function Portal() {
  const [name, setName] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('userName') || '';
    setName(stored);
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
          <h2 className="h4 mb-0 fw-bold text-primary">Customer Portal</h2>
        </div>
        <div className="card-body">
          <h5>Welcome{name ? `, ${name}` : ''}!</h5>
          <p className="text-muted">You're logged in and ready to make international payments.</p>

          <form className="mt-4">
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input type="number" className="form-control" id="amount" placeholder="Enter amount" />
            </div>

            <div className="mb-3">
              <label htmlFor="currency" className="form-label">Currency</label>
              <select className="form-select" id="currency">
                <option value="">Select currency</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="ZAR">ZAR - South African Rand</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="provider" className="form-label">Payment Provider</label>
              <select className="form-select" id="provider">
                <option value="">Choose provider</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Wise">Wise</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">Submit Payment</button>
          </form>

          <div className="mt-5">
            <h6 className="fw-bold">Recent Transactions</h6>
            <p className="text-muted">Your recent payments will appear here once available.</p>
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                <span>USD $250 to Wise</span>
                <span className="text-success">Completed</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>EUR €100 to PayPal</span>
                <span className="text-warning">Pending</span>
              </li>
              {/* Recent Transactions list */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portal;
