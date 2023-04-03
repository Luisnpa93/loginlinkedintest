import { createContext, useContext, useState } from 'react';
import { navigate } from '@reach/router';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = async () => {
    try {
      const response = await fetch('https://localhost:3001/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access token:', accessToken);
      if (response.ok) {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setUser(null);
        navigate('/mainlogin');
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = user?.role?.name === 'admin';
  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    logout,
    isAdmin
  };
  //console.log('value:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
