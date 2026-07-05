import express from "express";
import { addLesson, getLessons } from "../controllers/lesson.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get(getLessons).post(addLesson);

export default router;
