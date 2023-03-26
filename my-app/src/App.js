// App.js

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LinkedInPage from './components/LinkedInPage';
import LinkedInCallback from './components/LinkedInCallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LinkedInPage />} />
        <Route path="/linkedin" element={<LinkedInCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
