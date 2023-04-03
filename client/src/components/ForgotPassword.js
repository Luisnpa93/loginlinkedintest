import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation } from 'react-query';
import axiosInstance from './AxiosInstance.js';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const requestPasswordReset = async (email) => {
    const response = await axiosInstance.post('/password-reset/request-reset', { email }); // Use axiosInstance instead of axios
    return response.data;
  };

  const forgotPasswordMutation = useMutation(requestPasswordReset, {
    onSuccess: () => {
      navigate('/mainlogin');
    },
    onError: () => {
      setError('Failed to request password reset');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(email);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full px-6">
        <h1 className="text-center text-3xl font-bold mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Forgot Password
            </button>
            <div>
              <Link className="text-blue-500 hover:text-blue-700 mr-4" to="/">
                Back to Homepage
              </Link>
            </div>
          </div>
          {forgotPasswordMutation.isError && <p className="text-red-500 mt-4">{forgotPasswordMutation.error.message}</p>}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
