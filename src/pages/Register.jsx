import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  fullName: yup.string().matches(/^[a-zA-Z\s]{2,50}$/, 'Only letters and spaces allowed').required(),
  username: yup.string().matches(/^[a-zA-Z0-9_]{3,20}$/, 'Username must be 3–20 characters').required(),
  idNumber: yup.string().matches(/^\d{13}$/, 'ID must be exactly 13 digits').required(),
  accountNumber: yup.string().matches(/^\d{16}$/, 'Account number must be exactly 16 digits').required(),
  password: yup
    .string()
    .min(8)
    .max(50)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Include uppercase, lowercase, number, special char')
    .required(),
});

export default function Register() {
  const navigate = useNavigate();
  const [mfaQR, setMfaQR] = useState(null);
  const [mfaKey, setMfaKey] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const base = import.meta.env.VITE_API_URL || 'https://localhost:5000';
      const res = await axios.post(`${base}/api/auth/register`, data);
      const { qrCodeUrl, mfaSetupKey } = res.data.data;

      setMfaQR(qrCodeUrl);
      setMfaKey(mfaSetupKey);
      alert('Registered successfully! Scan the QR code below to set up MFA.');

      reset();
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      alert('Registration failed: ' + msg);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0 rounded-3">
            <div className="card-body">
              <h4 className="fw-bold text-primary mb-3">Customer Registration</h4>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {['fullName', 'username', 'idNumber', 'accountNumber', 'password'].map((field, i) => (
                  <div className="mb-3" key={i}>
                    <label className="form-label text-capitalize fw-semibold">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      {...register(field)}
                      type={field === 'password' ? 'password' : 'text'}
                      className="form-control"
                      placeholder={field === 'password' ? 'Enter strong password' : `Enter ${field}`}
                    />
                    <small className="text-danger">{errors[field]?.message}</small>
                  </div>
                ))}

                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100">
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </form>

              {mfaQR && (
                <div className="text-center mt-4">
                  <p className="text-success fw-bold">Scan this QR code with your Authenticator app:</p>
                  <img src={mfaQR} alt="MFA QR" width="200" height="200" />
                  <p className="small mt-2 text-muted">Or use the key: {mfaKey}</p>
                  <button className="btn btn-outline-success mt-2" onClick={() => navigate('/login')}>
                    Proceed to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
