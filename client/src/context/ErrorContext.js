// client/src/context/ErrorContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import ErrorMessage from '../components/ErrorMessage';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  
  const showError = useCallback((message) => {
    setError(message);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      <ErrorMessage
        error={error}
        onDismiss={clearError}
        timeout={5000} // Auto-dismiss after 5 seconds
      />
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
