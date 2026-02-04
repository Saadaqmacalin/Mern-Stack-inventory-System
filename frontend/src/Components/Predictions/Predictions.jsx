import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBrain, FaChartLine, FaBox, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const Predictions = () => {
  const [demandForecast, setDemandForecast] = useState(null);
  const [inventoryOptimization, setInventoryOptimization] = useState(null);
  const [salesPrediction, setSalesPrediction] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("demand");

  useEffect(() => {
    fetchProducts();
    fetchPredictionsData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchPredictionsData = async () => {
    try {
      setLoading(true);
      
      const [inventoryRes, salesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/predictions/inventory-optimization"),
        axios.get("http://localhost:5000/api/predictions/sales-prediction")
      ]);

      setInventoryOptimization(inventoryRes.data);
      setSalesPrediction(salesRes.data);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDemandForecast = async () => {
    if (!selectedProduct) return;
    
    try {
      const response = await axios.get(
        `http://localhost:5000/api/predictions/demand-forecast?productId=${selectedProduct}`
      );
      setDemandForecast(response.data);
    } catch (error) {
      console.error("Error fetching demand forecast:", error);
    }
  };

  useEffect(() => {
    fetchDemandForecast();
  }, [selectedProduct]);

  const getPriorityColor = (priority) => {
    if (priority >= 8) return "text-red-600 bg-red-100";
    if (priority >= 5) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  const getRecommendationColor = (recommendation) => {
    return recommendation === "REORDER" ? "text-red-600" : "text-green-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading predictions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaBrain className="text-purple-500" />
            AI Predictions & Forecasting
          </h1>
          <p className="text-gray-600 mt-2">Leverage machine learning for inventory optimization</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("demand")}
            className={`pb-2 px-4 font-medium ${
              activeTab === "demand"
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Demand Forecast
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`pb-2 px-4 font-medium ${
              activeTab === "inventory"
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Inventory Optimization
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`pb-2 px-4 font-medium ${
              activeTab === "sales"
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Sales Prediction
          </button>
        </div>

        {/* Demand Forecast Tab */}
        {activeTab === "demand" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Demand Forecast</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productName}
                    </option>
                  ))}
                </select>
              </div>

              {demandForecast && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Current Stock</p>
                      <p className="text-2xl font-bold text-gray-800">{demandForecast.currentStock}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Avg Daily Demand</p>
                      <p className="text-2xl font-bold text-gray-800">{demandForecast.avgDailyDemand}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Reorder Point</p>
                      <p className="text-2xl font-bold text-gray-800">{demandForecast.reorderPoint}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center gap-2">
                      <FaExclamationTriangle className="text-purple-600" />
                      <span className="font-semibold text-purple-800">Recommendation:</span>
                      <span className={`font-bold ${getRecommendationColor(demandForecast.recommendation)}`}>
                        {demandForecast.recommendation}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">30-Day Forecast</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {demandForecast.forecast.slice(0, 10).map((day, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">{day.date}</span>
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{day.predictedDemand} units</span>
                            <span className="text-xs text-gray-500">{(day.confidence * 100).toFixed(0)}% confidence</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inventory Optimization Tab */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory Optimization</h2>
              
              {inventoryOptimization && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600">Critical Items</p>
                      <p className="text-2xl font-bold text-red-800">{inventoryOptimization.criticalItems}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-600">Total Items Needing Attention</p>
                      <p className="text-2xl font-bold text-orange-800">{inventoryOptimization.totalItems}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Average Order Value</p>
                      <p className="text-2xl font-bold text-blue-800">
                        ${inventoryOptimization.productAnalysis?.[0]?.recommendedOrder || 0}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Priority Items</h3>
                    <div className="space-y-3">
                      {inventoryOptimization.productAnalysis?.slice(0, 5).map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                              <p className="text-sm text-gray-600">Category: {item.category}</p>
                              <p className="text-sm text-gray-600">Supplier: {item.supplier}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                Priority: {item.priority}/10
                              </span>
                              <p className="text-sm text-gray-600 mt-1">Stock: {item.currentStock}</p>
                              <p className="text-sm text-gray-600">Recommended Order: {item.recommendedOrder}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sales Prediction Tab */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Prediction</h2>
              
              {salesPrediction && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Current Trend</p>
                      <p className={`text-xl font-bold ${
                        salesPrediction.currentTrend === "GROWING" ? "text-green-600" :
                        salesPrediction.currentTrend === "DECLINING" ? "text-red-600" : "text-gray-600"
                      }`}>
                        {salesPrediction.currentTrend}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Growth Rate</p>
                      <p className={`text-xl font-bold ${
                        salesPrediction.growthRate > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {salesPrediction.growthRate > 0 ? "+" : ""}{salesPrediction.growthRate}%
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Avg Daily Revenue</p>
                      <p className="text-xl font-bold text-gray-800">${salesPrediction.averageDailyRevenue}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">30-Day Sales Forecast</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {salesPrediction.predictions?.slice(0, 10).map((prediction, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">{prediction.date}</span>
                          <div className="flex items-center gap-4">
                            <span className="font-medium">${prediction.predictedRevenue}</span>
                            <span className="text-sm text-gray-500">{prediction.predictedOrders} orders</span>
                            <span className="text-xs text-gray-500">{(prediction.confidence * 100).toFixed(0)}% confidence</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictions;
