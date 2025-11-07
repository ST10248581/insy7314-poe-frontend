import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function EmployeeVerifyMfa({ setIsEmployeeLoggedIn }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('employeeUsername');
  const tempToken = localStorage.getItem('tempEmployeeToken');

  const handleVerify = async (data) => {
  try {
    setLoading(true);

    const base = import.meta.env.VITE_API_URL || 'https://localhost:5000';
    console.log('Sending MFA verify:', { username, tempToken, code: data.code });

    if (!username || !tempToken) {
      alert('Session expired. Please log in again.');
      navigate('/employee-login');
      return;
    }

    const res = await axios.post(`${base}/api/employee/verify-employeemfa`, {
      username,
      code: data.code,
      tempToken
    });

    localStorage.setItem('employeeAccessToken', res.data.accessToken);
    localStorage.setItem('employeeRefreshToken', res.data.refreshToken);
    localStorage.setItem('employeeName', username);
    localStorage.setItem('employeeRole', 'Employee');
    localStorage.setItem('isEmployeeLoggedIn', '1');
    setIsEmployeeLoggedIn(true);
    navigate('/employee-portal');

  } catch (err) {
    alert('MFA verification failed: ' + (err.response?.data?.error || err.message));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h4 className="text-primary fw-bold mb-3">Verify MFA Code</h4>
              <form onSubmit={handleSubmit(handleVerify)}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Enter MFA Code</label>
                  <input
                    type="text"
                    {...register('code', { required: 'Code is required', minLength: { value: 6, message: '6 digits required' } })}
                    className="form-control text-center"
                    placeholder="123456"
                  />
                  <small className="text-danger">{errors.code?.message}</small>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
