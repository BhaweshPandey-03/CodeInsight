import jwt from "jsonwebtoken";
import User from "../models/User.js";

const REVIEW_WINDOW_MS = 24 * 60 * 60 * 1000;

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };
    req.currentUser = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export const requireVerifiedEmail = (req, res, next) => {
  // if (!req.currentUser?.isEmailVerified) {
  //   return res.status(403).json({
  //     message: "Please verify your email before using code review",
  //     code: "EMAIL_NOT_VERIFIED",
  //   });
  // }

  next();
};

export const enforceDailyReviewLimit = async (req, res, next) => {
  const user = req.currentUser;

  if (!user || user.role === "admin") {
    return next();
  }

  const windowStartedAt = user.dailyReviewWindowStart?.getTime() || 0;

  if (!windowStartedAt || Date.now() - windowStartedAt >= REVIEW_WINDOW_MS) {
    user.dailyReviewWindowStart = new Date();
    user.dailyReviewCount = 0;
    await user.save();
  }

  if (user.dailyReviewCount >= user.dailyReviewLimit) {
    return res.status(429).json({
      message: "Daily review limit reached",
      code: "DAILY_REVIEW_LIMIT_REACHED",
      usage: {
        dailyReviewLimit: user.dailyReviewLimit,
        dailyReviewCount: user.dailyReviewCount,
        dailyReviewWindowStart: user.dailyReviewWindowStart,
      },
    });
  }

  next();
};

