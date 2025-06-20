import mongoose from "mongoose";

const dailyQuestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  day: { type: String, required: true },
  quest1: {
    title: String,
    progress: Number,
    toObtain: Number,
    completed: Boolean,
    icon: String,
  },
  quest2: {
    title: String,
    progress: Number,
    toObtain: Number,
    completed: Boolean,
    icon: String,
  },
  quest3: {
    title: String,
    progress: Number,
    toObtain: Number,
    completed: Boolean,
    icon: String,
  },
  quest3: {
    title: String,
    progress: Number,
    toObtain: Number,
    completed: Boolean,
    icon: String,
  },
  quest4: {
    title: String,
    progress: Number,
    toObtain: Number,
    completed: Boolean,
    icon: String,
  },
});

export const DailyQuest = mongoose.model("DailyQuest", dailyQuestSchema);
