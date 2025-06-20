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

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/modules", moduleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/lesson", lessonRoutes);
app.use('/api/daily-quests', dailyQuestRoutes)
app.use("/api/checkout", checkoutRouter);

app.listen(PORT, () => {
  connectDB();
  console.log("Started on: " + PORT);
});
