// client/src/components/pages/Dashboard.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>
      <p>Here’s where you can manage your movie watchlist.</p>
    </div>
  );
};

export default Dashboard;
