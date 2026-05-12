import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createRawToken, hashToken } from "../utils/authTokens.js";
import { sendVerificationEmail } from "../utils/email.js";

const VERIFICATION_TOKEN_EXPIRES_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  authProvider: user.authProvider,
  usage: {
    dailyReviewLimit: user.dailyReviewLimit,
    dailyReviewCount: user.dailyReviewCount,
    dailyReviewWindowStart: user.dailyReviewWindowStart,
  },
});

const attachEmailVerificationToken = (user) => {
  const rawToken = createRawToken();

  user.emailVerificationTokenHash = hashToken(rawToken);
  user.emailVerificationExpiresAt = new Date(
    Date.now() + VERIFICATION_TOKEN_EXPIRES_MS,
  );
  user.lastVerificationEmailSentAt = new Date();

  return rawToken;
};

const sendAndShapeVerificationResponse = async (user, rawToken) => {
  const emailResult = await sendVerificationEmail({
    email: user.email,
    name: user.name,
    token: rawToken,
  });

  return {
    verificationEmailSent: emailResult.sent,
    ...(process.env.NODE_ENV !== "production" && !emailResult.sent
      ? { devVerificationUrl: emailResult.verificationUrl }
      : {}),
  };
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });
    const rawVerificationToken = attachEmailVerificationToken(user);
    await user.save();
    const verification = await sendAndShapeVerificationResponse(
      user,
      rawVerificationToken,
    );

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      token: generateToken(user),
      user: buildUserResponse(user),
      ...verification,
    });
    console.log("User created: ", user.name, user.email);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    // find user
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user),
      user: buildUserResponse(user),
    });
    console.log("User logged in : ", user.name, user.email);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = req.body.token || req.query.token;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
      });
    }

    const user = await User.findOne({
      emailVerificationTokenHash: hashToken(token),
      emailVerificationExpiresAt: { $gt: new Date() },
    }).select("+emailVerificationTokenHash +emailVerificationExpiresAt");

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();

    return res.json({
      message: "Email verified successfully",
      token: generateToken(user),
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "+emailVerificationTokenHash +emailVerificationExpiresAt",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.json({
        message: "Email is already verified",
        user: buildUserResponse(user),
      });
    }

    const lastSentAt = user.lastVerificationEmailSentAt?.getTime() || 0;

    if (Date.now() - lastSentAt < RESEND_COOLDOWN_MS) {
      return res.status(429).json({
        message: "Please wait before requesting another verification email",
      });
    }

    const rawVerificationToken = attachEmailVerificationToken(user);
    await user.save();
    const verification = await sendAndShapeVerificationResponse(
      user,
      rawVerificationToken,
    );

    return res.json({
      message: "Verification email sent",
      user: buildUserResponse(user),
      ...verification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
