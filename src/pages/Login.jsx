import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [tempToken, setTempToken] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleLogin = async (data) => {
    try {
      const base = import.meta.env.VITE_API_URL || 'https://localhost:5000';
      const res = await axios.post(`${base}/api/auth/login`, data);
      setUsername(data.username);
      setTempToken(res.data.tempToken); // backend returns a temp token before MFA
      setStep(2);
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleVerifyMFA = async (data) => {
    try {
      const base = import.meta.env.VITE_API_URL || 'https://localhost:5000';
      const res = await axios.post(`${base}/api/auth/verify-mfa`, {
        username,
        code: data.code,
        tempToken,
      });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('userName', username);
      setIsLoggedIn(true);
      navigate('/portal');
    } catch (err) {
      alert('MFA verification failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0">
            <div className="card-body">
              <h4 className="text-primary fw-bold mb-3">Customer Login</h4>
              {step === 1 ? (
                <form onSubmit={handleSubmit(handleLogin)}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input {...register('username', { required: 'Required' })} className="form-control" />
                    <small className="text-danger">{errors.username?.message}</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input type="password" {...register('password', { required: 'Required' })} className="form-control" />
                    <small className="text-danger">{errors.password?.message}</small>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Next</button>
                </form>
              ) : (
                <form onSubmit={handleSubmit(handleVerifyMFA)}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Enter MFA Code</label>
                    <input {...register('code', { required: 'Enter your 6-digit code' })} className="form-control" />
                    <small className="text-danger">{errors.code?.message}</small>
                  </div>
                  <button type="submit" className="btn btn-success w-100">Verify</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
