import { User } from "../models/user.module.js";

export async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function createUser(req, res) {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating: " + error,
    });
  }
}

export async function updateUser(req, res) {
  try {
    const editedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: editedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function deleteUser(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted" });

    //id not found - to add
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
