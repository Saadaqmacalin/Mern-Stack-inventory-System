import { Router } from "express";
const router = Router();

import {
  registerUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  login,
  resetPassword,
} from "../controllers/user.js";

router.route("/").post(registerUser).get(getAllUsers);
router.route("/login").post(login);
router.route("/resetpassword").patch(resetPassword);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

export default router;
