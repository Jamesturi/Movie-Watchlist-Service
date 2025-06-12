import { useAuth } from '../context/AuthContext';

export const AuthState = () => {
  const auth = useAuth();
  console.log('Auth Context State:', {
    isAuthenticated: auth.isAuthenticated,
    hasUser: !!auth.user,
    hasToken: !!auth.token,
    loading: auth.loading,
  });
  return null;
};
