// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Portal from './pages/Portal';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
  const storedLogin = localStorage.getItem('isLoggedIn');
  setIsLoggedIn(storedLogin === '1');
}, []);


  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="mt-4">
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />

          {/* Protect the portal route */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Portal />
              </ProtectedRoute>
            }
          />

          {/* catch-all -> login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
