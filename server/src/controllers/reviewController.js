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

    res.status(200).json(result);
  } catch (error) {
    console.error("Controller Error:", error.message);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
