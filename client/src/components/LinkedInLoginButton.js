import React from 'react';
import linkedinLogo from '../img/LI-Logo.svg.original.svg';

const LinkedInLoginButton = () => {
  const handleLogin = () => {
    window.location.href = 'https://localhost:3001/auth/linkedin';
  };

  const logoStyle = {
    width: '75px',
    height: '75px',
    cursor: 'pointer',
  };

  return (
    <button style={logoStyle} onClick={handleLogin}>
      <img src={linkedinLogo} alt="Login with LinkedIn" />
    </button>
  );
};

export default LinkedInLoginButton;
