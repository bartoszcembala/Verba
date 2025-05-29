import { Lesson } from "../models/lesson.model.js";

export async function getLessons(req, res) {
  try {
    const lessons = await Lesson.find();

    res.status(200).json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function addLesson(req, res) {
  try {
    const newLesson = await Lesson.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        lesson: newLesson,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
}
