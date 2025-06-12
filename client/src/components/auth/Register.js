import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
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
    const { name, email, password, password2 } = formData;
    if (!name || !email || !password) {
      setFormError('Please enter all fields');
      return;
    }
    if (password !== password2) {
      setFormError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch {}
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for Movie Watchlist</h2>
        {formError && <div className="alert alert-danger">{formError}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>
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
              minLength="6"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              id="password2"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={onChange}
              minLength="6"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
