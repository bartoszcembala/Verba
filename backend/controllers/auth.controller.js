import jwt from "jsonwebtoken";
import { User } from "../models/user.module.js";
import { DailyQuest } from "../models/dailyQuest.model.js";

function signToken(id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
}

export async function signup(req, res, next) {
  try {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    const today = new Date().toISOString().split("T")[0]; // np. "2025-11-23"

    const defaultQuests = [
      {
        title: "spend 10 minutes learning",
        progress: 0,
        toObtain: 10,
        completed: false,
        icon: "clock",
      },
      {
        title: "learn 5 new words",
        progress: 0,
        toObtain: 5,
        completed: false,
        icon: "bulb",
      },
      {
        title: "finish Daily Quiz",
        progress: 0,
        toObtain: 1,
        completed: false,
        icon: "flag",
      },
      {
        title: "finish new lesson",
        progress: 0,
        toObtain: 1,
        completed: false,
        icon: "flag",
      },
    ];

    await DailyQuest.create({
      userId: newUser._id.toString(),
      day: today,
      quests: defaultQuests,
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while signing: " + error,
    });
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = signToken(user._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while logging in: " + error.message,
    });
  }
}

export function logout(req, res) {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function checkAuth(req, res) {
  try {
    res.status(200).json({ user: req.user, message: "User is authenticated" });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
