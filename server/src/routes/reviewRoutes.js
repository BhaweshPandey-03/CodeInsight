import express from "express";
import { reviewController } from "../controllers/reviewController.js";
import {
  enforceDailyReviewLimit,
  protect,
  requireVerifiedEmail,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  requireVerifiedEmail,
  enforceDailyReviewLimit,
  reviewController,
);

export default router;
