import express from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  bulkUploadVehicles,
  searchVehicleByPlate,
} from "../controllers/vehicleController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { uploadSingleImage } from "../middleware/uploadImage.js";

const router = express.Router();
// router.get("/search", searchVehicleByPlate);

router.post("/", authenticateUser, uploadSingleImage, createVehicle);
router.get("/", authenticateUser, getVehicles);
router.get("/:id", authenticateUser, getVehicleById);
router.put("/:id", authenticateUser, uploadSingleImage, updateVehicle);
router.delete("/:id", authenticateUser, deleteVehicle);
router.post("/bulk", authenticateUser, bulkUploadVehicles);

export default router;
