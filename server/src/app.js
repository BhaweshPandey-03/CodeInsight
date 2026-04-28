import express from "express";
import cors from "cors";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

// routes
app.use("/api/review", reviewRoutes);

export default app;
