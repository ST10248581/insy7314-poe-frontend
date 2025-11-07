import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ isLoggedIn, setIsLoggedIn, isEmployeeLoggedIn, setIsEmployeeLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async (type) => {
    try {
      const base = import.meta.env.VITE_API_URL || 'https://localhost:5000';
      let refreshToken;

      if (type === 'employee') {
        refreshToken = localStorage.getItem('employeeRefreshToken');
      } else {
        refreshToken = localStorage.getItem('refreshToken');
      }

      if (refreshToken) {
        await axios.post(`${base}/api/auth/logout`, { refreshToken });
      }

      // Clear relevant stored data
      if (type === 'employee') {
        localStorage.removeItem('employeeAccessToken');
        localStorage.removeItem('employeeRefreshToken');
        localStorage.removeItem('employeeName');
        localStorage.removeItem('employeeRole');
        localStorage.removeItem('isEmployeeLoggedIn');
        setIsEmployeeLoggedIn(false);
        navigate('/employee-login');
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed. Please try again.');
    }
  };

  // Read localStorage in case of refresh
  const showEmployeeMenu = isEmployeeLoggedIn || localStorage.getItem('isEmployeeLoggedIn') === '1';
  const showCustomerMenu = isLoggedIn || localStorage.getItem('isLoggedIn') === '1';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: '#005bb5' }}>
      <div className="container-fluid">
        <button
          className="navbar-brand fw-bold btn btn-link text-white text-decoration-none"
          onClick={() => navigate('/')}
        >
          IntlBank Portal
        </button>

        <div className="d-flex align-items-center ms-auto">
          {showEmployeeMenu ? (
            <>
              <Link className="nav-link text-white me-3" to="/employee-portal">Employee Portal</Link>
              <Link className="nav-link text-white me-3" to="/employee-transaction">Customer Transactions</Link>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => handleLogout('employee')}
              >
                Logout
              </button>
            </>
          ) : showCustomerMenu ? (
            <>
              <Link className="nav-link text-white me-3" to="/portal">Portal</Link>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => handleLogout('customer')}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link text-white me-3" to="/login">Customer Login</Link>
              <Link className="nav-link text-white me-3" to="/employee-login">Employee Login</Link>
              <Link className="nav-link text-white" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
