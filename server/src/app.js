import express from "express";
import cors from "cors";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/reviewHistoryRoutes.js'
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.status(200).send("Server is running!");  
});

// routes
app.use("/api/review", reviewRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/auth", authRoutes);

export default app;
