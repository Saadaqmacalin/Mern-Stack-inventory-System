import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import Card from "../ui/Card"; // Corrected casing
import Button from "../ui/Button"; // Corrected casing
import { Table } from "../ui/Table"; // Corrected casing
import { FaPlus, FaEye, FaPenToSquare, FaTrashCan } from "react-icons/fa6";

const DisplaySales = () => {
  const navigate = useNavigate();
  const { sales = [], loading, actions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    actions.fetchSales();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sale? This will adjust the stock.")) {
      const result = await actions.deleteSale(id);
      if (result.success) {
        actions.addNotification({ type: 'success', message: 'Sale record deleted successfully' });
      } else {
        actions.addNotification({ type: 'error', message: result.error || 'Failed to delete sale' });
      }
    }
  };

  const filteredSales = sales.filter(s => 
    s.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.productId?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "invoiceNo",
      title: "Invoice #",
      render: (val) => <span className="font-black text-gray-900">{val}</span>
    },
    {
      key: "customerId",
      title: "Customer",
      render: (val) => <span className="font-bold text-gray-700">{val?.name || 'N/A'}</span>
    },
    {
      key: "productId",
      title: "Product",
      render: (val) => (
        <div className="flex flex-col">
            <span className="font-bold text-indigo-600">{val?.productName || 'N/A'}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">ID: {val?._id?.slice(-6)}</span>
        </div>
      )
    },
    {
      key: "quantity",
      title: "Qty",
      render: (val) => <span className="font-black text-gray-700">{val}</span>
    },
    {
      key: "unitPrice",
      title: "Price",
      render: (val) => <span className="font-medium text-gray-500">${parseFloat(val).toFixed(2)}</span>
    },
    {
      key: "totalAmount",
      title: "Total",
      render: (val) => <span className="font-black text-indigo-600">${parseFloat(val).toFixed(2)}</span>
    },
    {
      key: "saleDate",
      title: "Date",
      render: (val) => <span className="text-gray-500 font-medium">{new Date(val).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
    },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            value === "Completed"
              ? "bg-green-100 text-green-700"
              : value === "Pending"
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/sales/add`, { state: { sale: row } })}
            className="text-indigo-600 hover:bg-indigo-50"
          >
            <FaPenToSquare />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:bg-red-50"
          >
            <FaTrashCan />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Sales Records</h1>
          <p className="text-gray-500 font-medium italic">Track and analyze your transaction history</p>
        </div>
        <Button onClick={() => navigate("/sales/add")} variant="primary" size="lg" className="shadow-lg shadow-indigo-100">
          <FaPlus className="mr-2" />
          Record New Sale
        </Button>
      </div>

      <Card>
        <div className="mb-6">
           <div className="relative max-w-md">
              <input 
                type="text"
                placeholder="Search by invoice, customer or product..."
                className="block w-full px-4 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredSales}
          loading={loading}
          emptyMessage={searchTerm ? `No sales records matching "${searchTerm}"` : "No sales records found."}
        />
      </Card>
    </div>
  );
};

export default DisplaySales;


