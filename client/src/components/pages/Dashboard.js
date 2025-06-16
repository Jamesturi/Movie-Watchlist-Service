import React from 'react';
import { useAuth } from '../../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return <div>Loading user data...</div>;

  return (
    <div className="dashboard">
      <h1>Movie Watchlist Dashboard</h1>
      <div className="user-info">
        <h2>Welcome, {currentUser.name}</h2>
        <p>Email: {currentUser.email}</p>
        <p>Account created: {new Date(currentUser.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="dashboard-actions">
        <button className="btn btn-secondary">View My Watchlist</button>
        <button className="btn btn-secondary" onClick={() => navigate('/movies/add')}>Add New Movie</button>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
