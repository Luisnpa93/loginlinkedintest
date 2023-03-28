import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({ nickname: '', occupation: '' });

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
      .then((data) => { 
        console.log('Received user data:', data); // Log the user data
      setUser(data)})
      
      .catch((error) => console.error('Error:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  
    // Save the form data to the server
    const accessToken = localStorage.getItem('accessToken');
    fetch('https://localhost:3001/user-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ...formData, userId: user.id }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error saving user profile data');
        }
      })
      .then((data) => console.log('User profile data saved:', data))
      .catch((error) => console.error('Error:', error));
    };

  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {user.linkedinId}</p>
      <p>Name: {user.displayName}</p>
      <p>Email: {user.email}</p>

      <h2>Complete your profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nickname">Nickname:</label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
        />

        <label htmlFor="occupation">Occupation:</label>
        <input
          type="text"
          id="occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserProfile;