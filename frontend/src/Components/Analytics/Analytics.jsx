import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { 
  FaChartLine, 
  FaBox, 
  FaUsers, 
  FaDollarSign, 
  FaChartPie, 
  FaArrowUp, 
  FaArrowDown,
  FaCalendarAlt,
  FaTrophy,
  FaLayerGroup
} from "react-icons/fa";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import Card from "../ui/Card";

const Analytics = () => {
  const { analytics, loading, actions } = useAppContext();
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    actions.fetchAnalytics(period);
  }, [period]);

  const { salesData = [], inventoryData = {}, customerData = [], topProducts = [] } = analytics;

  // Chart colors
  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
          {trendValue && (
            <div className={`flex items-center mt-2 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {trendValue} vs last period
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 shadow-sm border border-opacity-20 ${color.replace('text', 'border')}`}>
          <Icon className={`${color} text-xl`} />
        </div>
      </div>
    </div>
  );

  if (loading && !salesData.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-6 text-gray-500 font-bold tracking-tight">Synthesizing Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <FaChartLine className="text-9xl text-indigo-600 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
            <span>Business Intelligence</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Performance Insights</h1>
          <p className="text-gray-500 font-medium">Real-time visualization of your inventory and sales health</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl relative z-10">
          {['daily', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
                period === p 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview stats grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Inventory Count"
          value={inventoryAnalytics.totalProducts || 0}
          icon={FaBox}
          color="text-indigo-600 bg-indigo-600"
          trend="up"
          trendValue="4.2%"
        />
        <StatCard
          title="Stock Valuation"
          value={`$${(inventoryAnalytics.totalStockValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={FaDollarSign}
          color="text-emerald-600 bg-emerald-600"
          trend="up"
          trendValue="12.5%"
        />
        <StatCard
          title="Critical Alerts"
          value={inventoryAnalytics.lowStockItems || 0}
          icon={FaLayerGroup}
          color="text-rose-600 bg-rose-600"
          trend="down"
          trendValue="2 items"
        />
        <StatCard
          title="Active Base"
          value={customerData.length}
          icon={FaUsers}
          color="text-amber-600 bg-amber-600"
          trend="up"
          trendValue="8 new"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend Chart */}
        <Card className="lg:col-span-2 p-8 border-none shadow-xl shadow-indigo-100/20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Revenue Dynamics</h2>
              <p className="text-gray-400 text-sm font-medium">Gross sales performance over time</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-black text-indigo-600 tracking-tighter">
                    ${salesData.reduce((acc, curr) => acc + (curr.totalSales || 0), 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total for period</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="_id" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                />
                <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                    itemStyle={{fontWeight: 900, color: '#6366f1'}}
                    labelStyle={{fontWeight: 700, color: '#1e293b', marginBottom: '4px'}}
                />
                <Area 
                    type="monotone" 
                    dataKey="totalSales" 
                    name="Revenue"
                    stroke="#6366f1" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Products Volume */}
        <Card className="p-8 border-none shadow-xl shadow-slate-100/20">
          <div className="flex flex-col mb-8">
            <div className="flex items-center space-x-2 text-rose-500 font-black text-[10px] uppercase tracking-widest mb-1">
                <FaTrophy />
                <span>Leaderboard</span>
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Best Sellers</h2>
            <p className="text-gray-400 text-sm font-medium">Top performing products by volume</p>
          </div>
          <div className="space-y-6">
            {topProducts.slice(0, 5).map((product, index) => {
              const maxQty = Math.max(...topProducts.map(p => p.totalQuantity), 1);
              const percentage = (product.totalQuantity / maxQty) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700 leading-tight">{product.productName}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{product.orderCount} orders placed</span>
                    </div>
                    <span className="text-xs font-black text-indigo-600">{product.totalQuantity} units</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Engagement */}
        <Card className="p-8 border-none shadow-xl shadow-amber-100/10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Valued Customers</h2>
                    <p className="text-gray-400 text-sm font-medium">Partners driving your business forward</p>
                </div>
                <FaUsers className="text-slate-200 text-3xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customerData.slice(0, 4).map((customer, index) => (
                    <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-lg transition-all group">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:from-indigo-100 group-hover:to-indigo-50 group-hover:text-indigo-600 transition-all">
                                {customer.customerName?.charAt(0)}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-black text-slate-800 truncate">{customer.customerName}</span>
                                <span className="text-[10px] text-slate-400 truncate">{customer.email}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200/50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
                            <span className="text-sm font-black text-emerald-600">${customer.totalSpent?.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        {/* Inventory Composition */}
        <Card className="p-8 border-none shadow-xl shadow-emerald-100/10 h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Top Revenue Drivers</h2>
                    <p className="text-gray-400 text-sm font-medium">Financial contribution by product</p>
                </div>
                <FaDollarSign className="text-slate-200 text-3xl" />
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProducts.slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="productName" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 700}}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 700}}
                            tickFormatter={(val) => `$${val}`}
                        />
                        <Tooltip 
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                            cursor={{fill: '#f8fafc'}}
                            formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar 
                            dataKey="totalRevenue" 
                            radius={[8, 8, 0, 0]}
                            barSize={32}
                        >
                            {topProducts.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
