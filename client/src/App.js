import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth/AuthContext';
import { ErrorProvider } from './context/ErrorContext';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/pages/Dashboard';
import MovieList from './components/pages/MovieList';
import AddMovie from './components/pages/AddMovie';
import EditMovie from './components/pages/EditMovie';
import NotFound from './components/pages/NotFound';
import ApiDiagnostic from './components/ApiDiagnostic';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';

export default function App() {
  return (
    <ErrorProvider>  {/* <-- ErrorProvider wraps everything */}
      <AuthProvider>  {/* <-- AuthProvider inside */}
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              {/* public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* protected */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/api-test" element={<ApiDiagnostic />} />
                <Route path="/movies" element={<MovieList />} />
                <Route path="/movies/add" element={<AddMovie />} />
                <Route path="/movies/:id/edit" element={<EditMovie />} />
              </Route>

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorProvider>
  );
}
