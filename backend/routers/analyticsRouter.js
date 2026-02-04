import { Router } from "express";
const router = Router();
import {
  getSalesAnalytics,
  getTopProducts,
  getInventoryAnalytics,
  getCustomerAnalytics,
  getSupplierAnalytics,
  getProfitAnalytics
} from "../controllers/analytics.js";

router.get("/sales", getSalesAnalytics);
router.get("/top-products", getTopProducts);
router.get("/inventory", getInventoryAnalytics);
router.get("/customers", getCustomerAnalytics);
router.get("/suppliers", getSupplierAnalytics);
router.get("/profit", getProfitAnalytics);

export default router;
