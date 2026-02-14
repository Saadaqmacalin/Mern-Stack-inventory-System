import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Table } from "../ui/Table";
import { FaPlus, FaEye, FaPenToSquare, FaTrashCan, FaCircleCheck, FaCircleXmark, FaTruck, FaClock } from "react-icons/fa6";

const DisplayOrders = () => {
  const navigate = useNavigate();
  const { orders = [], loading, actions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    actions.fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const result = await actions.deleteOrder(id);
       if (result.success) {
        actions.addNotification({ type: 'success', message: 'Order deleted successfully' });
      } else {
        actions.addNotification({ type: 'error', message: result.error || 'Failed to delete order' });
      }
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit shadow-sm";
    switch (status) {
      case "Delivered":
        return <span className={`${baseClasses} bg-green-100 text-green-700`}><FaCircleCheck /> Delivered</span>;
      case "Shipped":
        return <span className={`${baseClasses} bg-blue-100 text-blue-700`}><FaTruck /> Shipped</span>;
      case "Processing":
        return <span className={`${baseClasses} bg-indigo-100 text-indigo-700`}><FaClock /> Processing</span>;
      case "Pending":
       return <span className={`${baseClasses} bg-amber-100 text-amber-700`}><FaClock /> Pending</span>;
      case "Cancelled":
        return <span className={`${baseClasses} bg-red-100 text-red-700`}><FaCircleXmark /> Cancelled</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "orderNumber",
      title: "Order #",
      render: (value) => <span className="font-black text-gray-900">{value}</span>
    },
    {
        key: "orderDate",
        title: "Date",
        render: (value) => <span className="text-gray-500 font-medium">{new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
    },
    {
      key: "customerId",
      title: "Customer",
      render: (value) => (
        <div className="flex flex-col">
            <span className="font-bold text-gray-900">{value?.name || "Unknown"}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">{value?.phone || "No phone"}</span>
        </div>
      ),
    },
    {
      key: "items",
      title: "Order Details",
      render: (items) => (
        <div className="flex flex-col gap-1 min-w-[150px]">
          {items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-slate-50/50 px-2 py-1 rounded-lg border border-slate-100/50">
              <span className="text-[10px] font-black text-slate-600 truncate max-w-[100px]">
                {item.productId?.productName || "Item"}
              </span>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                x{item.quantity}
              </span>
            </div>
          ))}
        </div>
      )
    },
    {
      key: "totalAmount",
      title: "Amount",
      render: (value) => <span className="font-black text-indigo-600">${parseFloat(value).toFixed(2)}</span>,
    },
    {
      key: "status",
      title: "Status",
      render: (value) => getStatusBadge(value),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          {row.status !== "Delivered" && row.status !== "Cancelled" && (
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <select 
                className="text-[10px] font-bold uppercase tracking-wider bg-transparent border-none focus:ring-0 cursor-pointer"
                onChange={(e) => row._newStatus = e.target.value}
                defaultValue=""
              >
                <option value="" disabled>Status</option>
                <option value="Delivered">Deliver</option>
                <option value="Cancelled">Cancel</option>
                <option value="Shipped">Ship</option>
              </select>
              <Button
                variant="primary"
                size="sm"
                className="h-7 px-3 rounded-lg text-[10px]"
                onClick={async () => {
                  if (row._newStatus) {
                    const result = await actions.updateOrderStatus(row._id, row._newStatus);
                    if (result.success) {
                      actions.addNotification({ type: 'success', message: `Order marked as ${row._newStatus}` });
                    } else {
                      actions.addNotification({ type: 'error', message: result.error || 'Update failed' });
                    }
                  }
                }}
              >
                OK
              </Button>
            </div>
          )}
          <div className="flex space-x-1 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/orders/add`, { state: { order: row } })}
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
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 font-medium tracking-tight">Track and manage your customer lifecycle</p>
        </div>
        <Button onClick={() => navigate("/orders/add")} variant="primary" size="lg" className="shadow-lg shadow-indigo-100 dark:shadow-none">
          <FaPlus className="mr-2" />
          Create Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: "Total Orders", 
            value: orders.length, 
            icon: FaTruck, 
            color: "indigo",
            sub: "All historical records"
          },
          { 
            label: "Pending Orders", 
            value: orders.filter(o => o.status === "Pending").length, 
            icon: FaClock, 
            color: "amber",
            sub: "Awaiting processing"
          },
          { 
            label: "Delivered", 
            value: orders.filter(o => o.status === "Delivered").length, 
            icon: FaCircleCheck, 
            color: "green",
            sub: "Successfully finalized"
          }
        ].map((stat, i) => (
          <Card key={i} className="p-6 border-none shadow-sm group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                <stat.icon className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-[10px] font-bold text-gray-400 truncate">{stat.sub}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-6 flex justify-between items-center">
            <div className="relative max-w-sm w-full">
                <input 
                  type="text"
                  placeholder="Filter by ID or customer..."
                  className="block w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <Table
          columns={columns}
          data={filteredOrders}
          loading={loading}
          emptyMessage={searchTerm ? `No orders found matching "${searchTerm}"` : "No orders found."}
        />
      </Card>
    </div>
  );
};

export default DisplayOrders;
