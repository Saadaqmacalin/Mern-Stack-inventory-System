import { Router } from "express";
const router = Router();

import {
  addCategory,
  getAllCategories,
  getaSingleCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";

router.route("/").post(addCategory).get(getAllCategories);
router
  .route("/:id")
  .get(getaSingleCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
