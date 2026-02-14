import React, { useMemo } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import {
  FaUsers,
  FaHome,
  FaBox,
  FaShoppingCart,
  FaChartBar,
  FaUser,
  FaQuestionCircle,
  FaTruck,
  FaTags,
  FaMoneyBillWave,
  FaClipboardList
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, actions, user } = useAppContext();

  const handleLogout = () => {
    actions.logout();
    navigate("/login");
  };

  const menuItems = useMemo(() => [
    { path: "/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/products", label: "Products", icon: FaBox },
    { path: "/categories", label: "Categories", icon: FaTags }, // Changed path from /DisplayCategories
    { path: "/customers", label: "Customers", icon: FaUsers },
    { path: "/suppliers", label: "Suppliers", icon: FaTruck },
    { path: "/sales", label: "Sales", icon: FaMoneyBillWave },
    { path: "/purchases", label: "Purchases", icon: FaClipboardList },
    { path: "/orders", label: "Orders", icon: FaShoppingCart },
    { path: "/reports", label: "Reports", icon: FaChartBar },
  ], []);

  const bottomItems = useMemo(() => [
    { path: "/profile", label: "Profile", icon: FaUser },
    { path: "/help", label: "Help", icon: FaQuestionCircle },
  ], []);

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-white"
        }`
      }
    >
      <item.icon className={`text-lg transition-transform group-hover:scale-110`} />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 ease-in-out z-30 
        ${sidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-72 lg:translate-x-0"}
      `}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
           <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <FaBox className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                  Inventory
                </h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
           </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Main Menu
            </h3>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>

          <div>
             <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Settings
            </h3>
             <div className="space-y-1">
              {bottomItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
             </div>
          </div>
        </nav>

        {/* User Info and Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center p-3 rounded-xl bg-white dark:bg-gray-800/50 mb-3 border border-gray-200 dark:border-gray-700/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="ml-3 overflow-hidden">
               <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
               <p className="text-xs text-gray-400 truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2.5 px-4 rounded-xl transition-all duration-200 border border-red-500/20 hover:border-red-500"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
