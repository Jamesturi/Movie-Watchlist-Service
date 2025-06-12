import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error, clearError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
    if (error) {
      setFormError(error);
      clearError();
    }
  }, [isAuthenticated, error, clearError, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setFormError('Please enter all fields');
      return;
    }
    try {
      await login(formData);
      navigate('/dashboard');
    } catch {}
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Movie Watchlist</h2>
        {formError && <div className="alert alert-danger">{formError}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <p className="auth-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
