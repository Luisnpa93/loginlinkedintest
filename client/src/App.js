import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/authContext';
import { routes } from './configs/routes';

function App() {
 
  return (
    <Router>
      <AuthProvider>
        <div>
          <Routes>
            {routes.map((R) => <Route path={R.path} element={< R.element />} />)}
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;