import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import LinkedInLoginButton from './LinkedInLoginButton';
import { useMutation } from 'react-query';
import axiosInstance from './AxiosInstance';


const Mainlogin = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginMutation = useMutation(async (formData) => {
    const response = await axiosInstance.post('/auth/login', formData);
    return response.data;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginMutation.mutateAsync(formData);
      setUser(data.user);
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-lg"> {/* Increase max-width from max-w-xs to max-w-lg */}
        <h1 className="text-3xl text-center mb-4 font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="email"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
            <NavLink to="/request-new-password" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Forgot Password?
            </NavLink>
            <NavLink to="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Back to homepage
            </NavLink>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          <div className="mb-4 flex items-center">
            <p className="mr-4">Login with LinkedIn:</p>
            <LinkedInLoginButton />
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default Mainlogin;
