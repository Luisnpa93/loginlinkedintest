import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LinkedInCallbackPage from './LinkedInCallback';

function Routes() {
  return (
    <BrowserRouter>
      <Route exact path="/linkedin" component={LinkedInCallbackPage} />
    </BrowserRouter>
  );
}

export default Routes;
