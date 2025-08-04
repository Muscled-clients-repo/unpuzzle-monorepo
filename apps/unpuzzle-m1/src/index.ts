import "dotenv/config";
import "./utility/logger";

import express from "express";
import videoRoutes from "./routes/videoRoutes";
import cors from "cors";
import authMiddleware from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorMiddleware";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "unpuzzle-m1 microservice is healthy!" });
});

// Auth middleware
app.use(authMiddleware.auth);

// Add your microservice endpoints here
app.use("/api/video", authMiddleware.requiredAuth, videoRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`unpuzzle-m1 microservice running on port ${port}`);
});