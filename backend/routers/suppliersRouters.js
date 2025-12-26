import { Router } from "express";
const router = Router();
import suppliersMethods from "../controllers/suppliers.js";
const { addSuppliers,getSuppliers } = suppliersMethods;

router.route("/").post(addSuppliers).get(getSuppliers);

export default router