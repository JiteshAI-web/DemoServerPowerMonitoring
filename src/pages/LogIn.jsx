import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMqtt } from '../store/Mqtt';
import {loginUser} from '../service/Api'

const LogIn = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(apiUrl)
  const navigate = useNavigate();
  const { storeDataInLS } = useMqtt();

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

//   const handleForm = async (e) => {
//     e.preventDefault();
//     console.log("Sending:", {
//     username: loginData.username,
//     password: loginData.password
//   });
//     try {
//       const response = await axios.post(`${apiUrl}/api/login/`, {
//   username: loginData.username.trim(),
//   password: loginData.password.trim()
// });

//       if (response.status === 200) {
//         storeDataInLS(response.data);
//         setLoginData({
//           username: "",
//           password: ""
//         });
//         navigate('/powermonitoringdashboard', { replace: true });
//       }
//     } catch (error) {
//     console.log("Backend Response:", error.response?.data);
//     console.error('Login failed:', error);
//   }
//   };

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({
        username: loginData.username.trim(),
        password: loginData.password.trim()
      })
      console.log(data);
      //store data
      storeDataInLS(data);
      //reset form
      setLoginData({
        username: '',
        password: ''
      })
      navigate('/powermonitoringdashboard', { replace: true });
    } catch(error) {
      console.log("Backend Response:", error);
      console.error("Login Failed:", error);

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Power Monitoring
        </h2>

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
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;