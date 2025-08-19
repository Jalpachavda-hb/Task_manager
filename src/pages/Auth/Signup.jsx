import React, { useState } from "react";
import team from "../../assets/team.png";
import { API_PATHS } from "../../utils/apiPaths";
import axiosinstance from "../../utils/axiosinstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ValidateEmail } from "../../utils/helper";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import uploadImage from "../../utils/uploadimage";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setProfileImageFile(file);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let profileImageUrl = "";
    let role = adminCode === "159753951357" ? "admin" : "member";

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!ValidateEmail(email)) newErrors.email = "Please enter a valid email.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      if (profileImageFile) {
        const imgUploadRes = await uploadImage(profileImageFile);
        console.log("Uploaded image response:", imgUploadRes);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      await axiosinstance.post(API_PATHS.AUTH.RAGISTER, {
        name,
        email,
        password,
       ProfileImageUrl: profileImageUrl,
        adminInviteToken: adminCode,
      });

      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-[1100px] bg-white shadow-lg rounded-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold welcome">Welcome</h2>
            <p className="text-sm text-gray-500">Register to get started</p>
          </div>

          <form onSubmit={handleSignUp} noValidate>
            {/* Profile Image Upload */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Profile Image</label>
              <div className="flex items-center gap-4">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Preview"
                    className="w-20 h-20 rounded-full shadow object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <i className="bi bi-person-fill text-gray-500 text-2xl"></i>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm file:px-2 file:py-1 file:border file:rounded file:bg-white file:text-gray-700 file:border-gray-300 w-full max-w-[70%]"
                />
              </div>
            </div>

            {/* Name and Admin Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Admin Code</label>
                <input
                  type="text"
                  placeholder="6 Digit Code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                />
              </div>
            </div>

            {/* Email and Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label className="block font-semibold mb-1">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2 pr-10 border rounded-md ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                />
                <span
                  className="absolute top-9 right-3 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 loginbtn hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
            >
              Register
            </button>

            <div className="mt-4 text-center">
              <a
                href="/login"
                className="text-sm text-gray-600 hover:underline"
              >
                Already have an account?
              </a>
            </div>
          </form>
        </div>

        {/* Right Image Section */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bgcolor">
          <img src={team} alt="Signup" className="p-3 w-full h-auto" />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signup;
