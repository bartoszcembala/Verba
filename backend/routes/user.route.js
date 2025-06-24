import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectedRoute, checkAuth);

router.route("/").get(getUsers).post(createUser);
router.route("/:id").patch(updateUser).delete(deleteUser).get(getUser);

export default router;
