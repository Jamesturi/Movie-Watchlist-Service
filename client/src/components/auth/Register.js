import React, { useState, useEffect } from 'react';
import { useNavigate }        from 'react-router-dom';
import { useAuth }            from '../../context/auth/AuthContext';

const Register = () => {
  const [userData,     setUserData]     = useState({ name: '', email: '', password: '' });
  const [formErrors,   setFormErrors]   = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error, clearErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setFormErrors({ general: error });
      setIsSubmitting(false);
    }
    return () => clearErrors();
  }, [error, clearErrors]);

  const validateForm = () => {
    const errors = {};
    let valid = true;
    if (!userData.name.trim()) {
      errors.name = 'Name is required'; valid = false;
    }
    if (!userData.email.trim()) {
      errors.email = 'Email is required'; valid = false;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Email is invalid'; valid = false;
    }
    if (!userData.password || userData.password.length < 6) {
      errors.password = 'Password must be 6+ chars'; valid = false;
    }
    setFormErrors(errors);
    return valid;
  };

  const onChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: null });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await register(userData);
      setIsSubmitting(false);
      navigate('/dashboard');
    } catch {
      // error effect will clear spinner
    }
  };

  return (
    <div className="form-container">
      <h1>Account <span>Register</span></h1>
      <form onSubmit={onSubmit}>
        {formErrors.general && (
          <div className="alert alert-danger">{formErrors.general}</div>
        )}

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={userData.name}
            onChange={onChange}
            className={formErrors.name ? 'is-invalid' : ''}
          />
          {formErrors.name && (
            <div className="invalid-feedback">{formErrors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            value={userData.email}
            onChange={onChange}
            className={formErrors.email ? 'is-invalid' : ''}
          />
          {formErrors.email && (
            <div className="invalid-feedback">{formErrors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={userData.password}
            onChange={onChange}
            className={formErrors.password ? 'is-invalid' : ''}
          />
          {formErrors.password && (
            <div className="invalid-feedback">{formErrors.password}</div>
          )}
        </div>

        <button className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
