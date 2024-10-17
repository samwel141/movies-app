import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import RegisterPage from '../pages/Register';
import Home from '../pages/Home';
import LoginPage from '../pages/Login';
import MoviesPage from '../pages/MoviesPage';
import Movies from '../pages/Movies';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
// import PrivateRoute from './privateRoute';


const ClientRoutes = () => {
    const Navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/movies/home" element={<Movies />} />
      <Route path="/movies/dashboard" element={<Dashboard />} />
      <Route path="/movies/settings" element={<Settings />} />
      {/* <Route path="/movies" element={<PrivateRoute element={<Movies />} />} /> */}
     
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ClientRoutes;
