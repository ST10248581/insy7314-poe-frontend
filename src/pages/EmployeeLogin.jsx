import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function EmployeeLogin({ setIsEmployeeLoggedIn }) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  // Helper function to clear old employee login data
const clearEmployeeLocalStorage = () => {
  localStorage.removeItem('employeeUsername');
  localStorage.removeItem('employeeMFAQR');
  localStorage.removeItem('tempEmployeeToken');
  localStorage.removeItem('employeeAccessToken');
  localStorage.removeItem('employeeRefreshToken');
  localStorage.removeItem('employeeName');
  localStorage.removeItem('employeeRole');
  localStorage.removeItem('isEmployeeLoggedIn');

  console.log('All employee login data cleared!');
};

  const handleLogin = async (data) => {

    clearEmployeeLocalStorage();
    
    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL || 'https://localhost:5000';
      const res = await axios.post(`${base}/api/employee/employee-login`, data);
      const response = res.data;

      if (response.setup && response.qrCode) {
        localStorage.setItem('employeeUsername', data.username);
        localStorage.setItem('employeeMFAQR', response.qrCode);
        navigate('/employee-mfa-setup');
        return;
      }

      if (!response.setup && response.tempToken) {
        localStorage.setItem('employeeUsername', data.username);
        localStorage.setItem('tempEmployeeToken', response.tempToken);
        navigate('/employee-verify-mfa');
        return;
      }

      if (response.accessToken) {
        localStorage.setItem('employeeAccessToken', response.accessToken);
        localStorage.setItem('employeeRefreshToken', response.refreshToken);
        localStorage.setItem('employeeName', response.user.fullName);
        localStorage.setItem('employeeRole', 'Employee');
        localStorage.setItem('isEmployeeLoggedIn', '1');
        setIsEmployeeLoggedIn(true);
        navigate('/employee-portal');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0">
            <div className="card-body">
              <h4 className="text-primary fw-bold mb-3">Employee Login</h4>
              <form onSubmit={handleSubmit(handleLogin)}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'At least 3 characters' } })}
                    className="form-control"
                  />
                  <small className="text-danger">{errors.username?.message}</small>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                    className="form-control"
                  />
                  <small className="text-danger">{errors.password?.message}</small>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
