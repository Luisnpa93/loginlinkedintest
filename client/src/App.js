import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/authContext';
import { routes } from './configs/routes';
import NavbarComponent from './components/NavbarComponent';


//usequery


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
        <NavbarComponent />
          <div>
            <Routes>
              {routes.map((R) => (
                <Route key={R.key} path={R.path} element={<R.element />} />
              ))}
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
