import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LinkedInCallback from './LinkedInCallback';
import LinkedInPage from './l'; // <-- import LinkedInPage component

function Demo() {
  return (
    <Routes>
      <Route path="/" element={<LinkedInPage />} />
      <Route path="/linkedin" element={<LinkedInCallback />} />
    </Routes>
  );
}

export default Demo;
