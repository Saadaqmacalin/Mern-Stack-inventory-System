import { Router } from "express";
const router = Router();

import { addProduct, getProducts } from "../controllers/products.js";

router.route("/").post(addProduct).get(getProducts);

export default router;
