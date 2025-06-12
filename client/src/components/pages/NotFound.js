// client/src/components/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container">
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you’re looking for doesn’t exist.</p>
    <Link to="/">Go back home</Link>
  </div>
);

export default NotFound;
