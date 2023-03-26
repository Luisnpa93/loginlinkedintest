import React, { useState, useEffect } from 'react';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';

export function parseUserFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const userParam = urlParams.get('user');
  if (userParam !== null) {
    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      return user;
    } catch (error) {
      console.error('Failed to parse user data from URL:', error);
    }
  }
  return null;
}

function LinkedInPage() {
  console.log('Rendering LinkedInPage component...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState(null);
  const [isLoginChecked, setIsLoginChecked] = useState(false);

  useEffect(() => {
    console.log('useEffect called in LinkedInPage');
    if (!isLoginChecked) {
      const userFromUrl = parseUserFromUrl();
      console.log('userFromUrl:', userFromUrl);
      if (userFromUrl) {
        setLoggedIn(true);
        setUser(userFromUrl);
      }
      setIsLoginChecked(true);
    }
  }, [loggedIn, isLoginChecked]);

  useEffect(() => {
    if (user) {
      fetch(`https://localhost:3001/auth/welcome?displayName=${encodeURIComponent(user.displayName)}`)
        .then(res => res.text())
        .then(data => {
          console.log(data);
          setWelcomeMessage(data);
        })
        .catch(err => console.error(err));
    }
  }, [user]);
  
  

  return (
    <>
      {error && <p>{error}</p>}
      {loggedIn ? (
        <>
          <p>
            {welcomeMessage}
            You have logged in successfully. Click <a href="/linkedin">here</a>{' '}
            to see your email.
          </p>
        </>
      ) : (
        <a href="https://localhost:3000/auth/linkedin">
          <img
            src={linkedin}
            alt="Sign in with LinkedIn"
            style={{ maxWidth: '180px', cursor: loading ? 'not-allowed' : 'pointer' }}
          />
        </a>
      )}
    </>
  );
}

export default LinkedInPage;
