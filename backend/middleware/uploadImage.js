import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// use memory storage (no temp files)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// helper to stream upload
const uploadToCloudinary = (folder) => (req, res, next) => {
  if (!req.file) return next();

  const stream = cloudinary.uploader.upload_stream(
    { folder },
    (err, result) => {
      if (err) return next(err);
      req.cloudinaryResult = result; // secure_url, public_id etc
      next();
    }
  );

  const bufferStream = new Readable();
  bufferStream.push(req.file.buffer);
  bufferStream.push(null);
  bufferStream.pipe(stream);
};

export const uploadSingleImage = [
  upload.single("ownerImage"),
  uploadToCloudinary("vehicles"), // all vehicle images go here
];
