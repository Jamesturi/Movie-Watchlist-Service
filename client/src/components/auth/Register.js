import React, {
  useState,
  useEffect,
  memo,
  useCallback
} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';

// Password strength meter component
const PasswordStrengthMeter = memo(({ password }) => {
  if (!password) return null;

  const calculateStrength = pwd => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const strength = calculateStrength(password);

  const getLabel = () => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  const getColor = () => {
    if (strength < 2) return '#f44336';
    if (strength < 4) return '#ff9800';
    return '#4caf50';
  };

  return (
    <div className="password-strength">
      <div className="strength-meter">
        <div
          className="strength-meter-fill"
          style={{
            width: `${(strength / 5) * 100}%`,
            backgroundColor: getColor()
          }}
        />
      </div>
      <div className="strength-label">
        Password strength: {getLabel()}
      </div>
    </div>
  );
});

// Form field with error display and optional password toggle
const FormField = memo(({ name, label, type = 'text', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () =>
    setShowPassword(prev => !prev);

  const fieldType =
    type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <div className="input-container">
        <Field
          id={name}
          name={name}
          type={fieldType}
          className="form-input"
          aria-describedby={`${name}-error`}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label="Toggle password visibility"
          >
            {showPassword ? '👁️' : '🙈'}
          </button>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="error-message"
        id={`${name}-error`}
      />
    </div>
  );
});

// Main registration form component
const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error, clearError } =
    useAuth();

  const [apiError, setApiError] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        'Password must contain uppercase, lowercase, and a number'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref('password'), null],
        'Passwords must match'
      )
      .required('Please confirm your password')
  });

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Handle password input for strength meter
  const handlePasswordChange = useCallback(
    (e, setFieldValue) => {
      const value = e.target.value;
      setPasswordInput(value);
      setFieldValue('password', value);
    },
    []
  );

  // Show API errors
  useEffect(() => {
    if (error) {
      setApiError(error);
      clearError();
    }
  }, [error, clearError]);

  // Redirect on successful auth
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Form submission
  const onSubmit = async (
    values,
    { setSubmitting, resetForm, setStatus }
  ) => {
    try {
      setApiError('');
      await register({
        name: values.name,
        email: values.email,
        password: values.password
      });
      resetForm();
      setStatus({ success: true });
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">
          Join Movie Watchlist to track your favorite movies
        </p>

        {apiError && (
          <div
            className="alert alert-danger"
            role="alert"
            aria-live="assertive"
          >
            {apiError}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, status }) => (
            <Form className="register-form">
              {status?.success && (
                <div className="alert alert-success">
                  Registration successful! Redirecting...
                </div>
              )}

              <FormField
                name="name"
                label="Full Name"
                placeholder="Enter your name"
                autoComplete="name"
              />

              <FormField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
              />

              <div>
                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  onChange={e =>
                    handlePasswordChange(e, setFieldValue)
                  }
                />
                <PasswordStrengthMeter
                  password={passwordInput}
                />
              </div>

              <FormField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
              />

              <button
                type="submit"
                className={`btn btn-primary ${
                  isSubmitting ? 'btn-loading' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Creating Account...'
                  : 'Create Account'}
              </button>

              <div className="form-footer auth-links">
                <p>
                  Already have an account?{' '}
                  <Link to="/login">Sign In</Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
