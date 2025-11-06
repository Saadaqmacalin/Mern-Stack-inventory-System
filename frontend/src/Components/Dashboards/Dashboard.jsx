import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-10 border-b-4 border-indigo-500 inline-block pb-2">
        🚀 Dashboard Overview
      </h2>

      {/* Dashboard Cards */}
      <div className="flex flex-wrap gap-8 justify-center lg:justify-start">

        {/* Total Users */}
        <div className="flex flex-col items-center">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full font-medium shadow-md">
            Add User
          </button>
          <div className="mt-4 bg-white h-44 w-44 sm:h-48 sm:w-48 p-6 rounded-2xl shadow-lg border-b-8 border-indigo-500 text-center">
            <h3 className="text-gray-500 text-lg mb-3">Total Users</h3>
            <p className="text-4xl font-bold text-indigo-600">234</p>
          </div>
        </div>

        {/* Active Projects */}
        <div className="flex flex-col items-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium shadow-md">
            New Project
          </button>
          <div className="mt-4 bg-white h-44 w-44 sm:h-48 sm:w-48 p-6 rounded-2xl shadow-lg border-b-8 border-green-500 text-center">
            <h3 className="text-gray-500 text-lg mb-3">Active Projects</h3>
            <p className="text-4xl font-bold text-green-600">18</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="flex flex-col items-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-medium shadow-md">
            View Report
          </button>
          <div className="mt-4 bg-white h-44 w-44 sm:h-48 sm:w-48 p-6 rounded-2xl shadow-lg border-b-8 border-yellow-500 text-center">
            <h3 className="text-gray-500 text-lg mb-3">Revenue (USD)</h3>
            <p className="text-4xl font-bold text-yellow-600">$12.5K</p>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="flex flex-col items-center">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium shadow-md">
            Review Tasks
          </button>
          <div className="mt-4 bg-white h-44 w-44 sm:h-48 sm:w-48 p-6 rounded-2xl shadow-lg border-b-8 border-red-500 text-center">
            <h3 className="text-gray-500 text-lg mb-3">Pending Tasks</h3>
            <p className="text-4xl font-bold text-red-600">5</p>
          </div>
        </div>

      </div>

      {/* Quick Stats Section */}
      <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Quick Stats</h3>

        <ul className="space-y-4">
          <li className="flex justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
            <span className="font-medium text-gray-600">New Signups Today:</span>
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
