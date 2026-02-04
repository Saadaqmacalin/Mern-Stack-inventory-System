import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import {
  FaHome,
  FaBox,
  FaUsers,
  FaTruck,
  FaShoppingCart,
  FaChartBar,
  FaBrain,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaStar,
  FaTrophy,
  FaChartLine,
  FaWarehouse,
  FaHandshake,
  FaClipboardList,
  FaUser,
  FaLayerGroup
} from 'react-icons/fa';

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, user, actions } = useAppContext();
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: FaHome,
      permission: 'dashboard',
      description: 'Overview and analytics',
    },
    {
      title: 'Products',
      path: '/products',
      icon: FaBox,
      permission: 'products',
      description: 'Manage inventory',
    },
    {
      title: 'Categories',
      path: '/categories',
      icon: FaLayerGroup,
      permission: 'products',
      description: 'Inventory classifications',
    },
    {
      title: 'Sales',
      path: '/sales',
      icon: FaShoppingCart,
      permission: 'sales',
      description: 'Sales transactions',
    },
    {
      title: 'Orders',
      path: '/orders',
      icon: FaClipboardList,
      permission: 'orders',
      description: 'Customer orders',
    },
    {
      title: 'Customers',
      path: '/customers',
      icon: FaUsers,
      permission: 'customers',
      description: 'Customer management',
    },
    {
      title: 'Suppliers',
      path: '/suppliers',
      icon: FaTruck,
      permission: 'suppliers',
      description: 'Supplier relationships',
    },
    {
      title: 'Purchases',
      path: '/purchases',
      icon: FaShoppingCart,
      permission: 'purchases',
      description: 'Inventory intake',
    },
    {
      title: 'Analytics',
      path: '/analytics',
      icon: FaChartLine,
      permission: 'analytics',
      description: 'Reports and insights',
    },
    {
      title: 'Predictions',
      path: '/predictions',
      icon: FaBrain,
      permission: 'predictions',
      description: 'AI predictions',
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: FaFileAlt,
      permission: 'reports',
      description: 'Generate reports',
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: FaCog,
      permission: 'settings',
      description: 'System settings',
    },
  ];
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <FaWarehouse className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">InventoryPro</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Management System</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <FaTimes className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {/* User Profile */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <FaUser className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin User'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <div className={`flex items-center space-x-3 ${
                    active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    <item.icon className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className={`text-xs ${
                        active ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {active && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </NavLink>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={actions.logout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 group"
            >
              <FaSignOutAlt className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
