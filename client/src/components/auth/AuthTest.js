import React, { useEffect } from 'react';
import { useAuth } from '../../context/auth/AuthContext';

const AuthTest = () => {
  const auth = useAuth();

  useEffect(() => {
    console.log('Auth Context Test:', {
      isAuthenticated: auth.isAuthenticated,
      loading: auth.loading,
      user: auth.user,
      token: auth.token ? 'Token exists' : 'No token'
    });
  }, [auth]);

  return (
    <div>
      <h3>Auth Context Status:</h3>
      <pre>
        {JSON.stringify(
          {
            isAuthenticated: auth.isAuthenticated,
            loading: auth.loading,
            user: auth.user
              ? { name: auth.user.name, email: auth.user.email, id: auth.user.id || auth.user._id }
              : null
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default AuthTest;
