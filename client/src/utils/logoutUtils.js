// client/src/utils/logoutUtils.js

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Hook that provides programmatic logout functionality.
 * @param {string} redirectPath Path to redirect after logout (default: '/login')
 * @returns {Function} Logout function that can be called programmatically
 */
export const useProgrammaticLogout = (redirectPath = '/login') => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return async () => {
    await logout();
    navigate(redirectPath);
  };
};

/**
 * Standalone function to fully logout when auth context is not available
 * (e.g., in error boundaries or outside components)
 */
export const forceLogout = () => {
  localStorage.removeItem('token');
  if (window.axios) {
    delete window.axios.defaults.headers.common['Authorization'];
  }
  window.location.href = '/login';
};

/**
 * Utility to check if a user should be logged out due to token expiration
 */
export const checkTokenExpiration = token => {
  if (!token) return true;
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= tokenData.exp * 1000;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};
