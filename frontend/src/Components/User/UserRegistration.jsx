import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useUserContext } from "./userContext";

const API_URL = "http://localhost:5000/api/users";

const UserRegistration = () => {
  const {refreshUsers} = useUserContext()
  const location = useLocation();
  const user = location.state?.user; // Editing user passed from GetUsers

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    Status: "USER",
  });

  // Pre-fill for editing
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: user.password || "",
        Status: user.Status || "USER",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (user) {
        // Update existing user
        await axios.patch(`${API_URL}/${user._id}`, formData);
        alert("User updated successfully!");
        // await refreshUsers();
      } else {
        // Check if user exists
        const checkRes = await axios.get(`${API_URL}?email=${formData.email}`);
        if (Array.isArray(checkRes.data) && checkRes.data.length > 0) {
          alert("⚠️ User already exists!.");
          setLoading(false);
          return;
        }
        // Register new user
        await axios.post(API_URL, formData);
        alert("✅ User registered successfully!");
        await refreshUsers();
      }
      setLoading(false);
      // ✔ Redirect to home page
      navigate("/Dashboard");
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        alert("❌" + (err.response.data?.message || "Something went wrong."));
      } else {
        alert("❌" + err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto p-6 rounded-4xl shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-600">
          {user ? "Edit User" : "User Registration"}
        </h2>
        <button
          className="flex gap-1 items-center font-semibold text-sm text-red-600 px-2 py-2 rounded-lg shadow"
          onClick={() => navigate("/Users")}
        >
          <FaTimes className="text-base" />
          <span>Close</span>
        </button>
      </div>

      <hr className="border-red-800" />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 mt-4">
          <label htmlFor="name" className="font-semibold text-gray-700">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your Name"
            className="w-full font-normal px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full font-normal px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="font-medium text-gray-700">
            Password:
          </label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your Password"
            className="w-full font-normal px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="Status" className="font-medium text-gray-700">
            Role:
          </label>
          <select
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            className="text-sm font-normal w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {/* FIXED BUTTON — No onClick, submits normally */}
        <button
          type="submit"
          disabled={loading}
          className={`text-center text-xl py-2 w-full rounded-2xl text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-indigo-400"
          }`}
        >
          {loading ? "Processing..." : user ? "Update User" : "Register User"}
        </button>

        {/* <h4 className="text-blue600 font-extralight mt-3 ml-18">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </h4> */}
      </form>
    </div>
  );
};

export default UserRegistration;
