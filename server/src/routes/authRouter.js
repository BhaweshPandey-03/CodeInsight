import express from "express";

import {
  login,
  register,
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/verify-email", verifyEmail);

router.post("/resend-verification", protect, resendVerificationEmail);

export default router;
