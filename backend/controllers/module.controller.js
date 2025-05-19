import { Module } from "../models/module.model.js";

export async function getModules(req, res) {
  try {
    const modules = await Module.find();
    res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function createModule(req, res) {
  try {
    const newModule = await Module.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        module: newModule,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function updateModule(req, res) {
  try {
    const editedModule = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    // not working
    if (!editedModule) {
      return res.status(500).json({
        success: false,
        message: "Wrong id",
      });
    }
    //

    res.status(200).json({
      success: true,
      data: editedModule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

export async function deleteModule(req, res) {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Module deleted" });

    //id not found - to add
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
