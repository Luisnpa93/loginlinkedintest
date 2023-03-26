import React, { useState, useEffect } from 'react';

function LinkedInCallback() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('useEffect called in LinkedInCallback');
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    console.log('userParam:', userParam);
    if (userParam) {
      const userData = JSON.parse(decodeURIComponent(userParam));
      console.log('userData:', userData);
      setEmail(userData.email);
      setUser(userData);
    }
  }, []);

  console.log('email:', email);
  console.log('user:', user);


  return email ? (
    <div>
      <h1>Welcome!</h1>
      <p>LinkedIn ID: {user.id}</p>
      <p>Display Name: {user.displayName}</p>
      <p>Email: {email}</p>
    </div>
  ) : (
    <p>Something went wrong. Please try again.</p>
  );
}

export default LinkedInCallback;