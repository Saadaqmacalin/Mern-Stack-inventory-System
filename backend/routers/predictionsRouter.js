import { Router } from "express";
const router = Router();
import {
  getDemandForecast,
  getInventoryOptimization,
  getSalesPrediction
} from "../controllers/predictions.js";

router.get("/demand-forecast", getDemandForecast);
router.get("/inventory-optimization", getInventoryOptimization);
router.get("/sales-prediction", getSalesPrediction);

export default router;
