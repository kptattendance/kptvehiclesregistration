// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true, // one Clerk ID = one user
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // adjust roles as needed
      default: "user",
    },
    image: {
      type: String, // Cloudinary secure_url or any image URL
    },
    imagePublicId: {
      type: String, // for Cloudinary public_id (optional)
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
