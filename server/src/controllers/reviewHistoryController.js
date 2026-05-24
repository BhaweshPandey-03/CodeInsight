


import Review from "../models/Review.js";

// CREATE REVIEW
export const saveReview = async (req, res) => {
  try {

      console.log("saveReview :", req.body);
      
      const { language, code, result } = req.body;

    const review = await Review.create({
      user: req.user.id,
      language,
      code,
      result,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET LOGGED-IN USER REVIEWS
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE REVIEW
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // owner or admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await review.deleteOne();

    res.json({
      message: "Review deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};