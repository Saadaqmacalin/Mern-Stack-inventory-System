import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { NotificationContainer } from '../ui/Notification';

const Layout = () => {
  const { sidebarOpen, user, isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Outlet />;
  }
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - fixed width on desktop, handled by Sidebar.jsx */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      <NotificationContainer />
    </div>
  );
};

export default Layout;
