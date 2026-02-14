import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import { FaUpload, FaFileCsv, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

const DataImport = () => {
  const { actions, theme, API_BASE_URL } = useAppContext();
  const [uploading, setUploading] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const importTypes = [
    {
      id: 'products',
      title: 'Products Import',
      description: 'Upload product catalog with inventory levels.',
      endpoint: '/api/import/products',
      template: 'productName,sku,categoryName,supplierName,description,price,costPrice,quantity,status',
    },
    {
        id: 'sales',
        title: 'Sales History',
        description: 'Upload historical transaction data for ML training.',
        endpoint: '/api/import/sales',
        template: 'productName,sku,customerEmail,customerName,quantity,unitPrice,totalAmount,saleDate,invoiceNo,status',
    },
    {
        id: 'orders',
        title: 'Order Tracking',
        description: 'Upload bulk customer orders and delivery schedules.',
        endpoint: '/api/import/orders',
        template: 'productName,sku,customerEmail,customerName,quantity,unitPrice,totalAmount,orderNumber,orderDate,deliveryDate,status,paymentMethod,paymentStatus',
    }
  ];

  const handleAutoInject = async (type) => {
    setUploading(type.id);
    setResults(null);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/import/seed`, { type: type.id }, {
        withCredentials: true
      });
      
      setResults(response.data);
      actions.addNotification({
        type: 'success',
        message: `${type.title} Injection Successful`,
      });
    } catch (err) {
      setError(err.response?.data?.message || `Failed to inject ${type.id}`);
      actions.addNotification({
        type: 'error',
        message: `Injection failed: ${err.message}`,
      });
    } finally {
      setUploading(null);
    }
  };

  const handleSeed = async () => {
    setUploading('seed');
    setResults(null);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/import/seed`, {}, {
        withCredentials: true
      });
      
      setResults(response.data);
      actions.addNotification({
        type: 'success',
        message: 'Neural Data Injection Successful',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to seed data');
      actions.addNotification({
        type: 'error',
        message: `Injection failed: ${err.message}`,
      });
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Bulk Operations</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Inject historical datasets into the neural architecture</p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={handleSeed}
                disabled={uploading !== null}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 group disabled:opacity-50"
            >
                <div className={`w-2 h-2 rounded-full ${uploading === 'seed' ? 'bg-white animate-ping' : 'bg-white'}`} />
                {uploading === 'seed' ? 'Injecting System Data...' : 'Generate & Inject Data'}
            </button>
            <div className="px-4 py-2 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 h-fit">
                Protocol: Data Migration
            </div>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-[2rem] flex items-center gap-4 text-rose-600 dark:text-rose-400">
          <FaExclamationTriangle className="text-2xl shrink-0" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {results && (
        <Card className="p-8 border-none bg-emerald-50 dark:bg-emerald-900/10 shadow-xl shadow-emerald-100/20">
          <div className="flex items-center gap-4 mb-6">
            <FaCheckCircle className="text-3xl text-emerald-500" />
            <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{results.message}</h3>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Database synchronization finalized</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.summary && Object.entries(results.summary).map(([key, value], i) => (
                <div key={i} className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{key}</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
                </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {importTypes.map((type) => (
          <Card key={type.id} className="p-8 group hover:scale-[1.02] transition-all duration-500 border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-gray-800">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform">
                <FaFileCsv className="text-3xl" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{type.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">{type.description}</p>
            
            <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-gray-700">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <FaInfoCircle /> Neural Schema
                    </p>
                    <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 break-all bg-white dark:bg-gray-800 p-2 rounded-lg border border-slate-100 dark:border-gray-700">
                        {type.template}
                    </p>
                </div>

                <button 
                    onClick={() => handleAutoInject(type)}
                    disabled={uploading !== null}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                        uploading === type.id 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none'
                    }`}
                >
                    <FaUpload className={uploading === type.id ? 'animate-bounce' : ''} />
                    {uploading === type.id ? 'Injecting...' : 'Initiate Injection'}
                </button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-10 border-none bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute right-0 top-0 p-10 opacity-5">
                <FaInfoCircle className="text-9xl rotate-12" />
            </div>
            <div className="relative z-10 max-w-2xl">
                <h4 className="text-xl font-black tracking-tight mb-4">Neural Data Mapping Strategy</h4>
                <div className="space-y-4 text-slate-400 text-sm font-medium leading-relaxed">
                    <p>• The system automatically resolves <span className="text-indigo-400 font-bold">Categories</span> and <span className="text-indigo-400 font-bold">Suppliers</span> by name. New entities will be initialized if not found.</p>
                    <p>• <span className="text-emerald-400 font-bold">Products</span> are identified by SKU if available, otherwise by Name to prevent duplication.</p>
                    <p>• <span className="text-amber-400 font-bold">Customers</span> will be registered using their email as a unique identifier. Default credentials will be assigned to new profiles.</p>
                </div>
            </div>
      </Card>
    </div>
  );
};

export default DataImport;
