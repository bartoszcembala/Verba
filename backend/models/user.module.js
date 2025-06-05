import mongoose from "mongoose";
import bcrypt from "bcrypt";

const chartEntrySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
  },
  latestActivity: {
    type: [String],
    required: false,
    unique: false,
  },
  streak: {
    type: [String],
    required: false,
  },
  timeSpentLearning: { type: [chartEntrySchema] },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const User = mongoose.model("User", userSchema);
