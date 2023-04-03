import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './auth/authContext';
import { routes } from './configs/routes';
import NavbarComponent from './components/NavbarComponent';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </div>
  );
}

export default App;
