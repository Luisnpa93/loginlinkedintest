import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import AdminRegistration from './AdminRegistration';
import UserRoleUpdate from './UserRoleUpdate';


function AdminSettings() {
  const [email, setEmail] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

 
 

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      <UserRoleUpdate />
      <AdminRegistration />
          <NavLink to="/" className="text-blue-500 hover:text-blue-700">
            Back to Homepage
          </NavLink>
        </div>
);
};

export default AdminSettings;
