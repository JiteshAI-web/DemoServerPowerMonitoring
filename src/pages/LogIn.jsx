import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMqtt } from '../store/Mqtt';
import { loginUser } from '../service/Api';

const LogIn = () => {
  const [loginData, setLoginData] = useState({
    username: 'bariflolabs.deploy@gmail.com',
    password: 'Bariflo2026'
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { storeDataInLS } = useMqtt();

  const handleChange = (e) => {
    setError('');
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({
        username: loginData.username.trim(),
        password: loginData.password.trim()
      });
      storeDataInLS(data);
      setLoginData({
        username: '',
        password: ''
      });
      navigate('/powermonitoringdashboard', { replace: true });
    } catch (err) {
      console.error("Login Failed:", err);
      setError(err?.message || "Login failed. Please check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Power Monitoring
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleForm}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email / Username
            </label>
            <input
              name="username"
              type="text"
              required
              value={loginData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={loginData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;