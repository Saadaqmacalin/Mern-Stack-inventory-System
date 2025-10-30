// Sidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Single sidebar link component
const SidebarLink = ({ name, path, icon }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg mb-1 transition-colors duration-150 
        ${isActive
          ? 'bg-indigo-600 font-semibold text-white shadow-md'
          : 'hover:bg-gray-700 text-gray-300'}`
      }
      end={path === '/'} // root path exact match
    >
      <span className="mr-3 text-lg">{icon}</span>
      <span className="text-sm">{name}</span>
    </NavLink>
  );
};

// Navigation items (main links)
const navItems = [
  { name: 'Dashboard', path: '/', icon: '🏠' },
  { name: 'Users', path: '/users', icon: '👥' },
  { name: 'Products', path: '/products', icon: '📦' },
];

// Grouped navigation items
const navGroups = [
  {
    title: 'Management',
    items: [
      { name: 'Orders', path: '/orders', icon: '🛒' },
      { name: 'Reports', path: '/reports', icon: '📊' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { name: 'Profile', path: '/profile', icon: '👤' },
      { name: 'Preferences', path: '/preferences', icon: '⚙️' },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white flex flex-col p-4 shadow-2xl sticky top-0">
      {/* Branding / Logo */}
      <div className="text-2xl font-extrabold mb-8 text-indigo-400 border-b border-gray-700 pb-4">
        Admin Dashboard
      </div>

      {/* Navigation */}
      <nav className="flex flex-col">
        {/* Main Links */}
        {navItems.map((item) => (
          <SidebarLink key={item.name} {...item} />
        ))}

        {/* Grouped Links */}
        {navGroups.map((group, index) => (
          <div key={index} className="mt-4">
            {/* Group Title */}
            <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-2 border-t border-gray-700 pt-3">
              {group.title}
            </p>

            {/* Group Items */}
            {group.items.map((item) => (
              <SidebarLink key={item.name} {...item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="mt-auto border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-400">Logged in as Admin</p>
      </div>
    </aside>
  );
};

export default Sidebar;
