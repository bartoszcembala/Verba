import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import moduleRoutes from "./routes/module.route.js";
import userRoutes from "./routes/user.route.js";
import progressRoutes from "./routes/progress.route.js";
import lessonRoutes from "./routes/lesson.route.js";
import dailyQuestRoutes from "./routes/dailyQuest.route.js";
import checkoutRouter from "./routes/checkout.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import nodeCron from "node-cron";
import { DailyQuest } from "./models/dailyQuest.model.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://verba-ebon.vercel.app",
      "http://localhost:5173",
      "https://verba-ywgu.onrender.com",
    ],
    credentials: true,
  }),
);

app.use("/api/modules", moduleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/lesson", lessonRoutes);
app.use("/api/daily-quests", dailyQuestRoutes);
app.use("/api/checkout", checkoutRouter);

nodeCron.schedule("0 0 * * *", async () => {
  const today = new Date().toISOString().split("T")[0];
  await DailyQuest.updateMany(
    {},
    {
      $set: {
        day: today,
        "quests.$[].progress": 0,
        "quests.$[].completed": false,
      },
    },
  );
});

app.listen(PORT, () => {
  connectDB();
  console.log("Started on: " + PORT);
});
