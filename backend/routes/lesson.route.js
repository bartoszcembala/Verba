import express from "express";
import { addLesson, getLessons } from "../controllers/lesson.controller.js";

const router = express.Router();

router.route("/").get(getLessons).post(addLesson);

export default router;
