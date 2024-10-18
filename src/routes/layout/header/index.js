
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 
import { useAppContext } from '../../../context/appContext';
import './header.css'; 

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isLoggedIn, logout } = useAppContext();
  const firstLetter = profile?.username?.charAt(0).toUpperCase();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      logout();
    }
  };

  return (
    <header className="header">
      <div 
        className="logo" 
        onClick={() => navigate('/')} 
        data-tour="header-logo"
      >
        {location.pathname !== '/' && ( 
          <FontAwesomeIcon icon={faArrowLeft} className="back-arrow-icon" data-tour="header-back-arrow" />
        )}
        Movies App
      </div>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <div className="profile-avatar" data-tour="header-avatar">
              {firstLetter}
            </div>
            <FontAwesomeIcon 
              icon={faSignOutAlt} 
              className="logout-icon" 
              onClick={handleLogout} 
              data-tour="header-logout"
            />
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} data-tour="header-login">
              Login
            </button>
            <button onClick={() => navigate('/register')} data-tour="header-register">
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
