import React, { useState, useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMagnifyingGlass, FaTrashCan, FaFileInvoiceDollar } from "react-icons/fa6";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Table } from "../ui/Table";

const DisplayPurchases = () => {
  const { purchases = [], loading, actions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    actions.fetchPurchases();
    actions.fetchSuppliers();
    actions.fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase? This will adjust the stock."))
      return;
    const result = await actions.deletePurchase(id);
    if (result.success) {
      actions.addNotification({ type: 'success', message: 'Purchase record deleted' });
    } else {
      actions.addNotification({ type: 'error', message: result.error || 'Failed to delete' });
    }
  };

  const filteredPurchases = (purchases || []).filter((p) =>
    [p.refNo, p.supplierId?.companyName, p.productId?.productName].some((field) =>
      String(field || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    {
      key: "refNo",
      title: "Ref No",
      render: (val) => <span className="font-black text-gray-900 tracking-tight">{val}</span>
    },
    {
      key: "supplier",
      title: "Supplier",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{row.supplierId?.companyName || "N/A"}</span>
          <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">{row.supplierId?.category || "Regular"}</span>
        </div>
      )
    },
    {
      key: "product",
      title: "Product",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-700">{row.productId?.productName || "N/A"}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">SKU: {row.productId?.sku || "N/A"}</span>
        </div>
      )
    },
    {
      key: "quantity",
      title: "Qty",
      render: (val) => <span className="font-black text-indigo-600">{val}</span>
    },
    {
      key: "unitCost",
      title: "Unit Cost",
      render: (val) => <span className="font-bold text-gray-500">${Number(val).toFixed(2)}</span>
    },
    {
      key: "totalCost",
      title: "Total Cost",
      render: (val) => (
        <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg inline-block font-black border border-emerald-100 italic">
          ${Number(val).toFixed(2)}
        </div>
      )
    },
    {
      key: "purchaseDate",
      title: "Date",
      render: (val) => <span className="text-gray-400 font-bold text-xs">{new Date(val).toLocaleDateString()}</span>
    },
    {
      key: "status",
      title: "Status",
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
          val === 'Received' ? 'bg-indigo-100 text-indigo-700' : 
          val === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
        }`}>
          {val}
        </span>
      )
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleDelete(row._id)}
            className="text-red-400 hover:text-red-600 hover:bg-red-50"
        >
          <FaTrashCan />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <FaFileInvoiceDollar className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Purchase Logs</h1>
            <p className="text-gray-500 font-medium">Tracking and restocking your inventory</p>
          </div>
        </div>
        <Button onClick={() => navigate("/purchases/add")} variant="primary" size="lg" className="shadow-lg shadow-indigo-100 px-8">
          <FaPlus className="mr-2" />
          Record Purchase
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaMagnifyingGlass className="text-gray-400" />
             </div>
             <input 
                placeholder="Search by ref, supplier, or product..." 
                className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-sm font-medium"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-1.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-100">
              {filteredPurchases.length} Records
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredPurchases}
          loading={loading}
          emptyMessage={searchTerm ? `No purchases matching "${searchTerm}"` : "You haven't recorded any purchases yet."}
        />
      </Card>
    </div>
  );
};

export default DisplayPurchases;
