import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LinkedInLoginButton from './LinkedInLoginButton';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axiosInstance from './AxiosInstance';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signup = async (data) => {
    const response = await axiosInstance.post('/auth/signup', data);
    return response.data;
  };

  const mutation = useMutation(signup, {
    onError: () => {
      setError('Signup failed');
    },
    onSuccess: () => {
      navigate('/mainlogin');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full px-6">
        <h1 className="text-center text-3xl font-bold mb-6">Signup</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Username:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Password:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Signup
            </button>
            <div>
              <Link className="text-blue-500 hover:text-blue-700 mr-4" to="/">
                Back to Homepage
              </Link>
              
            </div>
          </div>
        </form>
        {error && <p>{error}</p>}
        <div className="mb-4 flex items-center">
          <p className="mr-4">Sign Up with LinkedIn:</p>
          <LinkedInLoginButton />
        </div>
      </div>
    </div>
  );
}

export default Signup;
