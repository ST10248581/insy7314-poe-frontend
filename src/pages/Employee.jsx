import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

export default function Employee() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [msg, setMsg] = useState('');

  const onSubmit = async (data) => {
    try {
      const base = import.meta.env.VITE_API_URL || 'https://localhost:5000';
      const token = localStorage.getItem('employeeAccessToken');
      const res = await axios.post(`${base}/api/employee/add-employee`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-body">
          <h4 className="text-primary fw-bold mb-3">Add Employee</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Employee Full Name</label>
              <input {...register('fullName', { required: 'Required' })} className="form-control" />
              <small className="text-danger">{errors.fullName?.message}</small>
            </div>
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
            <button type="submit" className="btn btn-primary w-100">Add Employee</button>
          </form>
          {msg && <p className="mt-3 text-center">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
