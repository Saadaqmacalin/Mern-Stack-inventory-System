import { Router } from "express";
const router = Router();
// import suppliersMethods from "../controllers/suppliers.js";
import {
  addSuppliers,
  getSuppliers,
  getSupplierById,
  UpdateSupplier,
  deleteSupplier,
} from "../controllers/suppliers.js";

router.route("/").post(addSuppliers).get(getSuppliers);
router
  .route("/:id")
  .get(getSupplierById)
  .patch(UpdateSupplier)
  .delete(deleteSupplier);

export default router;
