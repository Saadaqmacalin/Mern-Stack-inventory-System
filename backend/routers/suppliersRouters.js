import { Router } from "express";
const router = Router();
import suppliersMethods from "../controllers/suppliers.js";
const { addSuppliers } = suppliersMethods;
router.route("/").post(addSuppliers);

export default router