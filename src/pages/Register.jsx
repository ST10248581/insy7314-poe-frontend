import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  fullName: yup
    .string()
    .matches(/^[a-zA-Z\s]{2,50}$/, 'Only letters and spaces allowed')
    .required('Full name is required'),

  username: yup
    .string()
    .matches(/^[a-zA-Z0-9_]{3,20}$/, 'Username must be 3–20 characters, letters/numbers/underscores only')
    .required('Username is required'),

  idNumber: yup
    .string()
    .matches(/^\d{13}$/, 'ID must be exactly 13 digits')
    .required('ID number is required'),

  accountNumber: yup
    .string()
    .matches(/^\d{16}$/, 'Account number must be exactly 16 digits')
    .required('Account number is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be no more than 50 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must include uppercase, lowercase, number, and special character'
    ),
});

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      // Use env var or fallback
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${base}/api/auth/register`, data, { timeout: 8000 });

      if (res.status === 429) {
        const body = await res.json().catch(() => ({}));
        const retryAfter = body.retryAfterSeconds || +res.headers.get('Retry-After') || 60;
        throw { type: 'rate_limit', retryAfter, message: body.error || 'Too many attempts' };
      }


      alert(res.data.message || 'Registered successfully');
      reset();
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Registration failed';
      alert('Registration failed: ' + msg);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-header bg-white border-bottom">
              <h2 className="h4 mb-0 fw-bold text-primary">Customer Registration</h2>
              <p className="text-muted mb-0">Create your account to start making international payments.</p>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name*</label>
                  <input {...register('fullName')} className="form-control" placeholder="Full Name" />
                  <small className="text-danger">{errors.fullName?.message}</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Username*</label>
                  <input {...register('username')} className="form-control" placeholder="Username" />
                  <small className="text-danger">{errors.username?.message}</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">ID Number*</label>
                  <input {...register('idNumber')} className="form-control" placeholder="13 digit ID number" />
                  <small className="text-danger">{errors.idNumber?.message}</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Account Number*</label>
                  <input {...register('accountNumber')} className="form-control" placeholder="16 digit account number" />
                  <small className="text-danger">{errors.accountNumber?.message}</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password*</label>
                  <input {...register('password')} type="password" className="form-control" placeholder="Password" />
                  <small className="text-danger">{errors.password?.message}</small>
                </div>

                <div className="d-flex justify-content-end">
                  <button className="btn btn-primary btn-lg px-4 rounded-pill shadow-sm" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer bg-white border-top text-center">
              <small className="text-muted">Already have an account? <a href="/login">Login</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

/*
Code Attribution
Code by Sobiya, E.
Link:https://dev.to/elizabethsobiya/getting-started-with-yup-validations-in-react-a-beginners-guide-4ec7
Accessed: 8 October 2025

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    zip: Yup.string().required('ZIP code is required'),
  }),
});
 */