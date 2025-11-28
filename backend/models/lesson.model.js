import mongoose from "mongoose";

const lessonSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  displayTitle: {
    type: String,
    required: true,
  },
  html: {
    type: String,
    required: true,
  },
  relatedExercises: {
    type: [String],
    default: [],
  },
  type: {
    type: String,
  },
  level: {
    type: String,
  },
});

export const Lesson = mongoose.model("Lesson", lessonSchema);
