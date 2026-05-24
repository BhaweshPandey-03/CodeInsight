import Review from "../models/Review.js";
import { reviewService } from "../services/reviewService.js";

export const reviewController = async (req, res) => {
  try {
    const { code, language } = req.body;

    // validation
    if (!code) {
      return res.status(400).json({
        error: "Code is required",
      });
    }

    const result = await reviewService(code, language || "javascript");
    console.log("Review returned! ");

    if (!result.success) {
      return res.status(502).json(result);
    }

    if (req.currentUser && req.currentUser.role !== "admin") {
      req.currentUser.dailyReviewCount += 1;
      await req.currentUser.save();

      result.usage = {
        dailyReviewLimit: req.currentUser.dailyReviewLimit,
        dailyReviewCount: req.currentUser.dailyReviewCount,
        dailyReviewWindowStart: req.currentUser.dailyReviewWindowStart,
      };
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Controller Error:", error.message);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
