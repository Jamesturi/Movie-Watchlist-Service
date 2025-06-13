import React, { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create context
export const AuthContext = createContext();

// Define initial state
const initialState = {
  token: null,
  isAuthenticated: null,
  user: null,
  loading: true,
  error: null
};

// Create reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'REGISTER_FAIL':
    case 'LOGIN_FAIL':
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configure axios instance
  const api = useMemo(() => {
    const instance = axios.create({ baseURL: '' });
    instance.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      err => Promise.reject(err)
    );
    return instance;
  }, []);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'AUTH_ERROR' });
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          dispatch({ type: 'AUTH_ERROR', payload: 'Token expired' });
          return;
        }

        dispatch({ type: 'REGISTER_SUCCESS', payload: { token } });
        const res = await api.get('/api/auth/me');
        dispatch({ type: 'USER_LOADED', payload: res.data.data.user });
      } catch (err) {
        dispatch({
          type: 'AUTH_ERROR',
          payload: err.response?.data?.message || 'Failed to load user'
        });
      }
    };

    loadUser();
    // eslint-disable-next-line
  }, [api]);

  // Register user
  const register = useCallback(
    async formData => {
      try {
        const res = await api.post('/api/auth/register', formData);
        dispatch({ type: 'REGISTER_SUCCESS', payload: res.data.data });

        const userRes = await api.get('/api/auth/me');
        dispatch({ type: 'USER_LOADED', payload: userRes.data.data.user });
      } catch (err) {
        dispatch({
          type: 'REGISTER_FAIL',
          payload: err.response?.data?.message || 'Registration failed'
        });
        throw err;
      }
    },
    [api]
  );

  // Login user
  const login = useCallback(
    async formData => {
      try {
        const res = await api.post('/api/auth/login', formData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.data });

        const userRes = await api.get('/api/auth/me');
        dispatch({ type: 'USER_LOADED', payload: userRes.data.data.user });
      } catch (err) {
        dispatch({
          type: 'LOGIN_FAIL',
          payload: err.response?.data?.message || 'Invalid credentials'
        });
        throw err;
      }
    },
    [api]
  );

  // Logout
  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);

  // Clear errors
  const clearErrors = useCallback(() => dispatch({ type: 'CLEAR_ERRORS' }), []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      loading: state.loading,
      error: state.error,
      register,
      login,
      logout,
      clearErrors
    }),
    [
      state.token,
      state.isAuthenticated,
      state.user,
      state.loading,
      state.error,
      register,
      login,
      logout,
      clearErrors
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
