import Sale from "../Models/sale.js";
import Product from "../Models/products.js";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

const getDemandForecast = async (req, res) => {
  try {
    const { productId, period = 30 } = req.query;
    
    if (!productId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Product ID is required",
      });
    }

    // Get historical sales data for the product
    const historicalSales = await Sale.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
          totalQuantity: { $sum: "$quantity" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 90 } // Last 90 days
    ]);

    // Simple moving average prediction (can be replaced with ML model)
    const recentSales = historicalSales.slice(-7); // Last 7 days
    const avgDailyDemand = recentSales.reduce((sum, day) => sum + day.totalQuantity, 0) / recentSales.length || 0;
    
    // Generate forecast for next period
    const forecast = [];
    const today = new Date();
    
    for (let i = 1; i <= period; i++) {
      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);
      
      // Add some randomness and trend (simplified prediction)
      const trend = 1 + (i * 0.01); // Slight upward trend
      const randomFactor = 0.8 + Math.random() * 0.4; // Random variation
      const predictedDemand = Math.round(avgDailyDemand * trend * randomFactor);
      
      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        predictedDemand: Math.max(0, predictedDemand),
        confidence: Math.max(0.5, Math.min(0.95, 1 - (i * 0.01))) // Decreasing confidence over time
      });
    }

    // Get current stock level
    const product = await Product.findById(productId);
    const currentStock = product ? product.quantity : 0;
    
    // Calculate recommended reorder point
    const leadTime = 7; // Assume 7 days lead time
    const safetyStock = Math.round(avgDailyDemand * 2); // 2 days safety stock
    const reorderPoint = Math.round(avgDailyDemand * leadTime + safetyStock);
    
    res.status(StatusCodes.OK).json({
      productId,
      productName: product?.productName,
      currentStock,
      avgDailyDemand: Math.round(avgDailyDemand),
      reorderPoint,
      safetyStock,
      forecast,
      recommendation: currentStock <= reorderPoint ? "REORDER" : "SUFFICIENT"
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getInventoryOptimization = async (req, res) => {
  try {
    // Get products with low stock
    const lowStockProducts = await Product.find({ 
      $or: [
        { quantity: { $lte: 10 } },
        { quantity: 0 }
      ]
    }).populate('categoryId', 'name').populate('supplierId', 'companyName');

    // Get sales velocity for each product
    const salesVelocity = await Sale.aggregate([
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
          orderCount: { $sum: 1 },
          lastSaleDate: { $max: "$saleDate" }
        }
      }
    ]);

    // Combine product data with sales velocity
    const productAnalysis = lowStockProducts.map(product => {
      const velocity = salesVelocity.find(s => s._id.toString() === product._id.toString());
      const daysSinceLastSale = velocity ? 
        Math.floor((new Date() - velocity.lastSaleDate) / (1000 * 60 * 60 * 24)) : 
        999; // Never sold
      
      return {
        productId: product._id,
        productName: product.productName,
        currentStock: product.quantity,
        category: product.categoryId?.name,
        supplier: product.supplierId?.companyName,
        salesVelocity: velocity?.totalQuantity || 0,
        orderCount: velocity?.orderCount || 0,
        daysSinceLastSale,
        priority: calculatePriority(product.quantity, velocity?.totalQuantity || 0, daysSinceLastSale),
        recommendedOrder: calculateRecommendedOrder(product.quantity, velocity?.totalQuantity || 0)
      };
    });

    // Sort by priority
    productAnalysis.sort((a, b) => b.priority - a.priority);

    res.status(StatusCodes.OK).json({
      totalItems: productAnalysis.length,
      criticalItems: productAnalysis.filter(p => p.priority >= 8).length,
      productAnalysis
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getSalesPrediction = async (req, res) => {
  try {
    const { period = 30 } = req.query;
    
    // Get historical sales data
    const historicalSales = await Sale.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 90 }
    ]);

    // Calculate trends
    const recentSales = historicalSales.slice(-14); // Last 14 days
    const olderSales = historicalSales.slice(-28, -14); // Previous 14 days
    
    const recentAvg = recentSales.reduce((sum, day) => sum + day.totalRevenue, 0) / recentSales.length || 0;
    const olderAvg = olderSales.reduce((sum, day) => sum + day.totalRevenue, 0) / olderSales.length || 0;
    
    const growthRate = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
    
    // Generate predictions
    const predictions = [];
    const today = new Date();
    
    for (let i = 1; i <= period; i++) {
      const predictionDate = new Date(today);
      predictionDate.setDate(today.getDate() + i);
      
      // Apply growth rate and seasonal factors
      const seasonalFactor = 1 + (Math.sin((i / period) * Math.PI * 2) * 0.1); // Simple seasonal pattern
      const predictedRevenue = recentAvg * (1 + (growthRate / 100)) * seasonalFactor * (0.9 + Math.random() * 0.2);
      const predictedOrders = Math.round((predictedRevenue / recentAvg) * (recentSales.reduce((sum, day) => sum + day.orderCount, 0) / recentSales.length));
      
      predictions.push({
        date: predictionDate.toISOString().split('T')[0],
        predictedRevenue: Math.round(predictedRevenue * 100) / 100,
        predictedOrders: Math.max(0, predictedOrders),
        confidence: Math.max(0.6, Math.min(0.9, 1 - (i * 0.01)))
      });
    }

    res.status(StatusCodes.OK).json({
      currentTrend: growthRate > 0 ? "GROWING" : growthRate < 0 ? "DECLINING" : "STABLE",
      growthRate: Math.round(growthRate * 100) / 100,
      averageDailyRevenue: Math.round(recentAvg * 100) / 100,
      predictions
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Helper functions
const calculatePriority = (stock, salesVelocity, daysSinceLastSale) => {
  let priority = 0;
  
  // Stock level priority
  if (stock === 0) priority += 10;
  else if (stock <= 5) priority += 8;
  else if (stock <= 10) priority += 5;
  
  // Sales velocity priority
  if (salesVelocity > 50) priority += 3;
  else if (salesVelocity > 20) priority += 2;
  else if (salesVelocity > 5) priority += 1;
  
  // Days since last sale (negative priority for old items)
  if (daysSinceLastSale < 7) priority += 2;
  else if (daysSinceLastSale > 30) priority -= 2;
  
  return Math.max(0, Math.min(10, priority));
};

const calculateRecommendedOrder = (stock, salesVelocity) => {
  if (salesVelocity === 0) return 0;
  
  // Order enough for 30 days + safety stock
  const monthlyDemand = salesVelocity * 30;
  const safetyStock = Math.round(monthlyDemand * 0.2); // 20% safety stock
  const recommendedOrder = Math.max(0, monthlyDemand + safetyStock - stock);
  
  return Math.round(recommendedOrder);
};

export {
  getDemandForecast,
  getInventoryOptimization,
  getSalesPrediction
};
