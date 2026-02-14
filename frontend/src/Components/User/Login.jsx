import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import API_BASE_URL from "../../config/api";

const API_URL = `${API_BASE_URL}/users/login`;

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(API_URL, user, { withCredentials: true });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(res.data.message || "Login successful!");
      navigate("/Dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/90 shadow-2xl rounded-3xl p-8">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login to continue to your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <div className="flex items-center border rounded-xl px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-blue-500">
              <Mail className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <div className="flex items-center border rounded-xl px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 shadow-lg 
            ${loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-indigo-600 hover:scale-[1.02]"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Reset */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Forgot password?{" "}
          <span
            onClick={() => navigate("/resetpassword")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Reset here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
