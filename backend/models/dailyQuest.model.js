import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
  title: String,
  progress: Number,
  toObtain: Number,
  completed: Boolean,
  icon: String,
});

const dailyQuestSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  day: { type: String, required: true },
  quests: [questSchema],
});

export const DailyQuest = mongoose.model("DailyQuest", dailyQuestSchema);
