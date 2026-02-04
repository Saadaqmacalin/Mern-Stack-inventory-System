import React, { useState, useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { FaPenToSquare, FaTrashCan, FaPlus, FaMagnifyingGlass } from "react-icons/fa6";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import { Table, TRow, TCell } from "../ui/Table";

const DisplayCategories = () => {
  const { categories = [], loading, actions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    actions.fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    const result = await actions.deleteCategory(id);
    if (result.success) {
      actions.addNotification({ type: 'success', message: 'Category removed successfully' });
    } else {
      actions.addNotification({ type: 'error', message: result.error || 'Failed to remove category' });
    }
  };

  const filteredCategories = categories.filter((c) =>
    [c.name, c.description].some((field) =>
      String(field || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    {
      key: "name",
      title: "Category Name",
      render: (val) => <span className="font-black text-gray-900 tracking-tight">{val}</span>
    },
    {
        key: "description",
        title: "Description",
        render: (val) => <span className="text-gray-500 font-medium text-sm leading-relaxed">{val || "No description provided"}</span>
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex space-x-1">
          <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => navigate("/categories/add", { state: { category: row } })}
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
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Product Categories</h1>
          <p className="text-gray-500 font-medium">Organize and classify your inventory catalog</p>
        </div>
        <Button onClick={() => navigate("/categories/add")} variant="primary" size="lg" className="shadow-lg shadow-indigo-100">
          <FaPlus className="mr-2" />
          Create Category
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaMagnifyingGlass className="text-gray-400" />
             </div>
             <input 
                placeholder="Search categories..." 
                className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100">
            {filteredCategories.length} Types
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredCategories}
          loading={loading}
          emptyMessage={searchTerm ? `No categories found matching "${searchTerm}"` : "Your category list is empty. Start organizing!"}
        />
      </Card>
    </div>
  );
};

export default DisplayCategories;
