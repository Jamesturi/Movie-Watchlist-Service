import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../../utils/api'; // adjust this if your api file is elsewhere
import { useError } from '../ErrorContext';  // import ErrorContext for global error handling

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  // Check user authentication on app load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get('/api/auth/user');
          const user = res.data?.data?.user || res.data?.user;
          setCurrentUser(user);
        }
      } catch (err) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  // Register new user
  const register = useCallback(async (name, email, password) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });

      const { data: { token, user } } = res.data;
      console.log("My token  is"+ token);

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setCurrentUser(user);
      return user;
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    }
  }, [showError]);

const login = useCallback(async (email, password) => {
  try {
    const res = await axios.post('/api/auth/login', { email, password });

    const { data: { token, user } } = res.data;

    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setCurrentUser(user);
    return user;
  } catch (err) {
    showError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    throw err;
  }
}, [showError]);


  // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  }, []);

  const isAuthenticated = !!currentUser;

  const value = { currentUser, loading, isAuthenticated, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
