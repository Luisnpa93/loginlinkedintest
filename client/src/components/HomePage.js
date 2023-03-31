import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';
import LinkedInLoginButton from './LinkedInLoginButton';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const errorParam = urlSearchParams.get('error');
    if (errorParam) {
      setErrorMessage(decodeURIComponent(errorParam));
    }
  }, [location.search]);

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/mainlogin');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  const handleLogoutClick = async () => {
    // Call your backend logout API
    try {
      const response = await fetch('https://localhost:3001/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access token:', accessToken);
      if (response.ok) {
        // Clear any saved user data and/or authentication tokens
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
  
        // Redirect the user to the login page or any other appropriate location
        navigate('/mainlogin');
      } else {
        // Handle errors during the logout process
        console.error('Logout failed:', await response.json());
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  

  
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Home Page</h1>
      <p>Welcome to the home page.</p>
      <button
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          marginRight: '10px',
          cursor: 'pointer',
        }}
        onClick={handleSignupClick}
      >
        Signup
      </button>
      <button
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          marginRight: '10px',
          cursor: 'pointer',
        }}
        onClick={handleLoginClick}
      >
        login
      </button>
      <button
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleProfileClick}
      >
        Profile
      </button>
      <button
      style={{
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        marginLeft: '10px',
        cursor: 'pointer',
      }}
      onClick={handleLogoutClick}
    >
      Logout
    </button>
      <div style={{ marginTop: '20px' }}>
      <LinkedInLoginButton />

      </div>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
    
  );
}

export default HomePage;
