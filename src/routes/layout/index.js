

import React, { useState } from 'react';
import Header from './header';
import Footer from './footer';
import { useAppContext } from '../../context/appContext';
import Joyride from 'react-joyride';
import './layout.css'; 

const Layout = ({ isLoggedIn, userProfile, onLogout, children,   }) => {
 const { runTour, setRunTour } = useAppContext();

  const steps = [
    {
      target: '[data-tour="header-logo"]',
      content: 'This is the logo. Click here to go back to the home page.'
    },
    {
      target: '[data-tour="header-login"]',
      content: 'Click here to login to your account.'
    },
    {
      target: '[data-tour="header-signup"]',
      content: 'If you don\'t have an account, sign up here!'
    },
    {
      target: '[data-tour="header-avatar"]',
      content: 'This is your profile avatar. Click here to view your profile.'
    },
    {
      target: '[data-tour="header-logout"]',
      content: 'Click here to log out of your account.'
    },
    {
      target: '[data-tour="continue"]',
      content: 'Click here to navigate to movies page.'
    },
    {
      target: '[data-tour="movies"]',
      content: 'Browse movies in Movies link, but for Dashboard and settings pages you have to login.'
    }
  ];

  return (
    <div className="layout">
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={(data) => {
          if (data.status === 'finished') {
            setRunTour(false);
          }
        }}
      />
      <Header isLoggedIn={isLoggedIn} userProfile={userProfile} onLogout={onLogout} />
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
