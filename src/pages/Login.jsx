import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${base}/api/auth/login`, data);

      if (res.status === 429) {
        const body = await res.json().catch(() => ({}));
        const retryAfter = body.retryAfterSeconds || +res.headers.get('Retry-After') || 60;
        throw { type: 'rate_limit', retryAfter, message: body.error || 'Too many attempts' };
      }

      alert(res.data.message || 'Login successful');
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', '1');
      if (res.data.user?.fullName) localStorage.setItem('userName', res.data.user.fullName);
      navigate('/portal');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-header bg-white border-bottom">
              <h2 className="h4 mb-0 fw-bold text-primary">Customer Login</h2>
              <p className="text-muted mb-0">Access your account to make international payments.</p>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    {...register('username', {
                      required: 'Username is required',
                      minLength: { value: 3, message: 'Minimum 3 characters' },
                      maxLength: { value: 20, message: 'Maximum 20 characters' },
                      pattern: { value: /^[a-zA-Z]+$/, message: 'Only letters, numbers, and underscores allowed' }
                    })}
                    className="form-control"
                    placeholder="Username"
                  />
                  <small className="text-danger">{errors.username?.message}</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                      maxLength: { value: 50, message: 'Maximum 50 characters' },
                    })}
                    className="form-control"
                    placeholder="Password"
                  />
                  <small className="text-danger">{errors.password?.message}</small>
                </div>

                <div className="d-flex justify-content-end">
                  <button className="btn btn-primary btn-lg px-4 rounded-pill shadow-sm" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer bg-white border-top text-center">
              <small className="text-muted">Don't have an account? <a href="/register">Register</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
