import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider }        from './context/auth/AuthContext';

import Navbar                  from './components/layout/Navbar';
import Home                    from './components/pages/Home';
import Login                   from './components/auth/Login';
import Register                from './components/auth/Register';
import Dashboard               from './components/pages/Dashboard';
import ApiDiagnostic           from './components/ApiDiagnostic';
import PrivateRoute            from './components/routing/PrivateRoute';

import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            {/* public */}
            <Route path="/"        element={<Home />} />
            <Route path="/login"   element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* protected */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/api-test"  element={<ApiDiagnostic />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
