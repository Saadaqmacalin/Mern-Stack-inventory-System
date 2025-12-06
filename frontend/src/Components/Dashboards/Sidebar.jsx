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
    // ✨ CHANGES MADE HERE:
    // 1. Added 'fixed', 'top-0', 'left-0' to lock its position.
    // 2. Changed 'min-h-screen' to 'h-screen' for fixed height.
    // 3. Added 'flex flex-col' to enable internal layout control.
    // 4. Added 'z-10' to ensure it sits above main content.
    <div className="w-60 h-screen bg-gray-800 text-white p-4 fixed top-0 left-0 flex flex-col z-10">
      
      {/* Sidebar Header */}
      <div className="flex-shrink-0">
        <h2 className="text-xl font-bold mb-6 text-indigo-400">
          Admin Dashboard
        </h2>
        <hr className="text-gray-500" />
      </div>

      {/* Navigation Links (This will grow and push the footer down) */}
      <nav className="flex flex-col gap-2 mt-6 flex-grow overflow-y-auto">
        <NavLink
          to="/Dashboard"
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
        <NavLink
          to="/Categories"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaBox size={20} className="text-gray-400 " />
            <span>Categories</span>
          </div>
        </NavLink>
        <NavLink
          to="/sppliers"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaBox size={20} className="text-gray-400 " />
            <span>Sppliers</span>
          </div>
        </NavLink>
        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaBox size={20} className="text-gray-400 " />
            <span>customers</span>
          </div>
        </NavLink>
        <NavLink
          to="/puchase"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaBox size={20} className="text-gray-400 " />
            <span>Purchases</span>
          </div>
        </NavLink>
        <NavLink
          to="/sales"
          className={({ isActive }) =>
            isActive
              ? "bg-indigo-600 p-2 rounded text-white"
              : "hover:bg-gray-700 p-2 rounded"
          }
        >
          <div className="flex space-x-2">
            <FaBox size={20} className="text-gray-400 " />
            <span>Sales</span>
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
      </nav>

      {/* User Info and Logout (Will stick to the bottom) */}
      <div className="flex-shrink-0 mt-auto pt-4 border-t border-gray-700"> 
        <div className="text-l">
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
      </div>
    </div>
  );
}

export default Sidebar;