import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  learned: {
    type: [String],
  },
});

progressSchema.index({ userName: 1, moduleName: 1 }, { unique: true });

export const Progress = mongoose.model("Progress", progressSchema);
