import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import { useError } from '../../context/ErrorContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { showError } = useError();
  const navigate = useNavigate();

  // Navigate to dashboard if already authenticated
  useEffect(() => {
    if (!submitting && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, submitting, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email is invalid';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(e => ({ ...e, [e.target.name]: null }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Account <span>Login</span></h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className={errors.email ? 'is-invalid' : ''}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            className={errors.password ? 'is-invalid' : ''}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
