import { Router } from "express";
const router = Router();
import productMethods from "../controllers/products.js"
const { addProduct } = productMethods

router.route("/").post(addProduct)

export default router