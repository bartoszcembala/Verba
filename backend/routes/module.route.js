import express from "express";
import {
  createModule,
  deleteModule,
  getModules,
  updateModule,
} from "../controllers/module.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(protectedRoute, getModules)
  .post(protectedRoute, createModule);
router
  .route("/:id")
  .patch(protectedRoute, updateModule)
  .delete(protectedRoute, deleteModule);

export default router;
