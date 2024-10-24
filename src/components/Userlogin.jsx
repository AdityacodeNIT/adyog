import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const Userlogin = () => {
  const { getUserDetail } = useContext(UserContext);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        loginData
      );
      if (!response) {
        console.error("Unable to login");
      }
      if (response.status >= 200 && response.status < 300) {
        document.cookie = `accessToken=${response.data.data.accessToken}; path=/`;
        getUserDetail(response.data);

        navigate("/user");
      }
    } catch (error) {
      console.error("Issue in login", error);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-r from-pink-400 mt-2 to-purple-500">
      {/* Left section - Login form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
        <div className="w-full md:w-3/4 p-8 bg-pink-300 shadow-xl rounded-lg border border-white">
          <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-6">
            Login
          </h1>
          <form onSubmit={handleFormSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={loginData.username}
              onChange={handleInputChange}
              required
              className="mb-4 p-2 w-full border-2 border-rose-400 rounded-md transition duration-200 focus:outline-none bg-gray-600 focus:border-rose-600"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleInputChange}
              required
              className="mb-4 p-2 w-full border-2 border-rose-400 rounded-md transition duration-200 focus:outline-none bg-gray-600 focus:border-rose-600"
            />
            <button
              type="submit"
              className="w-full p-3 bg-blue-800 text-white font-bold rounded-md transition duration-200 hover:bg-rose-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Right section - Image */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="/assets/design/login.jpeg" 
          alt="Login Page Illustration"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
};

export default Userlogin;
