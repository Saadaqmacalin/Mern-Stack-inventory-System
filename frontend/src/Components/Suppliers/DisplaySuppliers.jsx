import React, { useState, useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { FaPenToSquare, FaTrashCan, FaPlus, FaMagnifyingGlass } from "react-icons/fa6";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import { Table, TRow, TCell } from "../ui/Table";

const DisplaySuppliers = () => {
  const { suppliers = [], loading, actions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    actions.fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    const result = await actions.deleteSupplier(id);
    if (result.success) {
      actions.addNotification({ type: 'success', message: 'Supplier deleted successfully' });
    } else {
      actions.addNotification({ type: 'error', message: result.error || 'Failed to delete supplier' });
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    [s.companyName, s.email, s.phone].some((field) =>
      String(field || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const formatAddress = (addr) => {
    if (!addr) return "N/A";
    const parts = [addr.street, addr.city, addr.state, addr.country].filter(Boolean);
    return parts.join(", ") || "No address details";
  };

  const columns = [
    {
      key: "companyName",
      title: "Company Name",
      render: (val) => <span className="font-black text-gray-900 leading-tight">{val}</span>
    },
    {
      key: "contact",
      title: "Contact Details",
      render: (_, row) => (
        <div className="flex flex-col">
            <span className="font-bold text-gray-700 text-sm">{row.email}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{row.phone}</span>
        </div>
      )
    },
    {
        key: "address",
        title: "Location",
        render: (val) => (
            <div className="max-w-[180px] truncate-2-lines text-xs text-gray-500 font-medium leading-relaxed" title={formatAddress(val)}>
                {formatAddress(val)}
            </div>
        )
    },
    {
      key: "category",
      title: "Category",
      render: (val) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(val) 
            ? val.map((cat, i) => (
                <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-black uppercase tracking-tight border border-indigo-100">{cat}</span>
              )) 
            : <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-black uppercase tracking-tight border border-indigo-100">{val || 'N/A'}</span>
          }
        </div>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${val === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {val || 'Active'}
        </span>
      )
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex space-x-1">
          <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => navigate("/suppliers/add", { state: { supplier: row } })}
              className="text-indigo-600 hover:bg-indigo-50"
          >
            <FaPenToSquare />
          </Button>
          <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => handleDelete(row._id)}
              className="text-red-500 hover:bg-red-50"
          >
            <FaTrashCan />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Supplier Network</h1>
          <p className="text-gray-500 font-medium">Manage your vendors and supply chain partners</p>
        </div>
        <Button onClick={() => navigate("/suppliers/add")} variant="primary" size="lg" className="shadow-lg shadow-indigo-100">
          <FaPlus className="mr-2" />
          Add New Supplier
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaMagnifyingGlass className="text-gray-400" />
             </div>
             <input 
                placeholder="Search company, email or phone..." 
                className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100">
            {filteredSuppliers.length} Partners
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredSuppliers}
          loading={loading}
          emptyMessage={searchTerm ? `No suppliers found matching "${searchTerm}"` : "Your supplier list is empty. Start adding partners!"}
        />
      </Card>
    </div>
  );
};

export default DisplaySuppliers;
