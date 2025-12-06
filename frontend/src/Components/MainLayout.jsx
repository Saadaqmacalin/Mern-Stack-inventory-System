
import { Outlet } from 'react-router-dom';
import Sidebar from './Dashboards/Sidebar.jsx';

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar/>
      <main className="flex-1 overflow-auto p-6 bg-gray-100 min-h-screen">
        <Outlet /> {/* This renders the nested routes */}
      </main>
    </div>
  );
};

export default MainLayout;