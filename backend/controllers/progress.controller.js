import { Progress } from "../models/progress.model.js";

export async function getProgress(req, res) {
  try {
    const progress = await Progress.find();
    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function createProgress(req, res) {
  try {
    const newProgress = await Progress.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        module: newProgress,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + error,
    });
  }
}

export async function updateProgress(req, res) {
  try {
    const editedProgress = await Progress.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    // not working
    if (!editedProgress) {
      return res.status(500).json({
        success: false,
        message: "Wrong id",
      });
    }
    //
    res.status(200).json({
      success: true,
      data: editedProgress,
    });
  } catch (error) {
    console.log("err");
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function deleteProgress(req, res) {
  try {
    await Progress.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Progress deleted" });

    //id not found - to add
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + error,
    });
  }
}
