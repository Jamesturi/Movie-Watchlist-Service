import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthMeter from './PasswordStrengthMeter';

// Password regex patterns for validation
const patterns = {
  hasNumber: /\d/,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
  minLength: /.{8,}/
};

// Yup validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .max(100, 'Email cannot exceed 100 characters')
    .test('is-valid-domain', 'Email must have a valid domain', value => {
      if (!value) return true;
      const parts = value.split('@');
      if (parts.length !== 2) return false;
      const domain = parts[1];
      return domain.includes('.') && domain.split('.').pop().length >= 2;
    }),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test('has-number', 'Password must contain at least one number', value => value ? patterns.hasNumber.test(value) : false)
    .test('has-uppercase', 'Password must contain at least one uppercase letter', value => value ? patterns.hasUpperCase.test(value) : false)
    .test('has-lowercase', 'Password must contain at least one lowercase letter', value => value ? patterns.hasLowerCase.test(value) : false)
    .test('has-special-char', 'Password must contain at least one special character', value => value ? patterns.hasSpecialChar.test(value) : false),

  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setRegistrationError('');
      await register(values.name, values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data) {
        const { errors } = error.response.data;
        if (Array.isArray(errors)) {
          errors.forEach(err => {
            if (err.field) setFieldError(err.field, err.message);
          });
        } else {
          setRegistrationError(error.response.data.message || 'Registration failed. Please try again.');
        }
      } else {
        setRegistrationError('Network error. Please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Create an Account</h2>

      {registrationError && <div className="error-message" role="alert">{registrationError}</div>}

      <Formik initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}>

        {({ isSubmitting, touched, errors, values }) => (
          <Form className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <Field type="text" id="name" name="name" placeholder="Enter your full name"
                     className={touched.name && errors.name ? 'input-error' : ''} />
              <ErrorMessage name="name" component="div" className="error-text" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" placeholder="Enter your email"
                     className={touched.email && errors.email ? 'input-error' : ''} autoComplete="email" />
              <ErrorMessage name="email" component="div" className="error-text" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <Field type={showPassword ? "text" : "password"} id="password" name="password"
                       placeholder="Create a password"
                       className={touched.password && errors.password ? 'input-error' : ''} autoComplete="new-password" />
                <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="error-text" />
              {values.password && <PasswordStrengthMeter password={values.password} />}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <Field type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword"
                       placeholder="Confirm your password"
                       className={touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''} autoComplete="new-password" />
                <button type="button" className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className="error-text" />
            </div>

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="auth-links">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
};

export default RegisterForm;
