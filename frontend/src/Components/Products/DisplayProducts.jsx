import React, { useState, useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { FaPenToSquare, FaTrashCan, FaPlus, FaMagnifyingGlass } from "react-icons/fa6";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import { Table, TRow, TCell } from "../ui/Table";

const DisplayProducts = () => {
  const { products = [], loading, actions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    actions.fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const result = await actions.deleteProduct(id);
    if (result.success) {
      actions.addNotification({ type: 'success', message: 'Product deleted successfully' });
    } else {
      actions.addNotification({ type: 'error', message: result.error || 'Failed to delete product' });
    }
  };

  const filteredProducts = products.filter((p) =>
    [p.productName, p.sku].some((field) =>
      String(field || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    {
      key: "productName",
      title: "Product Details",
      render: (_, row) => (
        <div className="flex flex-col">
            <span className="font-black text-gray-900 leading-tight">{row.productName}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SKU: {row.sku || 'NO-SKU'}</span>
        </div>
      )
    },
    {
        key: "categoryId",
        title: "Category",
        render: (val) => <span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md text-[11px] font-bold border border-gray-100">{val?.name || "N/A"}</span>
    },
    {
        key: "supplierId",
        title: "Supplier",
        render: (val) => <span className="text-gray-500 font-medium text-sm">{val?.name || "N/A"}</span>
    },
    {
      key: "price",
      title: "Pricing",
      render: (_, row) => (
        <div className="flex flex-col">
            <span className="font-black text-indigo-600">${parseFloat(row.price).toFixed(2)}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Cost: ${parseFloat(row.costPrice).toFixed(2)}</span>
        </div>
      )
    },
    {
      key: "quantity",
      title: "Stock",
      render: (val) => (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${val <= 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className={`font-black ${val <= 10 ? 'text-red-600 text-lg' : 'text-gray-700'}`}>{val}</span>
        </div>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${val === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
              onClick={() => navigate("/products/add", { state: { product: row } })}
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
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Product Inventory</h1>
          <p className="text-gray-500 font-medium">Control and monitor your stock levels</p>
        </div>
        <Button onClick={() => navigate("/products/add")} variant="primary" size="lg" className="shadow-lg shadow-indigo-100">
          <FaPlus className="mr-2" />
          Add New Product
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaMagnifyingGlass className="text-gray-400" />
             </div>
             <input 
                placeholder="Product name or SKU..." 
                className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100">
            {filteredProducts.length} Items Listed
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredProducts}
          loading={loading}
          emptyMessage={searchTerm ? `No products matching "${searchTerm}"` : "Your inventory is empty. Add some products!"}
        />
      </Card>
    </div>
  );
};

export default DisplayProducts;
