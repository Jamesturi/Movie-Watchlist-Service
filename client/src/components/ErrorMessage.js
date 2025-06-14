import React from 'react';
import PropTypes from 'prop-types';
import './ErrorMessage.css';

const ErrorMessage = ({ error, onDismiss, timeout }) => {
  React.useEffect(() => {
    // Auto-dismiss after timeout if provided
    if (timeout && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [timeout, onDismiss]);

  if (!error) return null;
  
  return (
    <div>
      <div className="error-content">
        <span>⚠️</span>
        <p>{error}</p>
        {onDismiss && (
          <button onClick={onDismiss}>×</button>
        )}
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.string,
  onDismiss: PropTypes.func,
  timeout: PropTypes.number
};

export default ErrorMessage;
