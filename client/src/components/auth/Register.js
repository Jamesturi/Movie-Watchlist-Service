import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';

const Register = () => {
  const [user, setUser] = useState({ name: '', email: '', password: '', password2: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error, clearErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
    // eslint-disable-next-line
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      setFormErrors({ general: error });
      setIsSubmitting(false);
    }
    return () => error && clearErrors();
    // eslint-disable-next-line
  }, [error]);

  const validateForm = () => {
    const errors = {};
    let valid = true;

    if (!user.name.trim()) {
      errors.name = 'Name is required';
      valid = false;
    }
    if (!user.email.trim()) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Email is invalid';
      valid = false;
    }
    if (!user.password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (user.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    if (user.password !== user.password2) {
      errors.password2 = 'Passwords do not match';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const onChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: null });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await register({
        name: user.name,
        email: user.email,
        password: user.password
      });
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1>
        Account <span>Register</span>
      </h1>
      <form onSubmit={onSubmit}>
        {formErrors.general && <div className="alert alert-danger">{formErrors.general}</div>}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={user.name}
            onChange={onChange}
            className={formErrors.name ? 'is-invalid' : ''}
          />
          {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={user.email}
            onChange={onChange}
            className={formErrors.email ? 'is-invalid' : ''}
          />
          {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={user.password}
            onChange={onChange}
            className={formErrors.password ? 'is-invalid' : ''}
          />
          {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            id="password2"
            type="password"
            name="password2"
            value={user.password2}
            onChange={onChange}
            className={formErrors.password2 ? 'is-invalid' : ''}
          />
          {formErrors.password2 && <div className="invalid-feedback">{formErrors.password2}</div>}
        </div>
        <button className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
