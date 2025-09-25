// routes/userRoutes.js
import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { uploadSingleImage } from "../middleware/uploadImage.js";

const router = express.Router();

// CRUD routes
router.post("/", authenticateUser, uploadSingleImage, createUser);
router.get("/", authenticateUser, getUsers);
router.get("/:id", authenticateUser, getUserById);
router.put("/:id", authenticateUser, updateUser);
router.delete("/:id", authenticateUser, deleteUser);

export default router;
