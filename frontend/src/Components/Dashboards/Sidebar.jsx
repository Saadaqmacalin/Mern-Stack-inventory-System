import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaBox,
  FaShoppingCart,
  FaChartBar,
  FaUser,
  FaQuestionCircle,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const logeduser = JSON.parse(localStorage.getItem("user"));

  const clearLocalStorage = () => {
    localStorage.clear();
    navigate("/"); // redirect to login/home
  };

  return (
    <div className="w-60 min-h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6 text-indigo-400">
        Admin Dashboard
      </h2>
      <hr className="text-gray-500" />

      <nav className="flex flex-col gap-2 mt-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaHome size={20} className="text-gray-400" />
            <span>Dashboard</span>
          </div>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex items-center gap-2">
            <FaUsers size={20} className="text-gray-400" />
            <h6>Users</h6>
          </div>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaBox size={20} className="text-gray-400 " />
            <span>Products</span>
          </div>
        </NavLink>

        <hr className="text-gray-500" />
        <h6 className="text-gray-400 font-extralight">MANAGEMENT</h6>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaShoppingCart size={20} className="text-gray-400 " />
            <span>Orders</span>
          </div>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaChartBar size={20} className="text-gray-400 " />
            <span>Report</span>
          </div>
        </NavLink>

        <hr className="text-gray-500" />
        <h6 className="text-gray-400 font-extralight">SETTINGS</h6>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaUser size={20} className="text-gray-400 " />
            <span>Profile</span>
          </div>
        </NavLink>

        <NavLink
          to="/help"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaQuestionCircle size={20} className="text-gray-400 " />
            <span>Help</span>
          </div>
        </NavLink>

        <div className="mt-70 text-l">
          {logeduser ? (
            logeduser.status === "ADMIN" ? (
              <h4>{logeduser.name} Logged as Admin</h4>
            ) : (
              <h4>{logeduser.name} Logged as User</h4>
            )
          ) : (
            <h4 className="text-gray-400 font-medium">No user logged in</h4>
          )}

          <button
            onClick={clearLocalStorage}
            
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
