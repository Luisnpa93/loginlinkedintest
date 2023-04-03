import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMutation } from 'react-query';
import axiosInstance from './AxiosInstance';

function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const location = useLocation();

  const resetPassword = async (data) => {
    const response = await axiosInstance.put('/password-reset/reset', data);
    return response.data;
  };

  const mutation = useMutation(resetPassword, {
    onError: (error) => {
      setError("Something went wrong. Please try again later.");
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = new URLSearchParams(location.search).get("token");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const data = {
      token,
      password,
    };

    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full px-6">
        <h1 className="text-center text-3xl font-bold mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">New Password:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Confirm Password:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Loading..." : "Reset Password"}
            </button>
            <div>
              <Link className="text-blue-500 hover:text-blue-700" to="/">
                Back to Homepage
              </Link>
            </div>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;
