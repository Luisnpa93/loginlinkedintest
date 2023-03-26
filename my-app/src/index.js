import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import LinkedInPage from './components/l';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LinkedInPage />
  </BrowserRouter>
);