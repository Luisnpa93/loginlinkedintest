// NavbarComponent.js

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../css/Navbar-arrow.css';
import { useAuth } from '../auth/authContext';

const NavbarComponent = () => {
  const [showNav, setShowNav] = useState(false);
  const { isAuthenticated, logout, isAdmin } = useAuth();

  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-xs">
      <div className={`fixed left-0 top-0 transition-all duration-300 ease-in-out ${showNav ? 'bg-black w-64' : 'w-0'} h-full z-20`}>
        <div
          className="absolute left-0 top-0 h-full w-full"
          onMouseEnter={() => setShowNav(true)}
          onMouseLeave={() => setShowNav(false)}
        >
          <div className="flex flex-col justify-between h-full pt-4 pb-4">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="arrow-icon mx-auto text-2xl text-black"
              onClick={() => setShowNav(!showNav)}
            />
            <ul className={`text-white ${showNav ? 'block' : 'hidden'}`} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%', padding: '0', margin: '0'}}>
              <li className="py-3">
                <NavLink to="/signup">Signup</NavLink>
              </li>
              <li className="py-3">
                <NavLink to="/mainlogin">Login</NavLink>
              </li>
              <li className="py-3">
                <NavLink to="/settings">Settings</NavLink>
              </li>
              {isAdmin && (
                <li className="py-3">
                  <NavLink to="/admin-settings">Admin Settings</NavLink>
                </li>
              )}
              <li className="py-3">
                <NavLink to="/profile">Profile</NavLink>
              </li>
              <li className="py-3">
                <NavLink to="/about">About</NavLink>
              </li>
              <li className="py-3">
                <NavLink to="/support">Support
                </NavLink>
              </li>
              {isAuthenticated && (
                <li className="py-3">
                  <button type="button" onClick={handleLogoutClick}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className={`bg-black opacity-80 w-full h-full ${showNav ? 'block' : 'hidden'}`}></div>
    </div>
  );
};

export default NavbarComponent;
