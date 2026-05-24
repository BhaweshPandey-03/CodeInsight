import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  type: String,
  line: Number,
  description: String,
  suggestion: String,
});

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    result: {
      summary: String,

      score: Number,

      issues: [issueSchema],

      refactoredCode: String,
    },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
