import { DailyQuest } from "../models/dailyQuest.model.js";

export async function getDailyQuests(req, res) {
  try {
    const dailyQuests = await DailyQuest.find();
    res.status(200).json({
      success: true,
      data: dailyQuests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function getDailyQuest(req, res) {
  try {
    const dailyQuest = await DailyQuest.findOne({ userId: req.params.id });

    res.status(200).json({
      success: true,
      data: dailyQuest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function createDailyQuest(req, res) {
  try {
    const newDailyQuest = await DailyQuest.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        dailyQuest: newDailyQuest,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function updateDailyQuest(req, res) {
  try {
    console.log(req.params)
    const editedDailyQuest = await DailyQuest.findOneAndUpdate(
      { userId: req.params.id },
      { $set: req.body },
      { new: true }
    );

    // not working
    if (!editedDailyQuest) {
      return res.status(404).json({
        success: false,
        message: "Wrong idddd",
      });
    }
    //

    res.status(200).json({
      success: true,
      data: editedDailyQuest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function deleteDailyQuest(req, res) {
  try {
    await DailyQuest.findOneAndDelete({ userId: req.params.id });
    res.status(200).json({ success: true, message: "Daily Quest deleted" });

    //id not found - to add
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
