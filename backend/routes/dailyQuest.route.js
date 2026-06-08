import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  createDailyQuest,
  deleteDailyQuest,
  getDailyQuest,
  getDailyQuests,
  updateDailyQuest,
} from "../controllers/dailyQuest.controller.js";
import { DailyQuest } from "../models/dailyQuest.model.js";

const router = express.Router();

router.route("/increment").patch(async (req, res) => {
  const { index, userId } = req.body;

  try {
    const doc = await DailyQuest.findOne({ userId });
    if (!doc) return res.status(404).json({ error: "Daily quests not found" });

    const quest = doc.quests[index];
    if (!quest) return res.status(404).json({ error: "Quest not found" });

    // 1) Zwiększamy progress o 1
    if (quest.progress < quest.toObtain) {
      quest.progress += 1;
    }

    // 2) Jeśli progress osiągnął toObtain → completed = true
    if (quest.progress >= quest.toObtain) {
      quest.completed = true;
    }

    await doc.save();

    res.json({ success: true, quests: doc.quests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/:id").get(getDailyQuest).delete(deleteDailyQuest);

router.route("/").get(getDailyQuests).post(createDailyQuest);

export default router;
