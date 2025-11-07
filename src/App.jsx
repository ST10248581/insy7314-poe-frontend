import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Portal from './pages/Portal';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeLogin from './pages/EmployeeLogin';
import Employee from './pages/Employee';
import EmployeeMfaSetup from './pages/EmployeeMfaSetup';
import EmployeeVerifyMfa from './pages/EmployeeVerifyMfa'; // <--- new
import EmployeePortal from './pages/EmployeePortal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedEmployeeLogin = localStorage.getItem('isEmployeeLoggedIn');

    setIsLoggedIn(storedLogin === '1');
    setIsEmployeeLoggedIn(storedEmployeeLogin === '1');
  }, []);

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isEmployeeLoggedIn={isEmployeeLoggedIn}
        setIsEmployeeLoggedIn={setIsEmployeeLoggedIn}
      />
      <main className="mt-4">
        <Routes>
          {/* Customer routes */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />

          {/* Employee routes */}
          <Route
            path="/employee-login"
            element={<EmployeeLogin setIsEmployeeLoggedIn={setIsEmployeeLoggedIn} />}
          />
          <Route path="/employee-mfa-setup" element={<EmployeeMfaSetup />} />
          <Route
            path="/employee-verify-mfa"
            element={<EmployeeVerifyMfa setIsEmployeeLoggedIn={setIsEmployeeLoggedIn} />}
          />

          {/* Protected routes */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Portal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-portal"
            element={
              <ProtectedRoute isLoggedIn={isEmployeeLoggedIn}>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-transaction"
            element={
              <ProtectedRoute isLoggedIn={isEmployeeLoggedIn}>
                <EmployeePortal />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
