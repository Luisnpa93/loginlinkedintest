import React from 'react';
import linkedinLogo from '../img/LI-Logo.svg.original.svg'; 

const LinkedInLoginButton = () => {
  const handleLogin = () => {
    window.location.href = 'https://localhost:3001/auth/linkedin';
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', 
  };

  const logoStyle = {
    width: '150px',
    height: 'auto',
    cursor: 'pointer',
  };

  const textStyle = {
    marginTop: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <img
        src={linkedinLogo}
        alt="Login with LinkedIn"
        style={logoStyle}
        onClick={handleLogin}
      />
      <p style={textStyle}>Click the logo to log in using LinkedIn</p>
    </div>
  );
};

export default LinkedInLoginButton;