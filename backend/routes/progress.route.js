import express from "express";
import {
  createProgress,
  deleteProgress,
  getProgress,
  updateProgress,
} from "../controllers/progress.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get(protectedRoute, getProgress).post(createProgress);
router.route("/:id").patch(updateProgress).delete(deleteProgress);

export default router;
