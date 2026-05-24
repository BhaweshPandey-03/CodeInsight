import express from "express";

import {
  saveReview,
  getMyReviews,
  deleteReview,
} from "../controllers/reviewHistoryController.js";

import {
  protect,
  enforceDailyReviewLimit,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// SAVE REVIEW
router.post("/", protect, enforceDailyReviewLimit, saveReview);

// GET USER HISTORY
router.get("/", protect, enforceDailyReviewLimit, getMyReviews);

// DELETE REVIEW
router.delete("/:id", protect, enforceDailyReviewLimit, deleteReview);

export default router;
