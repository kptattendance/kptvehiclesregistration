// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import {
  clerkMiddleware,
  requireAuth,
  getAuth,
  clerkClient,
} from "@clerk/express";
// import vehicleRoutes from "./routes/vehicleRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

app.use(clerkMiddleware());
// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Root route check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
// app.use("/api/vehicles", vehicleRoutes);
// app.use("/api/scan", scanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/vehicles", vehicleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
