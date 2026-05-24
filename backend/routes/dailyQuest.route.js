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

router.route("/:id").get(getDailyQuest).delete(deleteDailyQuest);

router.route("/").get(getDailyQuests).post(createDailyQuest);

router.route("/increment").patch(protectedRoute, async (req, res) => {
  console.log("Incrementing daily quest progress...");
  const { index } = req.body;
  const userId = req.user._id.toString();
  // const userId = "6829113e3e415187ca672eec";

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

export default router;
