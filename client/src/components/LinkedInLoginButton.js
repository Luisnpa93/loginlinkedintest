import React from 'react';
import linkedinLogo from '../img/LI-Logo.svg.original.svg'; // Update the path to the logo file if needed
import PropTypes from 'prop-types'; // Import PropTypes

const LinkedInLoginButton = ({ linking }) => {
  const handleLogin = () => {
    const url = linking ? 'https://localhost:3001/auth/linkedin/link' : 'https://localhost:3001/auth/linkedin';
    window.location.href = url;
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', // This will make the container take up the full viewport height
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

// Define the propTypes for your component
LinkedInLoginButton.propTypes = {
  linking: PropTypes.bool,
};

// Define the defaultProps for your component
LinkedInLoginButton.defaultProps = {
  linking: false,
};

export default LinkedInLoginButton;