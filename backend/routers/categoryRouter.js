import { Router } from "express";
const router = Router();
import categoryMethods from "../controllers/category.js";
const {
  addCategory,
  getAllCategories,
  getaSingleCategory,
  updateCategory,
  deleteCategory,
} = categoryMethods;

router.route("/").post(addCategory).get(getAllCategories);
router
  .route("/:id")
  .get(getaSingleCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
