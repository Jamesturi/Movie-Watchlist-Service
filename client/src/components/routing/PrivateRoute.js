import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth }          from '../../context/auth/AuthContext';

export default function PrivateRoute() {
  const { loading, isAuthenticated } = useAuth();
  console.log('[PrivateRoute]', { loading, isAuthenticated });

  if (loading) return <div>Checking authentication…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
