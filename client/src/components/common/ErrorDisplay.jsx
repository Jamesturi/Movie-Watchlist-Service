// client/src/components/common/ErrorDisplay.jsx
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorDisplay = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`flex items-center text-red-500 ${className}`}>
      <FaExclamationTriangle className="mr-2" />
      <span>{error}</span>
    </div>
  );
};

export default ErrorDisplay;
