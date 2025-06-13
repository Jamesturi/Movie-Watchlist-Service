import React, { useState, useEffect } from 'react';
import { useNavigate }        from 'react-router-dom';
import { useAuth }            from '../../context/auth/AuthContext';

export default function Login() {
  const [form,       setForm]       = useState({ email:'', password:'' });
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login, error, clearErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // show errors from context
  useEffect(() => {
    if (error) {
      setErrors({ general:error });
      setSubmitting(false);
    }
    return () => clearErrors();
  }, [error, clearErrors]);

  // if we’re already logged in, can go straight to dashboard
  useEffect(() => {
    if (!submitting && isAuthenticated) {
      console.log('[Login] already authenticated → navigate');
      navigate('/dashboard', { replace:true });
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
    if (errors[e.target.name]) setErrors(e => ({ ...e, [e.target.name]:null }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    console.log('[Login] handleSubmit');
    if (!validate()) return;

    setSubmitting(true);
    console.log('[Login] calling login()...');
    try {
      await login(form);
      console.log('[Login] login() resolved → nav to /dashboard');
      navigate('/dashboard', { replace:true });
    } catch {
      // error useEffect will clear submitting
    }
  };

  return (
    <div className="form-container">
      <h1>Account <span>Login</span></h1>
      <form onSubmit={onSubmit}>
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className={errors.email?'is-invalid':''}
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
            className={errors.password?'is-invalid':''}
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
