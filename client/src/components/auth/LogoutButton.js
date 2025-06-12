// client/src/components/auth/LogoutButton.js

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = ({
  className = '',
  variant = 'button',
  redirectTo = '/login',
  showConfirmation = true,
  buttonText = 'Logout'
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = useCallback(() => {
    if (showConfirmation) {
      setShowDialog(true);
    } else {
      performLogout();
    }
  }, [showConfirmation]);

  const performLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate(redirectTo);
    } catch (error) {
      console.error('Error during logout:', error);
      navigate(redirectTo);
    } finally {
      setIsLoggingOut(false);
      setShowDialog(false);
    }
  }, [logout, navigate, redirectTo]);

  const cancelLogout = useCallback(() => {
    setShowDialog(false);
  }, []);

  if (variant === 'link') {
    return (
      <>
        <a className={className} onClick={handleLogoutClick}>
          {isLoggingOut ? 'Logging out...' : buttonText}
        </a>
        {showDialog && (
          <LogoutConfirmation
            onConfirm={performLogout}
            onCancel={cancelLogout}
            isLoggingOut={isLoggingOut}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button className={`${className} logout-button`} onClick={handleLogoutClick}>
        {isLoggingOut ? 'Logging out...' : buttonText}
      </button>
      {showDialog && (
        <LogoutConfirmation
          onConfirm={performLogout}
          onCancel={cancelLogout}
          isLoggingOut={isLoggingOut}
        />
      )}
    </>
  );
};

const LogoutConfirmation = ({ onConfirm, onCancel, isLoggingOut }) => {
  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-dialog" role="dialog" aria-labelledby="logout-title">
        <div className="modal-content">
          <div className="modal-header">
            <h3 id="logout-title">Confirm Logout</h3>
            <button className="close-button" onClick={onCancel}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to log out?</p>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onCancel} disabled={isLoggingOut}>
              Cancel
            </button>
            <button className="logout-button" onClick={onConfirm} disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutButton;
