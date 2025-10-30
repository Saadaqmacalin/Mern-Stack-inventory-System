import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000/api/users";

const UserRegistration = () => {
  const location = useLocation();
  const user = location.state?.user; //  get user passed from GetUsers
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    Status: "USER",
  });

  // ✅ If editing, pre-fill the form
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
        // ✅ Update existing user
        await axios.patch(`${API_URL}/${user._id}`, formData);
        alert("User updated successfully!");
      } else {
        // ✅ Create new user
        await axios.post(API_URL, formData);
        alert("User registered successfully!");
      }

      setLoading(false);
      navigate("/");
    } catch (err) {
      alert("Error: " + err.message);
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
           onClick={()=>navigate("/Users")}
        >
          <FaTimes className="text-base" />
          <span>Close</span>
        </button>
      </div>

      <hr className="border-red-800" />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 mt-4">
          <label htmlFor="name" className="font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your Name"
            required
            className="w-full font-extralight px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
            placeholder="Enter your email"
            required
            className="w-full font-extralight px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
            placeholder="Enter your Password"
            required
            className="w-full font-extralight px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="Status" className="font-medium text-gray-700">
            Role:
          </label>
          <select
            name="Status"
            id="Status"
            value={formData.Status}
            onChange={handleChange} // ✅ fixed
            className="text-sm font-extralight w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <button
          disabled={loading}
          className="text-center text-xl py-2 w-full bg-blue-500 hover:bg-indigo-400 rounded-2xl text-white"
        >
          {loading ? "Processing..." : user ? "Update User" : "Register User"}
        </button>
      </form>
    </div>
  );
};

export default UserRegistration;
