import express from "express";

import {
  saveReview,
  getMyReviews,
  deleteReview,
} from "../controllers/reviewHistoryController.js";

import {
  protect,

} from "../middlewares/authMiddleware.js";

const router = express.Router();

// SAVE REVIEW
router.post("/", protect, saveReview);

// GET USER HISTORY
router.get("/", protect, getMyReviews);

// DELETE REVIEW
router.delete("/:id", protect, deleteReview);

export default router;
