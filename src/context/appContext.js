import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileFromStorage = () => {
    const storedProfile = localStorage.getItem('mov-user');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };



  const logout = () => {
    localStorage.removeItem('mov-token');
    localStorage.removeItem('mov-user');
    toast.info('User logged out successiful')
    setProfile(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    fetchProfileFromStorage();
    setLoading(false);
  }, [setIsLoggedIn, isLoggedIn, setProfile]);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    profile,
    logout,
    movies,
    setMovies,
    setLoading,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { AppProvider, useAppContext };
