const express = require("express");
const router = express.Router();
const {
  registerUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/user");

router.route("/").post(registerUser).get(getAllUsers);
router.route("/login").post(login);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
