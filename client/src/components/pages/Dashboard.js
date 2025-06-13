import React from 'react';
import { useAuth } from '../../context/auth/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) return <div>Loading user data...</div>;

  return (
    <div className="dashboard">
      <h1>Movie Watchlist Dashboard</h1>
      <div className="user-info">
        <h2>Welcome, {user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Account created: {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="dashboard-actions">
        <button className="btn btn-secondary">View My Watchlist</button>
        <button className="btn btn-secondary">Add New Movie</button>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
