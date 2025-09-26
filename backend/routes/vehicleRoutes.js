import express from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { uploadSingleImage } from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/", authenticateUser, uploadSingleImage, createVehicle);
router.get("/", authenticateUser, getVehicles);
router.get("/:id", authenticateUser, getVehicleById);
router.put("/:id", authenticateUser, uploadSingleImage, updateVehicle);
router.delete("/:id", authenticateUser, deleteVehicle);

export default router;
