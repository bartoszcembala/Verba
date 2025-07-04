import express from "express";
import {
  createModule,
  deleteModule,
  getModules,
  updateModule,
} from "../controllers/module.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get( getModules).post(createModule);
router.route("/:id").patch(updateModule).delete(deleteModule);

export default router;
