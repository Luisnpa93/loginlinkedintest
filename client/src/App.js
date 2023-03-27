import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LinkedInLoginButton from './components/LinkedInLoginButton';
import LoginCallback from './components/LoginCallback';
import { AuthProvider } from './auth/authContext';
import HomePage from './components/HomePage';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LinkedInLoginButton />} />
            <Route path="/login/callback" element={<LoginCallback />} />
            <Route path="/profile" element={<UserProfile />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
