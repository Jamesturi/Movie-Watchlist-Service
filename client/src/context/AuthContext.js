// client/src/context/AuthContext.js

import React, {
  createContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  useRef
} from 'react';
import api from '../utils/api';
import { jwtDecode } from 'jwt-decode';  // named import

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Validate JWT expiry
const isValidToken = token => {
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
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const authInterceptorId = useRef(null);

  // Load user if token is valid
  const loadUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      dispatch({ type: 'USER_LOADED', payload: res.data.data.user });
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.message || 'Authentication Error'
      });
    }
  }, []);

  // On mount or token change: validate & load user, setup interceptor
  useEffect(() => {
    // JWT validity check
    if (state.token && isValidToken(state.token)) {
      loadUser();
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: 'Invalid or expired token' });
    }

    // Eject old interceptor if any
    if (authInterceptorId.current !== null) {
      api.interceptors.request.eject(authInterceptorId.current);
    }

    // Add new interceptor for attaching token
    if (state.token) {
      authInterceptorId.current = api.interceptors.request.use(
        config => {
          config.headers.Authorization = `Bearer ${state.token}`;
          return config;
        },
        error => Promise.reject(error)
      );
    }

    // Cleanup on unmount
    return () => {
      if (authInterceptorId.current !== null) {
        api.interceptors.request.eject(authInterceptorId.current);
      }
    };
  }, [state.token, loadUser]);

  const register = useCallback(async userData => {
    try {
      const res = await api.post('/auth/register', userData);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.message || 'Registration failed'
      });
      throw err;
    }
  }, []);

  const login = useCallback(async userData => {
    try {
      const res = await api.post('/auth/login', userData);
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Login failed'
      });
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    // 1. Remove token
    localStorage.removeItem('token');

    // 2. Notify backend (optional)
    if (window.navigator.onLine) {
      api
        .post('/auth/logout', {}, { timeout: 1000 })
        .catch(() =>
          console.log('Backend logout notification failed — continuing local logout')
        );
    }

    // 3. Eject interceptor
    if (authInterceptorId.current !== null) {
      api.interceptors.request.eject(authInterceptorId.current);
      authInterceptorId.current = null;
    }

    // 4. Dispatch logout
    dispatch({ type: 'LOGOUT' });

    // 5. (Optional) Clear any API cache, e.g., react-query
    // queryClient.clear();
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

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
      clearError
    }),
    [state, register, login, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
