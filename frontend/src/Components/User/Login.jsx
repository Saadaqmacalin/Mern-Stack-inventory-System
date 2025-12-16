import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/users/login";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate before sending
    if (!user.email || !user.password) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      
      const res = await axios.post(API_URL, {
        email: user.email,
        password: user.password,
      });

      if (
        res.data.user.email !== user.email &&
        res.data.user.password !== user.password
      ) {
        alert("email or password are incorret");
        return
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(res.data.message || "Login successful!");
      // alert(`Welcome back, ${user.name || "User"}!`);
      navigate("/Dashboard");
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          alert("Email and password are required.");
        } else if (status === 401) {
          alert(data.message || "Invalid email or password.");
        } else {
          alert(data.message || "Something went wrong.");
        }
      } else {
        alert("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto p-6 rounded-4xl shadow-2xl mt-10">
      <h2 className="text-xl font-bold text-blue-600 text-center mb-4">
        Login
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full font-light px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="font-medium text-gray-700">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="w-full font-light px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`text-center text-xl py-2 w-full rounded-2xl text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-indigo-400"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-4">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/userRegistration")}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;
