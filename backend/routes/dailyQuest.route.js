import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  createDailyQuest,
  deleteDailyQuest,
  getDailyQuest,
  getDailyQuests,
  updateDailyQuest,
} from "../controllers/dailyQuest.controller.js";

const router = express.Router();

router
  .route("/:id")
  .get(protectedRoute, getDailyQuest)
  .patch(updateDailyQuest)
  .delete(deleteDailyQuest);
  
router.route("/").get(protectedRoute, getDailyQuests).post(createDailyQuest);

export default router;
