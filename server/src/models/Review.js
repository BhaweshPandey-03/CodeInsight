// models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    language: String,
    code: String,
    result: Object, 
  },
  { timestamps: true },
);

export default mongoose.model("Review", reviewSchema);
