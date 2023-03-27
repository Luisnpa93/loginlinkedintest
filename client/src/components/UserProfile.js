import React, { useState, useEffect } from 'react';
import * as cookie from 'cookie';

const UserProfile = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch the user data from the server
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access token:', accessToken);

    fetch('https://localhost:3001/auth/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching user data');
        }
      })
      .then((data) => setUser(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {user.linkedinId}</p>
      <p>Name: {user.displayName}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;