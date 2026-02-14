import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { 
  FaBox, 
  FaUsers, 
  FaTruck, 
  FaChartLine, 
  FaArrowUp, 
  FaArrowDown, 
  FaTrophy,
  FaBolt,
  FaShieldHalved,
  FaSignal,
  FaPlus,
  FaFileLines,
  FaArrowRight
} from 'react-icons/fa6';
import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';

// Sub-components for cleaner render
const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <div 
      className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-gray-700 flex items-center justify-between cursor-pointer group hover:-translate-y-1 transition-all duration-300 ring-1 ring-slate-100 dark:ring-gray-700 px-8"
      onClick={stat.action}
    >
      <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{stat.title}</p>
        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${stat.changeType === 'increase' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
            {stat.changeType === 'increase' ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
            {stat.change}
          </span>
          <span className="text-slate-400 font-medium">period delta</span>
        </div>
      </div>
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    products, 
    customers, 
    suppliers, 
    sales, 
    orders, 
    actions,
    loading 
  } = useAppContext();
  
  const stats = [
    { 
        title: 'Network Inventory', 
        value: products.length, 
        icon: FaBox, 
        color: 'from-blue-600 to-indigo-600', 
        change: '+12%', 
        changeType: 'increase', 
        action: () => navigate('/products') 
    },
    { 
        title: 'Active Customers', 
        value: customers.length, 
        icon: FaUsers, 
        color: 'from-emerald-600 to-teal-600', 
        change: '+4%', 
        changeType: 'increase', 
        action: () => navigate('/customers') 
    },
    { 
        title: 'Sales Volume', 
        value: sales.length, 
        icon: FaBolt, 
        color: 'from-amber-500 to-orange-600', 
        change: '+21%', 
        changeType: 'increase', 
        action: () => navigate('/sales') 
    },
    { 
        title: 'Procurement Orders', 
        value: orders.filter(o => o.status === 'Pending').length, 
        icon: FaTruck, 
        color: 'from-rose-500 to-red-600', 
        change: '-2%', 
        changeType: 'decrease', 
        action: () => navigate('/orders') 
    },
  ];

  const recentSalesList = sales.slice(-5).reverse();
  const lowStockList = products.filter(p => (Number(p.quantity) || 0) <= 10).slice(0, 5);

  return (
    <div className="max-w-full space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => <StatCard key={i} stat={stat} />)}
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card title="Latest Transactions" subtitle="Most recent sales synchronized with ledger">
              <div className="space-y-4">
                {recentSalesList.length === 0 && <p className="text-center text-slate-300 py-10 font-bold uppercase text-[10px] tracking-widest">No active sales data</p>}
                {recentSalesList.map((s, i) => (
                  <div key={s?._id || i} className="flex justify-between items-center p-5 bg-slate-50 dark:bg-gray-700/30 rounded-[1.5rem] border border-slate-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <FaBolt size={18} />
                       </div>
                       <div>
                          <p className="font-black text-slate-800 dark:text-white tracking-tight">#{String(s?._id || '').slice(-6).toUpperCase()}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{s?.saleDate ? new Date(s.saleDate).toLocaleDateString() : 'Pending Sync'}</p>
                       </div>
                    </div>
                    <p className="font-black text-xl text-emerald-600 dark:text-emerald-400">${Number(s?.totalAmount).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Restock Protocol" subtitle="Inventory alerts below critical levels">
              <div className="space-y-4">
                {lowStockList.length === 0 && (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                             <FaShieldHalved size={32} />
                        </div>
                        <p className="text-emerald-600 font-black tracking-tight">System Integrity Secure</p>
                        <p className="text-[10px] text-emerald-400 font-black uppercase mt-1">Units Healthy</p>
                    </div>
                )}
                {lowStockList.map((p, i) => (
                  <div key={p?._id || i} className="flex justify-between items-center p-5 bg-rose-50 dark:bg-rose-900/10 rounded-[1.5rem] border border-rose-100 dark:border-rose-900/30 group hover:bg-white dark:hover:bg-gray-800 transition-all">
                    <div>
                       <p className="font-black text-slate-800 dark:text-white tracking-tight">{p?.productName || p?.name}</p>
                       <p className="text-[10px] text-rose-400 font-black uppercase tracking-tighter">SKU: {p?.sku || 'UNKNOWN'}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black text-rose-600 leading-none">{p?.quantity || 0}</p>
                       <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest mt-1">Available</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-10">
          {/* Quick Command Center */}
          <section>
            <div className="flex items-center space-x-3 mb-6 px-2">
                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Command Center</h2>
                <div className="h-px flex-1 bg-slate-100 dark:bg-gray-700"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'New Sale', icon: FaBolt, color: 'emerald', path: '/sales/add' },
                { label: 'New Order', icon: FaBox, color: 'blue', path: '/orders/add' },
                { label: 'Add Lead', icon: FaUsers, color: 'indigo', path: '/customers/add' },
                { label: 'Audits', icon: FaFileLines, color: 'purple', path: '/reports' }
              ].map((cmd, i) => {
                const colors = {
                    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-600 hover:text-white',
                    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30 hover:bg-blue-600 hover:text-white',
                    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-600 hover:text-white',
                    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30 hover:bg-purple-600 hover:text-white'
                };
                return (
                    <button 
                        key={i} 
                        onClick={() => navigate(cmd.path)}
                        className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 group ${colors[cmd.color]}`}
                    >
                        <cmd.icon size={22} className="transition-transform group-hover:scale-125 group-hover:rotate-12" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{cmd.label}</span>
                    </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
