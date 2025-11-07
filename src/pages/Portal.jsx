import { useEffect, useState } from 'react';
import axios from 'axios';

function Portal() {
  const [name, setName] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    currency: '',
    provider: '',
    accountNumber: '',
    swiftCode: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('userName') || '';
    setName(stored);

    if (stored) {
      axios
        .get('http://localhost:5000/api/payments', {
          params: { customerName: stored }
        })
        .then(res => setTransactions(res.data))
        .catch(err => console.error('Failed to fetch transactions:', err));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a valid number';
    }

    if (!formData.currency) {
      newErrors.currency = 'Currency is required';
    }

    if (!formData.provider) {
      newErrors.provider = 'Payment provider is required';
    }

    if (!formData.accountNumber || !/^\d{16}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must be exactly 16 digits';
    }

    if (!formData.swiftCode || formData.swiftCode.length < 8 || formData.swiftCode.length > 11) {
      newErrors.swiftCode = 'SWIFT code must be 8–11 characters';
    }

    if (!name || name.trim().length < 2) {
      newErrors.customerName = 'Customer name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post('https://localhost:5000/api/payments', {
        amount: parseFloat(formData.amount),
        currency: formData.currency.trim(),
        provider: formData.provider.trim(),
        accountNumber: formData.accountNumber.trim(),
        swiftCode: formData.swiftCode.trim(),
        customerName: name.trim()
      });

      alert('Payment submitted successfully!');

      const res = await axios.get('https://localhost:5000/api/payments', {
        params: { customerName: name }
      });

      setTransactions(res.data);
      setFormData({
        amount: '',
        currency: '',
        provider: '',
        accountNumber: '',
        swiftCode: ''
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please check your input or try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
          <h2 className="h4 mb-0 fw-bold text-primary">Customer Portal</h2>
        </div>
        <div className="card-body">
          <h5>Welcome{ name ? `, ${name}` : '' }!</h5>
          <p className="text-muted">You're logged in and ready to make international payments.</p>

          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input
                type="number"
                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                id="amount"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
              />
              {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="currency" className="form-label">Currency</label>
              <select
                className={`form-select ${errors.currency ? 'is-invalid' : ''}`}
                id="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="">Select currency</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="ZAR">ZAR - South African Rand</option>
              </select>
              {errors.currency && <div className="invalid-feedback">{errors.currency}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="provider" className="form-label">Payment Provider</label>
              <select
                className={`form-select ${errors.provider ? 'is-invalid' : ''}`}
                id="provider"
                value={formData.provider}
                onChange={handleChange}
              >
                <option value="">Choose provider</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Wise">Wise</option>
                <option value="PayPal">PayPal</option>
              </select>
              {errors.provider && <div className="invalid-feedback">{errors.provider}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="accountNumber" className="form-label">Account Number</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={16}
                className={`form-control ${errors.accountNumber ? 'is-invalid' : ''}`}
                id="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={handleChange}
              />
              {errors.accountNumber && <div className="invalid-feedback">{errors.accountNumber}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="swiftCode" className="form-label">SWIFT Code</label>
              <input
                type="text"
                className={`form-control ${errors.swiftCode ? 'is-invalid' : ''}`}
                id="swiftCode"
                placeholder="Enter SWIFT code"
                value={formData.swiftCode}
                onChange={handleChange}
              />
              {errors.swiftCode && <div className="invalid-feedback">{errors.swiftCode}</div>}
            </div>

            {errors.customerName && (
              <div className="alert alert-danger">{errors.customerName}</div>
            )}

            <button type="submit" className="btn btn-primary">Pay Now</button>
          </form>

          <div className="mt-5">
            <h6 className="fw-bold">Recent Transactions</h6>
            <p className="text-muted">Your recent payments will appear here once available.</p>
            <ul className="list-group">
              {transactions.length === 0 ? (
                <li className="list-group-item text-muted">No transactions yet.</li>
              ) : (
                transactions.map((tx, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{tx.currency} {tx.amount} to {tx.provider}</span>
                    <span className={tx.status === 'Completed' ? 'text-success' : 'text-warning'}>
                      {tx.status}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portal;