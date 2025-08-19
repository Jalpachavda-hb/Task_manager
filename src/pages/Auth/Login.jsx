import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import team from "../../assets/all.png";
import "./Login.css";
import { ValidateEmail } from "../../utils/helper";
import axiosinstance from "../../utils/axiosinstance";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;

    // Reset error messages
    setEmailError("");
    setPasswordError("");
    setError("");

    if (!ValidateEmail(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!password) {
      setPasswordError("Please enter the password");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await axiosinstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        if (role === "admin") {
          navigate("/admin/dashboard"); // assuming you imported useNavigate
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message); // shows: Invalid email or password
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }

    console.log("Logging in with:", { email, password });
  };

  return (
    <>
     <div className="min-h-screen flex justify-center items-center bg-gray-100">
  <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col lg:flex-row p-0">
    {/* Form Section */}
    <div className="w-full lg:w-1/2 p-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold welcome">Welcome Back</h2>
        <p className="text-sm text-gray-500">Login to continue to your dashboard</p>
      </div>

      <form onSubmit={handleLogin} noValidate>
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              emailError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />
          {emailError && (
            <div className="text-red-500 mt-1 text-sm">{emailError}</div>
          )}
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label htmlFor="password" className="block font-semibold mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className={`w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute top-9 right-3 cursor-pointer text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {passwordError && (
            <div className="text-red-500 mt-1 text-sm">{passwordError}</div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 loginbtn hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
        >
          Login
        </button>

        {/* Signup Link */}
        <div className="mt-4 text-center">
          <a
            href="/signup"
            className="text-sm text-gray-500 hover:underline"
          >
            Don&apos;t have an account?
          </a>
        </div>
      </form>
    </div>

    {/* Image Section */}
    <div className="hidden lg:flex w-1/2 items-center justify-center bgcolor">
      <img src={team} alt="Login Illustration" className="p-3 w-full h-auto" />
    </div>
  </div>

  <ToastContainer position="top-right" autoClose={3000} />
</div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Login;
