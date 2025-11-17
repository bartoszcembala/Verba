import mongoose from "mongoose";

const lessonSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
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
});

export const Lesson = mongoose.model("Lesson", lessonSchema);
