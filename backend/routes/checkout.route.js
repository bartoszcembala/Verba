import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getCheckoutSession } from "../controllers/checkout.controller.js";

const router = express.Router();

router.route("/:id").get( getCheckoutSession);

export default router;
