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

const API_BASE_URL = 'http://localhost:5000/api';

const Reports = () => {
  const { actions } = useAppContext();
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 truncate">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">
              {typeof value === 'number' ? 
                (key.toLowerCase().includes('value') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('profit') || key.toLowerCase().includes('sales') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('amount') ? 
                  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : value.toLocaleString()) : 
                value}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const getTableColumns = () => {
      if (!reportData?.details || reportData.details.length === 0) return [];
      
      // Infere columns from first object
      const firstItem = reportData.details[0];
      return Object.keys(firstItem).map(key => ({
          key,
          title: key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1).trim(),
          render: (val) => {
              if (typeof val === 'number') {
                  if (key.toLowerCase().includes('price') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('total') || key.toLowerCase().includes('revenue')) {
                      return <span className="font-bold text-gray-900">${val.toFixed(2)}</span>;
                  }
                  return <span className="font-medium text-gray-600">{val}</span>;
              }
              if (key.toLowerCase().includes('date')) return <span className="text-gray-400 text-xs font-bold">{new Date(val).toLocaleDateString()}</span>;
              return <span className="text-gray-700 font-medium">{String(val)}</span>;
          }
      }));
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-2">
            <FaCalendarCheck />
            <span>Operational Audits</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Business Intelligence Reports</h1>
          <p className="text-slate-500 font-medium">Detailed auditing and financial exports</p>
        </div>
        <Button onClick={downloadReport} variant="primary" size="lg" className="shadow-lg shadow-indigo-100/50">
          <FaFileDownload className="mr-2" />
          Export Data (.csv)
        </Button>
      </div>
      
      {/* Report Type Selection */}
      <Card className="p-2 border-none bg-slate-100/50">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {reportTypes.map((type) => {
                const Icon = type.icon;
                const isActive = activeReport === type.id;
                return (
                    <button
                        key={type.id}
                        onClick={() => setActiveReport(type.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 ${
                        isActive
                            ? `bg-white shadow-xl shadow-${type.color}-100/50 ring-1 ring-slate-200 lg:scale-105 z-10`
                            : 'bg-transparent hover:bg-white/40 text-slate-400'
                        }`}
                    >
                        <div className={`p-3 rounded-xl mb-3 ${isActive ? `bg-${type.color}-50 text-${type.color}-600` : 'bg-slate-200/50 text-slate-400'}`}>
                            <Icon className="text-xl" />
                        </div>
                        <span className={`text-sm font-black tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{type.name}</span>
                        <span className="text-[10px] font-bold opacity-50 text-center mt-1 hidden md:block">{type.desc}</span>
                    </button>
                );
            })}
          </div>
      </Card>
      
      {/* Filters */}
      <Card className="p-8 border-none shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="date"
              label="Start Audit Date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
             <Input
                type="date"
                label="End Audit Date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
          <div className="flex space-x-2">
              <Button onClick={generateReport} className="px-8 shadow-lg shadow-indigo-100">
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
                className="text-slate-400 font-bold"
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
                <p className="mt-4 text-indigo-600 font-black text-xs uppercase tracking-widest">Generating Insight...</p>
             </div>
        ) : reportData ? (
          <>
            {reportData.summary && renderSummaryCards(reportData.summary)}
            
            <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/20">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Audit Details</h2>
                    <p className="text-xs text-slate-400 font-medium">Comprehensive record of period activities</p>
                  </div>
                  <div className="px-4 py-1.5 bg-white rounded-xl border border-slate-200 text-[10px] font-black uppercase text-indigo-600 tracking-widest">
                    Last sync: {new Date().toLocaleTimeString()}
                  </div>
              </div>
              <div className="overflow-x-auto">
                {reportData.details && reportData.details.length > 0 ? (
                    <Table
                        columns={getTableColumns()}
                        data={reportData.details}
                        loading={loading}
                    />
                ) : (
                    <div className="py-20 text-center">
                        <FaClipboardList className="text-slate-200 text-6xl mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">No detailed records found for this period</p>
                    </div>
                )}
              </div>
            </Card>
          </>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">Select a report type and filter parameters to begin auditing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
