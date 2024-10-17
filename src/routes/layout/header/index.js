
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import { useAppContext } from '../../../context/appContext';
// import './header.css'; 

// const Header = () => {
//   const navigate = useNavigate();
//   const { profile, isLoggedIn, logout } = useAppContext();
//   const firstLetter = profile?.username?.charAt(0).toUpperCase();

//   return (
//     <header className="header">
//       <div className="logo">Movies App</div>
//       <div className="auth-buttons">
//         {isLoggedIn ? (
//           <>
//            <div className="profile-avatar">{firstLetter}</div>
//             <FontAwesomeIcon 
//               icon={faSignOutAlt} 
//               className="logout-icon" 
//               onClick={logout} 
//             />
//           </>
//         ) : (
//           <>
//             <button onClick={() => navigate('/login')}>Login</button>
//             <button onClick={() => navigate('/register')}>Register</button>
//           </>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;


// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSignOutAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 
// import { useAppContext } from '../../../context/appContext';
// import './header.css'; 

// const Header = () => {
//   const navigate = useNavigate();
//   const location = useLocation(); // Get current location
//   const { profile, isLoggedIn, logout } = useAppContext();
//   const firstLetter = profile?.username?.charAt(0).toUpperCase();

//   return (
//     <header className="header">
//       <div className="logo" onClick={() => navigate('/')}>
//         {location.pathname !== '/' && ( // Check if the current path is not the root
//           <FontAwesomeIcon icon={faArrowLeft} className="back-arrow-icon" />
//         )}
//         Movies App
//       </div>
//       <div className="auth-buttons">
//         {isLoggedIn ? (
//           <>
//             <div className="profile-avatar">{firstLetter}</div>
//             <FontAwesomeIcon 
//               icon={faSignOutAlt} 
//               className="logout-icon" 
//               onClick={logout} 
//             />
//           </>
//         ) : (
//           <>
//             <button onClick={() => navigate('/login')}>Login</button>
//             <button onClick={() => navigate('/register')}>Register</button>
//           </>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;



import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 
import { useAppContext } from '../../../context/appContext';
import './header.css'; 

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const { profile, isLoggedIn, logout } = useAppContext();
  const firstLetter = profile?.username?.charAt(0).toUpperCase();

  // Logout handler with confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      logout();
    }
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')}>
        {location.pathname !== '/' && ( // Check if the current path is not the root
          <FontAwesomeIcon icon={faArrowLeft} className="back-arrow-icon" />
        )}
        Movies App
      </div>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <div className="profile-avatar">{firstLetter}</div>
            <FontAwesomeIcon 
              icon={faSignOutAlt} 
              className="logout-icon" 
              onClick={handleLogout} // Use the logout handler
            />
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
