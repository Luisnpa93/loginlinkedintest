import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

function HomePage() {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/mainlogin');
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
          cursor: 'pointer',
        }}
        onClick={handleLoginClick}
      >
        login
      </button>
    </div>
  );
}

export default HomePage;