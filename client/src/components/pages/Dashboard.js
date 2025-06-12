// client/src/components/dashboard/Dashboard.js

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../auth/LogoutButton';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="profile-header">
        <div className="profile-avatar">
          {user && user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{user && user.name}</h2>
          <p>{user && user.email}</p>
        </div>
      </div>

      <div className="card">
        <h3>My Watchlist</h3>
        <p>You have 0 movies in your watchlist.</p>
        <button>Add Movies</button>
      </div>
    </div>
  );
};

export default Dashboard;
