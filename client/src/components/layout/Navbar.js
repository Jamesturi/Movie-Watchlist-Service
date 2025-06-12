import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/movies">Movies</Link></li>
      <li><a onClick={onLogout}><i className="fas fa-sign-out-alt" /> Logout</a></li>
      <li className="welcome-user">Welcome, {user?.name}</li>
    </>
  );

  const guestLinks = (
    <>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <h1 className="navbar-logo"><Link to="/">Movie Watchlist</Link></h1>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
