import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: '#005bb5' }}>
      <div className="container-fluid">
        <button className="navbar-brand fw-bold btn btn-link text-white text-decoration-none" onClick={handleLogout}>IntlBank Portal</button>

        <div className="d-flex align-items-center ms-auto">
          {isLoggedIn ? (
            <>
              <Link className="nav-link text-white me-3" to="/portal">Portal</Link>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link text-white me-3" to="/login">Login</Link>
              <Link className="nav-link text-white" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;