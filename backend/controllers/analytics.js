import Sale from "../Models/sale.js";
import Purchase from "../Models/purchase.js";
import Product from "../Models/products.js";
import Customer from "../Models/customer.js";
import Supplier from "../Models/suppliers.js";
import Order from "../Models/order.js";
import { StatusCodes } from "http-status-codes";

const getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;
    
    const matchCondition = {
      paymentStatus: "Paid" // Only count paid orders for revenue
    };
    
    if (startDate && endDate) {
      matchCondition.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let groupFormat = "%Y-%m-%d";
    if (period === 'monthly') groupFormat = "%Y-%m";
    if (period === 'yearly') groupFormat = "%Y";
    if (period === 'weekly') groupFormat = "%Y-w%V"; // Year and Week number

    const salesAnalytics = await Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$orderDate" } },
          totalSales: { $sum: "$totalAmount" },
          totalQuantity: { 
            $sum: { 
              $reduce: {
                input: "$items",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.quantity"] }
              }
            }
          },
          averageOrderValue: { $avg: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(StatusCodes.OK).json({ salesAnalytics });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;
    
    const matchCondition = {};
    if (startDate && endDate) {
      matchCondition.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const topProducts = await Sale.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.productName",
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1,
          price: "$product.price"
        }
      }
    ]);

    res.status(StatusCodes.OK).json({ topProducts });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getInventoryAnalytics = async (req, res) => {
  try {
    const inventoryAnalytics = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStockValue: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
          lowStockItems: {
            $sum: {
              $cond: [{ $lte: ["$quantity", 10] }, 1, 0]
            }
          },
          outOfStockItems: {
            $sum: {
              $cond: [{ $eq: ["$quantity", 0] }, 1, 0]
            }
          },
          averageCostPrice: { $avg: "$costPrice" },
          averageSellingPrice: { $avg: "$price" }
        }
      }
    ]);

    const stockByCategory = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.name",
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
          productCount: { $sum: 1 }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    res.status(StatusCodes.OK).json({ 
      inventoryAnalytics: inventoryAnalytics[0] || {},
      stockByCategory 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getCustomerAnalytics = async (req, res) => {
  try {
    const customerAnalytics = await Sale.aggregate([
      {
        $group: {
          _id: "$customerId",
          totalSpent: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: "$totalAmount" },
          lastOrderDate: { $max: "$saleDate" }
        }
      },
      { $sort: { totalSpent: -1 } },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer"
        }
      },
      { $unwind: "$customer" },
      {
        $project: {
          customerName: "$customer.name",
          email: "$customer.email",
          totalSpent: 1,
          orderCount: 1,
          averageOrderValue: 1,
          lastOrderDate: 1
        }
      }
    ]);

    res.status(StatusCodes.OK).json({ customerAnalytics });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getSupplierAnalytics = async (req, res) => {
  try {
    const supplierAnalytics = await Purchase.aggregate([
      {
        $group: {
          _id: "$supplierId",
          totalPurchased: { $sum: "$totalCost" },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: "$totalCost" }
        }
      },
      { $sort: { totalPurchased: -1 } },
      {
        $lookup: {
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplier"
        }
      },
      { $unwind: "$supplier" },
      {
        $project: {
          supplierName: "$supplier.companyName",
          email: "$supplier.email",
          totalPurchased: 1,
          orderCount: 1,
          averageOrderValue: 1
        }
      }
    ]);

    res.status(StatusCodes.OK).json({ supplierAnalytics });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getProfitAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query;
    
    const matchCondition = {};
    if (startDate && endDate) {
      matchCondition.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const profitAnalytics = await Sale.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: period === 'monthly' ? 
            { $dateToString: { format: "%Y-%m", date: "$saleDate" } } :
            { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
          totalRevenue: { $sum: "$totalAmount" },
          totalCost: { $sum: { $multiply: ["$quantity", "$product.costPrice"] } },
          totalProfit: {
            $sum: { $multiply: ["$quantity", { $subtract: ["$product.price", "$product.costPrice"] }] }
          },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $addFields: {
          profitMargin: {
            $multiply: [
              { $divide: ["$totalProfit", "$totalRevenue"] },
              100
            ]
          }
        }
      }
    ]);

    res.status(StatusCodes.OK).json({ profitAnalytics });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export {
  getSalesAnalytics,
  getTopProducts,
  getInventoryAnalytics,
  getCustomerAnalytics,
  getSupplierAnalytics,
  getProfitAnalytics
};
