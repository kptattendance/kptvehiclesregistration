import express from "express";
import {
  scanPlate,
  searchVehicleByPlate,
} from "../controllers/scanController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { uploadSingleImage } from "../middleware/uploadImage.js";

const router = express.Router();
router.get("/findByPlate", searchVehicleByPlate);

router.post("/", authenticateUser, uploadSingleImage, scanPlate);

export default router;
