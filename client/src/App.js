import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthState } from './utils/authTest';

// Layout
import Navbar from './components/layout/Navbar';

// Pages
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/pages/Dashboard';
import NotFound from './components/pages/NotFound';

// Routing
import PrivateRoute from './components/routing/ProtectedRoute';

// Styles
import './App.css';

const App = () => (
  <AuthProvider>
    {/* Outputs current auth context state to the console */}
    <AuthState />

    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add additional protected routes here */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
