// client/src/hooks/useAuth.js

import { useContext } from 'react';
import { AuthContext } from '../context/auth/AuthContext';

// Custom hook to consume AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
