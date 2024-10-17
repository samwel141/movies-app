
import React from 'react';
import Header from './header';
import Footer from './footer';
import './layout.css'; 

const Layout = ({ isLoggedIn, userProfile, onLogout, children }) => {
  return (
    <div className="layout">
      <Header isLoggedIn={isLoggedIn} userProfile={userProfile} onLogout={onLogout} />
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
