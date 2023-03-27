import React from 'react';
import { useLinkedIn } from 'react-linkedin-login-oauth2';

function LinkedInPage() {
  const { linkedInLogin } = useLinkedIn({
    clientId: '770rc9csgowpiw',
    redirectUri: 'http://localhost:3000/linkedin',
    onSuccess: (code) => {
      console.log(code);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <button onClick={linkedInLogin}>Sign in with LinkedIn</button>
  );
}

export default LinkedInPage;
