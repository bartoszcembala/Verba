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

const friendsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  friendId: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
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
    type: [[String]],
    required: false,
    unique: false,
  },
  streak: {
    type: [String],
    required: false,
  },
  timeSpentLearning: {
    type: [chartEntrySchema],
  },
  premium: {
    type: Boolean,
    default: false,
  },
  exp: {
    type: Number,
    default: 0,
  },
  finishedLessons: {
    type: [String],
    default: [],
  },
  friends: {
    type: [friendsSchema],
    default: [],
  },
  avatar: {
    type: String,
    default: "1",
  },
  quiz: {
    date: { type: String },
    finished: { type: Boolean, required: true, default: false },
  },
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
