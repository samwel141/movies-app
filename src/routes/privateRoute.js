
import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token'); 

  if (!token) {
    toast.error('You must be logged in to access this page.'); 
    return <Navigate to="/" replace />;
  }

  return element; 
};

export default PrivateRoute;
