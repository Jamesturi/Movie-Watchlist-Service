import React, { useMemo } from 'react';
import './PasswordStrengthMeter.css';

const PasswordStrengthMeter = ({ password }) => {
  const calculateStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const variety = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(regex => regex.test(password)).length;
    if (variety >= 3) score++;
    score = Math.min(4, Math.floor(score / 2));
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return { score, label: labels[score] };
  }, [password]);

  const { score, label } = calculateStrength;

  if (!password) return null;

  return (
    <div>
      <div className={`strength-meter strength-${score}`}>
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="strength-segment"></div>
        ))}
      </div>
      <p className="strength-label">Password Strength: <span>{label}</span></p>
    </div>
  );
};

export default PasswordStrengthMeter;
