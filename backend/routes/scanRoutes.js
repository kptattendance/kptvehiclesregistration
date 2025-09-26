import express from "express";
import { scanPlate } from "../controllers/scanController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { uploadSingleImage } from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/", authenticateUser, uploadSingleImage, scanPlate);

export default router;
