import express from "express";
import multer from "multer";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage before Cloudinary

router.post("/", upload.single("ownerImage"), createVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.put("/:id", upload.single("ownerImage"), updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
