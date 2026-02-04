import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Table } from "../ui/Table";
import { FaPlus, FaEye, FaPenToSquare, FaTrashCan } from "react-icons/fa6";

const DisplayCustomers = () => {
  const navigate = useNavigate();
  const { customers = [], loading, actions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    actions.fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const result = await actions.deleteCustomer(id);
      if (result.success) {
        actions.addNotification({ type: 'success', message: 'Customer deleted successfully' });
      } else {
        actions.addNotification({ type: 'error', message: result.error || 'Failed to delete customer' });
      }
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  const columns = [
    {
      key: "name",
      title: "Name",
      render: (val) => <span className="font-bold text-gray-900">{val}</span>
    },
    {
      key: "email",
      title: "Email",
      render: (val) => <span className="text-gray-600">{val || 'N/A'}</span>
    },
    {
      key: "phone",
      title: "Phone",
       render: (val) => <span className="text-gray-600">{val}</span>
    },
    {
      key: "address",
      title: "Location",
      render: (_, row) => {
        if (!row.address) return <span className="text-gray-400">N/A</span>;
        return <span className="text-gray-600">{row.address.city}, {row.address.country}</span>;
      },
    },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            value === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value || "Unknown"}
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
            onClick={() => navigate(`/customers/add`, { state: { customer: row } })}
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
          <h1 className="text-2xl font-extrabold text-gray-900">Customer Directory</h1>
          <p className="text-gray-500 font-medium">Manage and track your customer base</p>
        </div>
        <Button onClick={() => navigate("/customers/add")} variant="primary" size="lg">
          <FaPlus className="mr-2" />
          Add Customer
        </Button>
      </div>

      <Card>
        <div className="mb-6">
           <div className="relative max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaPlus className="rotate-45" /> {/* Search icon replacement if needed, but I'll use a better one if possible */}
              </span>
              <input 
                type="text"
                placeholder="Search customers by name, email or phone..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredCustomers}
          loading={loading}
          emptyMessage={searchTerm ? `No customers found matching "${searchTerm}"` : "No customers found."}
        />
      </Card>
    </div>
  );
};

export default DisplayCustomers;
