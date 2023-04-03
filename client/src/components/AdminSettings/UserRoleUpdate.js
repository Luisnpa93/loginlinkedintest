import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://localhost:3001'; 

async function getUserByProp(property, value) {
  try {
    const response = await axios.get(`${API_URL}/user/search`, {
      params: {
        property,
        value,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function UserRoleUpdate() {

    const [email, setEmail] = useState('');
    const [newRoleName, setNewRoleName] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);


   
    async function handleEmailBlur() {
      try {
        const user = await getUserByProp('email', email);
        if (user) {
          setNewRoleName(user.role.name)
        }
      } catch (error) {
        console.error(error);
        console.log('Email is invalid');
      }
    }
    

    const handleUserRoleUpdate = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch(`${API_URL}/roles/update-user-role-by-email`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              newRoleName: newRoleName,
            }),
          });
          console.log(response);
          if (response.ok) {
            setSuccessMessage('User role updated successfully.');
          } else {
            setError('Failed to update user role.');
          }
        } catch (err) {
          setError('Failed to update user role.');
        }
      };
    
    return (
<div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Update User Role</h2>
        <form onSubmit={handleUserRoleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">New Role Name:</label>
            <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                required
            >
                <option value="admin">Admin</option>
                <option value="content manager">Content Manager</option>
                <option value="standard">Standard</option>
            </select>
            </div>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Update User Role
          </button>
        </form>
      </div>
    )
}