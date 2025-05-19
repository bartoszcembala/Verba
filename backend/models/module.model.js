import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide module name!"],
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
    unique: true,
  },
  words: {
    type: [[String]],
    required: true,
  },
});

export const Module = mongoose.model("Module", moduleSchema);
