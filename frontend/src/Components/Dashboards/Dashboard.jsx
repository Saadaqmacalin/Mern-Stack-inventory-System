import React, { useState, useEffect } from "react";
import { useUserContext } from "../User/userContext.jsx"; 
import { FaHome, FaUserPlus, FaMoneyBillWave, FaListAlt ,FaBox, FaChartLine, FaBrain} from "react-icons/fa"; // Added more specific icons
import { useNavigate } from "react-router-dom"; 
import {useCategoryContext} from "../Categories/Categories.jsx"
import {useProductContext} from "../Products/Products.jsx"
import axios from "axios"

const Dashboard = () => {
  const {categories} = useCategoryContext()
  const { products } = useProductContext();
  const { users } = useUserContext(); 
  const navigate = useNavigate(); 
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalSales: 0,
    totalCustomers: 0
  });

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  const fetchDashboardAnalytics = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/analytics/inventory");
      setAnalytics({
        totalProducts: response.data.inventoryAnalytics.totalProducts || 0,
        lowStockItems: response.data.inventoryAnalytics.lowStockItems || 0,
        totalSales: response.data.inventoryAnalytics.totalStockValue || 0,
        totalCustomers: users.length
      });
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
    }
  };

  const StatCard = ({ title, value, color, icon: Icon, actionText, onAction }) => (
    <div className="flex flex-col items-center ">
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
    <div className="min-h-screen bg-gray-200 p-6 ml-60 pl-30">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-4
       border-indigo-500 pb-6 flex items-center gap-3">
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
          value={analytics.totalProducts} 
          color="red" 
          icon={FaBox} 
          actionText="view Products"
          onAction={() => navigate('/products')}
        />

        {/* Revenue (Real Data) */}
        <StatCard 
          title="Total Stock Value" 
          value={`$${analytics.totalSales.toFixed(0)}`}
          color="green" 
          icon={FaMoneyBillWave} 
          actionText="View Analytics"
          onAction={() => navigate('/analytics')}
        />

        {/* Categories */}
        <StatCard 
          title="Total Categories" 
          value={categories.length}
          color="indigo" 
          icon={FaListAlt} 
          actionText="View Categories"
          onAction={() => navigate('/DisplayCategories')}
        />

        {/* Low Stock Alert */}
        <StatCard 
          title="Low Stock Items" 
          value={analytics.lowStockItems} 
          color="orange" 
          icon={FaChartLine} 
          actionText="View Predictions"
          onAction={() => navigate('/predictions')}
        />

        {/* AI Features */}
        <StatCard 
          title="AI Analytics" 
          value="NEW" 
          color="purple" 
          icon={FaBrain} 
          actionText="View Analytics"
          onAction={() => navigate('/analytics')}
        />

      </div>

      {/* Quick Stats Section */}
      <div className="mt-60 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Quick Stats
        </h3>

        <ul className="space-y-4">

          <li className="flex justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
            <span className="font-medium text-gray-600"> New Signups Today:</span>
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