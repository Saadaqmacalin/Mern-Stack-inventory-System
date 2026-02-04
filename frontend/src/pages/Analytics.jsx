import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import { FaChartBar, FaDownload, FaCalendar } from 'react-icons/fa';

const Analytics = () => {
  const { analytics, orders = [], loading } = useAppContext();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  
  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analytics/sales');
        const data = await response.json();
        // Update analytics in context
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    
    fetchAnalytics();
  }, []);
  
  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <Card variant="elevated" hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                change.type === 'increase' ? 'text-green-500' : 'text-red-500'
              }`}>
                {change.value}
              </span>
              <span className="text-sm text-neutral-500 ml-1">from last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
          <p className="text-neutral-600">Business insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2">
            <FaCalendar className="text-neutral-400" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border border-neutral-300 rounded-lg"
            />
            <span className="text-neutral-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border border-neutral-300 rounded-lg"
            />
          </div>
          <Button variant="outline">
            <FaDownload className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${orders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString()}`}
          icon={FaChartBar}
          color="blue"
          change={{ type: 'increase', value: '+12%' }}
        />
        <StatCard
          title="Total Orders"
          value={orders.length.toLocaleString()}
          icon={FaChartBar}
          color="green"
          change={{ type: 'increase', value: '+8%' }}
        />
        <StatCard
          title="Average Order Value"
          value={`$${orders.length > 0 ? (orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0) / orders.length).toFixed(2) : '0.00'}`}
          icon={FaChartBar}
          color="purple"
          change={{ type: 'decrease', value: '-3%' }}
        />
        <StatCard
          title="Pending Orders"
          value={orders.filter(o => o.status === 'Pending').length.toLocaleString()}
          icon={FaChartBar}
          color="orange"
          change={{ type: 'increase', value: '+1%' }}
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sales Trend" subtitle="Revenue over time">
          <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
            <p className="text-neutral-500">Chart implementation needed</p>
          </div>
        </Card>
        
        <Card title="Top Products" subtitle="Best selling items">
          <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
            <p className="text-neutral-500">Chart implementation needed</p>
          </div>
        </Card>
      </div>
      
      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Sales" subtitle="Latest transactions">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium">Product {i}</p>
                  <p className="text-sm text-neutral-500">Customer {i}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(Math.random() * 1000).toFixed(2)}</p>
                  <p className="text-xs text-neutral-500">Today</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card title="Customer Analytics" subtitle="Customer insights">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium">Customer {i}</p>
                  <p className="text-sm text-neutral-500">customer{i}@email.com</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(Math.random() * 5000).toFixed(2)}</p>
                  <p className="text-xs text-neutral-500">{i} orders</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
