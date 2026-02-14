import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';
import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import Input from '../Components/ui/Input';
import { Table } from '../Components/ui/Table';
import { 
  FaChartBar, 
  FaFileDownload, 
  FaFilter, 
  FaUndo, 
  FaCalendarCheck,
  FaMoneyBillWave,
  FaBoxOpen,
  FaUserFriends,
  FaClipboardList
} from 'react-icons/fa';

const Reports = () => {
  const { actions, API_BASE_URL } = useAppContext();
  const [activeReport, setActiveReport] = useState('sales');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  
  const reportTypes = [
    { id: 'sales', name: 'Sales', icon: FaChartBar, color: 'indigo', desc: 'Revenue & trends' },
    { id: 'inventory', name: 'Inventory', icon: FaBoxOpen, color: 'emerald', desc: 'Stock levels' },
    { id: 'financial', name: 'Financial', icon: FaMoneyBillWave, color: 'purple', desc: 'Profit & loss' },
    { id: 'customer', name: 'Customers', icon: FaUserFriends, color: 'amber', desc: 'Client behavior' },
    { id: 'order', name: 'Orders', icon: FaClipboardList, color: 'rose', desc: 'Fulfillment' },
  ];
  
  useEffect(() => {
    generateReport();
  }, [activeReport]);
  
  const generateReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      
      const response = await axios.get(`${API_BASE_URL}/reports/${activeReport}`, { params });
      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      actions.addNotification({ type: 'error', message: 'Failed to generate report' });
    } finally {
      setLoading(false);
    }
  };
  
  const downloadReport = async () => {
    try {
      const params = { format: 'csv' };
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      
      const response = await axios.get(`${API_BASE_URL}/reports/${activeReport}`, {
        params,
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeReport}-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      actions.addNotification({ type: 'error', message: 'Download failed' });
    }
  };
  
  const renderSummaryCards = (summary) => {
    const getCardStyle = (key) => {
      const k = key.toLowerCase();
      if (k.includes('revenue') || k.includes('profit') || k.includes('sales') || k.includes('value')) {
        return { 
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
          icon: FaChartBar,
          track: 'Revenue'
        };
      }
      if (k.includes('cost') || k.includes('purchase')) {
        return { 
          bg: 'bg-rose-50 text-rose-600 border-rose-100', 
          icon: FaMoneyBillWave,
          track: 'Expense'
        };
      }
      if (k.includes('count') || k.includes('total') || k.includes('products') || k.includes('customers')) {
        return { 
          bg: 'bg-indigo-50 text-indigo-600 border-indigo-100', 
          icon: FaClipboardList,
          track: 'Volume'
        };
      }
      return { 
        bg: 'bg-slate-50 text-slate-600 border-slate-100', 
        icon: FaChartBar,
        track: 'Metric'
      };
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(summary).map(([key, value]) => {
          const style = getCardStyle(key);
          const Icon = style.icon;
          return (
            <div key={key} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-xl ${style.bg} transition-colors group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:ring-1 group-hover:ring-current`}>
                  <Icon className="text-sm" />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300 dark:text-gray-500 group-hover:text-slate-400 dark:group-hover:text-gray-400 transition-colors">
                  {style.track}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-wider mb-1 truncate">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                  {typeof value === 'number' ? 
                    (key.toLowerCase().includes('value') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('profit') || key.toLowerCase().includes('sales') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('spent') || key.toLowerCase().includes('amount') ? 
                      `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : value.toLocaleString()) : 
                    value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getTableColumns = () => {
      if (!reportData?.details || reportData.details.length === 0) return [];
      
      const firstItem = reportData.details[0];
      return Object.keys(firstItem)
        .filter(key => !key.startsWith('_') && key !== '__v') // Hide internal MongoDB fields
        .map(key => ({
          key,
          title: key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1).trim(),
          render: (val) => {
              if (val === null || val === undefined) return <span className="text-gray-300">-</span>;
              
              if (typeof val === 'number') {
                  const lowerKey = key.toLowerCase();
                  if (lowerKey.includes('price') || lowerKey.includes('cost') || lowerKey.includes('total') || lowerKey.includes('revenue') || lowerKey.includes('spent') || lowerKey.includes('profit')) {
                      return <span className="font-bold text-gray-900 dark:text-white">${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
                  }
                  if (lowerKey.includes('margin')) {
                      return <span className="font-bold text-indigo-600 dark:text-indigo-400">{val.toFixed(2)}%</span>;
                  }
                  return <span className="font-medium text-gray-600 dark:text-gray-300">{val.toLocaleString()}</span>;
              }
              
              const lowerVal = String(val).toLowerCase();
              if (key.toLowerCase().includes('date') || (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val))) {
                  return <span className="text-gray-400 dark:text-gray-500 text-xs font-bold">{new Date(val).toLocaleDateString()}</span>;
              }
              
              if (key.toLowerCase().includes('id')) {
                  return <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-tighter">#{String(val).slice(-6)}</span>;
              }

              return <span className="text-gray-700 dark:text-gray-300 font-medium">{String(val)}</span>;
          }
      }));
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Business Intelligence Reports</h1>
          <p className="text-slate-400 dark:text-gray-400 text-[11px] font-medium">Real-time auditing & financial intelligence</p>
        </div>
        <Button onClick={downloadReport} variant="primary" size="sm" className="shadow-lg shadow-indigo-100/50 dark:shadow-none rounded-xl px-6 py-4 font-bold text-xs">
          <FaFileDownload className="mr-2" />
          Export CSV
        </Button>
      </div>
      
      {/* Report Type Selection */}
      <Card className="p-3 border-none bg-slate-50/50 dark:bg-gray-800/50 transition-colors duration-300">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {reportTypes.map((type) => {
                const Icon = type.icon;
                const isActive = activeReport === type.id;
                
                const colorMap = {
                    indigo: {
                        active: 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-indigo-900/20',
                        inactive: 'bg-white dark:bg-gray-800 text-slate-400 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-slate-100 dark:border-gray-700',
                        iconActive: 'text-white',
                        iconInactive: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                    },
                    emerald: {
                        active: 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20',
                        inactive: 'bg-white dark:bg-gray-800 text-slate-400 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-slate-100 dark:border-gray-700',
                        iconActive: 'text-white',
                        iconInactive: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                    },
                    purple: {
                        active: 'bg-purple-600 text-white shadow-purple-200 dark:shadow-purple-900/20',
                        inactive: 'bg-white dark:bg-gray-800 text-slate-400 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-slate-100 dark:border-gray-700',
                        iconActive: 'text-white',
                        iconInactive: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30'
                    },
                    amber: {
                        active: 'bg-amber-500 text-white shadow-amber-200 dark:shadow-amber-900/20',
                        inactive: 'bg-white dark:bg-gray-800 text-slate-400 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 border-slate-100 dark:border-gray-700',
                        iconActive: 'text-white',
                        iconInactive: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30'
                    },
                    rose: {
                        active: 'bg-rose-600 text-white shadow-rose-200 dark:shadow-rose-900/20',
                        inactive: 'bg-white dark:bg-gray-800 text-slate-400 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-slate-100 dark:border-gray-700',
                        iconActive: 'text-white',
                        iconInactive: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30'
                    }
                };
                
                const styles = colorMap[type.color] || colorMap.indigo;

                return (
                    <button
                        key={type.id}
                        onClick={() => setActiveReport(type.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all duration-500 border-2 ${
                        isActive
                            ? `${styles.active} shadow-2xl scale-105 z-10 border-transparent`
                            : `${styles.inactive} border-white shadow-sm`
                        }`}
                    >
                        <div className={`p-3 rounded-2xl mb-4 transition-all duration-500 ${isActive ? 'bg-white/20' : styles.iconInactive}`}>
                            <Icon className="text-2xl" />
                        </div>
                        <span className={`text-sm font-bold tracking-tight mb-1`}>{type.name}</span>
                        <span className={`text-[9px] font-bold opacity-70 text-center hidden md:block uppercase tracking-tighter`}>{type.desc}</span>
                    </button>
                );
            })}
          </div>
      </Card>
      
      {/* Filters */}
      <Card className="p-8 border-none shadow-sm dark:bg-gray-800 dark:text-white transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="date"
              label="Start Audit Date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
             <Input
                type="date"
                label="End Audit Date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex space-x-2">
              <Button onClick={generateReport} className="px-8 shadow-lg shadow-indigo-100 dark:shadow-none">
                <FaFilter className="mr-2" />
                Filter
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                    setDateRange({ startDate: '', endDate: '' });
                    // Trigger refresh immediately
                    setTimeout(generateReport, 0);
                }}
                className="text-slate-400 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FaUndo className="mr-2" />
                Reset
              </Button>
          </div>
        </div>
      </Card>
      
      {/* Report Content */}
      <div className="space-y-8">
        {loading ? (
             <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-indigo-600 font-bold text-xs uppercase tracking-widest">Generating Insight...</p>
             </div>
        ) : reportData ? (
          <>
            {reportData.summary && renderSummaryCards(reportData.summary)}
            
            <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/20 dark:shadow-none dark:bg-gray-800 transition-colors duration-300">
              <div className="p-6 bg-slate-50 dark:bg-gray-700/50 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Audit Details</h2>
                    <p className="text-xs text-slate-400 dark:text-gray-400 font-medium">Comprehensive record of period activities</p>
                  </div>
                  <div className="px-4 py-1.5 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-600 text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">
                    Last sync: {new Date().toLocaleTimeString()}
                  </div>
              </div>
              <div className="overflow-x-auto dark:bg-gray-800">
                {reportData.details && reportData.details.length > 0 ? (
                    <Table
                        columns={getTableColumns()}
                        data={reportData.details}
                        loading={loading}
                    />
                ) : (
                    <div className="py-20 text-center">
                        <FaClipboardList className="text-slate-200 dark:text-gray-700 text-6xl mx-auto mb-4" />
                        <p className="text-slate-400 dark:text-gray-500 font-bold">No detailed records found for this period</p>
                    </div>
                )}
              </div>
            </Card>
          </>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
            <p className="text-gray-400 dark:text-gray-500 font-medium">Select a report type and filter parameters to begin auditing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
