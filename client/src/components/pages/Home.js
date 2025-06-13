// client/src/components/pages/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import AuthTest from '../auth/AuthTest';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Movie Watchlist Service</h1>
        <p>Keep track of all the movies you want to watch and have watched</p>
        {!isAuthenticated ? (
          <div className="auth-buttons">
            <Link className="btn btn-primary" to="/register">
              Register
            </Link>
            <Link className="btn btn-secondary" to="/login">
              Login
            </Link>
          </div>
        ) : (
          <Link className="btn btn-primary" to="/dashboard">
            Go to Dashboard
          </Link>
        )}
      </div>

      {/* Auth context test component */}
      <AuthTest />

      <div className="features">
        <div className="feature">
          <i className="fas fa-list" />
          <h3>Create Watchlists</h3>
          <p>Organize movies you want to watch</p>
        </div>
        <div className="feature">
          <i className="fas fa-star" />
          <h3>Rate Movies</h3>
          <p>Keep track of your ratings</p>
        </div>
        <div className="feature">
          <i className="fas fa-check-circle" />
          <h3>Track Watched</h3>
          <p>Mark movies as watched</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
