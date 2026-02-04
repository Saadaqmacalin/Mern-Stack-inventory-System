import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChartBar, FaFileDownload, FaCalendar, FaFilter, FaBox, FaUsers, FaDollarSign, FaShoppingCart, FaCog } from "react-icons/fa";

const Reports = () => {
  const [activeReport, setActiveReport] = useState("sales");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [format, setFormat] = useState("json");

  useEffect(() => {
    if (activeReport) {
      generateReport();
    }
  }, [activeReport]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const params = { format };
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      let endpoint = "";
      switch (activeReport) {
        case "sales":
          endpoint = "http://localhost:5000/api/reports/sales";
          break;
        case "inventory":
          endpoint = "http://localhost:5000/api/reports/inventory";
          break;
        case "financial":
          endpoint = "http://localhost:5000/api/reports/financial";
          break;
        case "customer":
          endpoint = "http://localhost:5000/api/reports/customer";
          break;
        case "order":
          endpoint = "http://localhost:5000/api/reports/order";
          break;
        default:
          endpoint = "http://localhost:5000/api/reports/sales";
      }

      const response = await axios.get(endpoint, { params });
      setReportData(response.data);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const params = { format: "csv" };
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      let endpoint = "";
      switch (activeReport) {
        case "sales":
          endpoint = "http://localhost:5000/api/reports/sales";
          break;
        case "inventory":
          endpoint = "http://localhost:5000/api/reports/inventory";
          break;
        case "financial":
          endpoint = "http://localhost:5000/api/reports/financial";
          break;
        case "customer":
          endpoint = "http://localhost:5000/api/reports/customer";
          break;
        case "order":
          endpoint = "http://localhost:5000/api/reports/order";
          break;
      }

      const response = await axios.get(endpoint, { 
        params,
        responseType: 'blob'
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
      console.error("Error downloading report:", error);
    }
  };

  const reportTypes = [
    { id: "sales", name: "Sales Report", icon: FaChartBar, color: "blue" },
    { id: "inventory", name: "Inventory Report", icon: FaBox, color: "green" },
    { id: "financial", name: "Financial Report", icon: FaDollarSign, color: "purple" },
    { id: "customer", name: "Customer Report", icon: FaUsers, color: "orange" },
    { id: "order", name: "Order Report", icon: FaShoppingCart, color: "red" }
  ];

  const renderSummaryCards = (summary) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className="text-2xl font-bold text-gray-800">
              {typeof value === 'number' ? 
                (key.includes('Value') || key.includes('Revenue') || key.includes('Profit') || key.includes('Sales') || key.includes('Cost') || key.includes('Amount') ? 
                  `$${value.toFixed(2)}` : value) : 
                value}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderSalesReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        {reportData.summary && renderSummaryCards(reportData.summary)}
        
        {reportData.salesByProduct && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales by Product</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Product</th>
                    <th className="text-right py-2 px-4">Quantity</th>
                    <th className="text-right py-2 px-4">Revenue</th>
                    <th className="text-right py-2 px-4">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.salesByProduct.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{item.productName}</td>
                      <td className="text-right py-2 px-4">{item.totalQuantity}</td>
                      <td className="text-right py-2 px-4">${item.totalRevenue.toFixed(2)}</td>
                      <td className="text-right py-2 px-4">{item.orderCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportData.salesByCustomer && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Customers</h3>
            <div className="space-y-3">
              {reportData.salesByCustomer.slice(0, 10).map((customer, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{customer.customerName}</p>
                    <p className="text-sm text-gray-500">{customer.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${customer.totalSpent.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{customer.orderCount} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInventoryReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        {reportData.summary && renderSummaryCards(reportData.summary)}
        
        {reportData.stockByCategory && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock by Category</h3>
            <div className="space-y-3">
              {reportData.stockByCategory.map((category, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{category._id}</p>
                    <p className="text-sm text-gray-500">{category.productCount} products</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{category.totalQuantity} units</p>
                    <p className="text-sm text-gray-500">${category.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportData.lowStockProducts && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Items</h3>
            <div className="space-y-3">
              {reportData.lowStockProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-gray-500">{product.categoryId?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{product.quantity} units</p>
                    <p className="text-sm text-gray-500">{product.supplierId?.companyName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFinancialReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        {reportData.summary && renderSummaryCards(reportData.summary)}
        
        {reportData.profitByProduct && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit by Product</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Product</th>
                    <th className="text-right py-2 px-4">Revenue</th>
                    <th className="text-right py-2 px-4">Cost</th>
                    <th className="text-right py-2 px-4">Profit</th>
                    <th className="text-right py-2 px-4">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.profitByProduct.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{product.productName}</td>
                      <td className="text-right py-2 px-4">${product.totalRevenue.toFixed(2)}</td>
                      <td className="text-right py-2 px-4">${product.totalCost.toFixed(2)}</td>
                      <td className={`text-right py-2 px-4 font-semibold ${product.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${product.totalProfit.toFixed(2)}
                      </td>
                      <td className="text-right py-2 px-4">{product.profitMargin.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCustomerReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        {reportData.summary && renderSummaryCards(reportData.summary)}
        
        {reportData.topCustomers && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Customers</h3>
            <div className="space-y-3">
              {reportData.topCustomers.map((customer, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{customer.customerName}</p>
                    <p className="text-sm text-gray-500">{customer.customerEmail}</p>
                    <p className="text-sm text-gray-500">{customer.customerPhone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${customer.totalSpent.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{customer.orderCount} orders</p>
                    <p className="text-sm text-gray-500">Avg: ${customer.averageOrderValue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOrderReport = () => {
    if (!reportData) return null;

    return (
      <div className="space-y-6">
        {reportData.summary && renderSummaryCards(reportData.summary)}
        
        {reportData.orderStats && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders by Status</h3>
            <div className="space-y-3">
              {reportData.orderStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{stat._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{stat.count} orders</p>
                    <p className="text-sm text-gray-500">${stat.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportData.ordersByPaymentMethod && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders by Payment Method</h3>
            <div className="space-y-3">
              {reportData.ordersByPaymentMethod.map((method, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{method._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{method.count} orders</p>
                    <p className="text-sm text-gray-500">${method.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case "sales":
        return renderSalesReport();
      case "inventory":
        return renderInventoryReport();
      case "financial":
        return renderFinancialReport();
      case "customer":
        return renderCustomerReport();
      case "order":
        return renderOrderReport();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaChartBar className="text-blue-500" />
            Reports & Analytics
          </h1>
          <button
            onClick={downloadReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaFileDownload /> Download CSV
          </button>
        </div>

        {/* Report Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveReport(type.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                activeReport === type.id
                  ? `border-${type.color}-500 bg-${type.color}-50`
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <type.icon className={`text-${type.color}-500 text-2xl mb-2 mx-auto`} />
              <p className="text-sm font-medium">{type.name}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={generateReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaFilter /> Apply Filters
            </button>
            <button
              onClick={() => setDateRange({ startDate: "", endDate: "" })}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Report Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          renderReportContent()
        )}
      </div>
    </div>
  );
};

export default Reports;
