import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
    unique: true,
  },
  moduleName: {
    type: String,
    require: true,
    unique: true,
  },
  learned: {
    type: [String],
  },
});

export const Progress = mongoose.model("Progress", progressSchema);
