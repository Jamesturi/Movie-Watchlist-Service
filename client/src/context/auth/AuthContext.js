// client/src/context/auth/AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import api from '../../utils/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearErrors = useCallback(() => setError(null), []);

  useEffect(() => {
    const initAuth = () => {
      try {
        const rawUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        console.log('[AuthContext:init]', { rawUser, token });
        if (token && rawUser && rawUser !== 'undefined' && rawUser !== 'null') {
          setUser(JSON.parse(rawUser));
        }
      } catch (e) {
        console.error('Auth init error', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/register', userData);
      // API returns { success, data: { token, user } }
      const { token, user: registeredUser } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (creds) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', creds);
      // API returns { success, data: { token, user } }
      const { token, user: loggedInUser } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      register,
      login,
      logout,
      clearErrors,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
