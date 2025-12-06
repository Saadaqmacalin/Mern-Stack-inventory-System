import React from "react";

import { useUserContext } from "../User/userContext.jsx"; 
import { FaHome, FaUserPlus, FaLayerGroup, FaMoneyBillWave, FaListAlt ,FaBox} from "react-icons/fa"; // Added more specific icons
import { useNavigate } from "react-router-dom"; 

const Dashboard = () => {
  const { users } = useUserContext(); 
  const navigate = useNavigate(); 

  const StatCard = ({ title, value, color, icon: Icon, actionText, onAction }) => (
    <div className="flex flex-col items-center">
      <button onClick={onAction} className={`bg-${color}-600 hover:bg-${color}-700
       text-white px-4 py-2 rounded-full font-medium shadow-md 
        duration-150 ease-in-out mb-2`}
      >
        {/* a clickble text */}
        {actionText}  
      </button>

      <div className={`mt-2 bg-white h-44 w-44 sm:h-48 sm:w-48 p-6 rounded-2xl shadow-xl 
        border-b-8 border-${color}-500 text-center flex flex-col justify-center items-center`}>
        <Icon size={30} className={`text-${color}-500 mb-2`} />
        <h3 className="text-gray-500 text-lg">{title}</h3>
        <p className="text-4xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-100 p-6 ml-60">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 border-b-4
       border-indigo-500 pb-4 flex items-center gap-3">
        <FaHome size={30} className="text-indigo-500" />
        <span>Dashboard Overview</span>
      </h2>

      {/* Dashboard Cards */}
      <div className="flex flex-wrap gap-8 justify-center xl:justify-start">
        
        {/* Total Users */}
        <StatCard 
          title="Total Users" 
          value={users.length} 
          color="indigo" 
          icon={FaUserPlus} 
          actionText="Manage Users"
          onAction={() => navigate('/users')}
        />

        {/* Active Projects (Static Data for example) */}
        <StatCard 
          title="Products" 
          value="18" 
          color="red" 
          icon={FaBox} 
          actionText="view Products"
          onAction={() => console.log('Navigate to New Project')}
        />

        {/* Revenue (Static Data for example) */}
        <StatCard 
          title="Revenue (USD)" 
          value="$12.5K" 
          color="green" // Tailwind uses 'amber' now, but 'yellow' is a common alias/class
          icon={FaMoneyBillWave} 
          actionText="View Report"
          onAction={() => navigate('/reports')}
        />

        {/* Pending Tasks (Static Data for example) */}
        <StatCard 
          title="Pending Tasks" 
          value="5" 
          color="red" 
          icon={FaListAlt} 
          actionText="Review Tasks"
          onAction={() => console.log('Navigate to Tasks')}
        />

      </div>

      {/* Quick Stats Section */}
      {/* FIX: Removed 'mt-60' which caused excessive spacing, replaced with standard 'mt-10' */}
      <div className="mt-60 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Quick Stats
        </h3>

        <ul className="space-y-4">
          <li className="flex justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
            <span className="font-medium text-gray-600">
              New Signups Today:
            </span>
            <span className="font-bold text-indigo-700">12</span>
          </li>
          <li className="flex justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
            <span className="font-medium text-gray-600">Server Status:</span>
            <span className="font-bold text-green-700">Operational</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;