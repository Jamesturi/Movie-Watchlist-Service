import React, { createContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import api from '../utils/api';
import { jwtDecode } from 'jwt-decode';   // ← use named import here

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

const isValidToken = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'AUTH_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return { ...state, token: null, isAuthenticated: false, loading: false, user: null, error: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, token: null, isAuthenticated: false, loading: false, user: null, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      dispatch({ type: 'USER_LOADED', payload: res.data.data.user });
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.message || 'Authentication Error',
      });
    }
  }, []);

  useEffect(() => {
    if (state.token && isValidToken(state.token)) {
      loadUser();
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: 'Invalid or expired token' });
    }
  }, [loadUser, state.token]);

  const register = useCallback(async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.message || 'Registration failed',
      });
      throw err;
    }
  }, []);

  const login = useCallback(async (userData) => {
    try {
      const res = await api.post('/auth/login', userData);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Login failed',
      });
      throw err;
    }
  }, []);

  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  const value = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      error: state.error,
      register,
      login,
      logout,
      clearError,
    }),
    [state, register, login, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
