const express = require("express");
const router = express.Router();
const {
  addCategory,
  getAllCategories,
  getaSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

router.route("/").post(addCategory).get(getAllCategories);
router
  .route("/:id")
  .get(getaSingleCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;
