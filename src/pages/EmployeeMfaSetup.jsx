import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EmployeeMfaSetup() {
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('employeeUsername');

  useEffect(() => {
    const generateMfa = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || 'https://localhost:5000';
        const res = await axios.post(`${base}/api/employee/generate-employeemfa`, { username });
        setQrCode(res.data.qrCode);
        setSecret(res.data.secret);
      } catch (err) {
        alert('Failed to generate MFA setup: ' + (err.response?.data?.error || err.message));
      }
    };
    if (username) generateMfa();
  }, [username]);

  return (
    <div className="container text-center mt-5">
      <h3 className="text-primary fw-bold mb-3">Set Up MFA</h3>
      <p>Scan the QR code below using Microsoft Authenticator or any Authenticator App.</p>

      {qrCode && (
        <div className="d-flex justify-content-center my-3">
          <img src={qrCode} alt="MFA QR" className="img-fluid" style={{ width: 200 }} />
        </div>
      )}

      {secret && (
        <div className="mt-3">
          <p>Or enter this code manually:</p>
          <code>{secret}</code>
        </div>
      )}

      <button
        className="btn btn-success mt-4"
        onClick={() => navigate('/employee-verify-mfa')}
      >
        I have scanned the QR / Entered code
      </button>
    </div>
  );
}
