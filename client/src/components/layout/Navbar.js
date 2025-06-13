import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const authLinks = (
    <>
      <li className="welcome">Hello, {user && user.name}</li>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt" /> <span>Logout</span>
        </a>
      </li>
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
      <h1>
        <Link to="/">
          <i className="fas fa-film" /> Movie Watchlist
        </Link>
      </h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </nav>
  );
};

export default Navbar;
