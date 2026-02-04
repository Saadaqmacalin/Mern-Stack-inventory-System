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
import { SalesTrendChart, TopProductsChart, OrderStatusChart } from '../Components/Dashboards/AnalyticsCharts';

// Sub-components for cleaner render
const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <div 
      className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center justify-between cursor-pointer group hover:-translate-y-1 transition-all duration-300 ring-1 ring-slate-100 px-8"
      onClick={stat.action}
    >
      <div className="space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.title}</p>
        <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${stat.changeType === 'increase' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
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
  const [selectedPeriod, setSelectedPeriod] = React.useState('daily');
  const { 
    products, 
    customers, 
    suppliers, 
    sales, 
    orders, 
    analytics,
    actions,
    loading 
  } = useAppContext();
  
  useEffect(() => {
    actions.fetchAnalytics(selectedPeriod);
  }, [selectedPeriod]);
  
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

  // Robust data processing for charts
  const salesTrendData = useMemo(() => {
    if (analytics?.salesData?.length > 0) {
        return analytics.salesData.map(item => {
            let label = item._id;
            // Format labels for a cleaner look
            if (selectedPeriod === 'daily') label = new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' });
            if (selectedPeriod === 'weekly') label = item._id.replace('-w', ' Wk ');
            
            return {
                date: label,
                amount: item.totalSales || 0
            };
        });
    }
    
    // Fallback logic
    const dates = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    return dates.map(date => {
      const daySales = sales.filter(s => s?.saleDate && String(s.saleDate).startsWith(date));
      const total = daySales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
      return { 
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), 
        amount: total 
      };
    });
  }, [sales, analytics, selectedPeriod]);

  const topProductsData = useMemo(() => {
    if (analytics?.topProducts) return analytics.topProducts;
    const productCounts = {};
    sales.forEach(sale => {
      if (sale?.items) {
        sale.items.forEach(item => {
          const name = item.productId?.name || item.productId?.productName || item.name || 'Unknown';
          productCounts[name] = (productCounts[name] || 0) + (Number(item.quantity) || 0);
        });
      }
    });
    return Object.entries(productCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [sales, analytics]);

  const orderStatusData = useMemo(() => {
    const counts = {};
    orders.forEach(o => { const s = o.status || 'Pending'; counts[s] = (counts[s] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

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
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-indigo-100/30 border border-slate-100">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Performance Matrix</h2>
                   <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Revenue stream tracking</p>
                </div>
                <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 gap-1 overflow-x-auto max-w-full">
                   {[
                      { id: 'daily', label: 'Last 7 Days' },
                      { id: 'weekly', label: 'Weekly' },
                      { id: 'monthly', label: 'Monthly' },
                      { id: 'yearly', label: 'Yearly' }
                   ].map((p) => (
                      <button
                         key={p.id}
                         onClick={() => setSelectedPeriod(p.id)}
                         className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${selectedPeriod === p.id ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                         {p.label}
                      </button>
                   ))}
                </div>
             </div>
             <SalesTrendChart data={salesTrendData} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card title="Latest Transactions" subtitle="Most recent sales synchronized with ledger">
              <div className="space-y-4">
                {recentSalesList.length === 0 && <p className="text-center text-slate-300 py-10 font-bold uppercase text-[10px] tracking-widest">No active sales data</p>}
                {recentSalesList.map((s, i) => (
                  <div key={s?._id || i} className="flex justify-between items-center p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <FaBolt size={18} />
                       </div>
                       <div>
                          <p className="font-black text-slate-800 tracking-tight">#{String(s?._id || '').slice(-6).toUpperCase()}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{s?.saleDate ? new Date(s.saleDate).toLocaleDateString() : 'Pending Sync'}</p>
                       </div>
                    </div>
                    <p className="font-black text-xl text-emerald-600">${Number(s?.totalAmount).toLocaleString()}</p>
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
                  <div key={p?._id || i} className="flex justify-between items-center p-5 bg-rose-50 rounded-[1.5rem] border border-rose-100 group hover:bg-white transition-all">
                    <div>
                       <p className="font-black text-slate-800 tracking-tight">{p?.productName || p?.name}</p>
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
          <OrderStatusChart data={orderStatusData} />
          <TopProductsChart data={topProductsData} />
          
          {/* Quick Command Center */}
          <section>
            <div className="flex items-center space-x-3 mb-6 px-2">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Command Center</h2>
                <div className="h-px flex-1 bg-slate-100"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'New Sale', icon: FaBolt, color: 'emerald', path: '/sales/add' },
                { label: 'New Order', icon: FaBox, color: 'blue', path: '/orders/add' },
                { label: 'Add Lead', icon: FaUsers, color: 'indigo', path: '/customers/add' },
                { label: 'Audits', icon: FaFileLines, color: 'purple', path: '/reports' }
              ].map((cmd, i) => {
                const colors = {
                    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white',
                    blue: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white',
                    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600 hover:text-white',
                    purple: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-600 hover:text-white'
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
            <div className="mt-8">
                <Button variant="ghost" className="w-full bg-slate-900 hover:bg-black text-white p-6 rounded-3xl flex justify-between items-center group overflow-hidden" onClick={() => navigate('/predictions')}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl"><FaChartLine /></div>
                        <div className="text-left">
                            <p className="text-xs font-black uppercase tracking-widest">AI Predictions</p>
                            <p className="text-[10px] text-slate-400 font-bold">Neural forecasting insights</p>
                        </div>
                    </div>
                    <FaArrowRight className="transition-transform group-hover:translate-x-2" />
                </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
