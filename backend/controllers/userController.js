import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { clerkClient } from "@clerk/express";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, role, phone } = req.body;
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName: name.split(" ")[0],
      lastName: name.split(" ").slice(1).join(" ") || "",
      publicMetadata: { role, phone },
    });
    // Handle Cloudinary upload result
    let image = null;
    let imagePublicId = null;

    if (req.cloudinaryResult) {
      image = req.cloudinaryResult.secure_url;
      imagePublicId = req.cloudinaryResult.public_id;
    }

    const user = new User({
      clerkUserId: clerkUser.id || null,
      name,
      email,
      role,
      phone,
      image,
      imagePublicId,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("❌ Create User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user (with Cloudinary image handling)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If a new image is uploaded → remove old one from Cloudinary
    if (req.cloudinaryResult) {
      if (user.imagePublicId) {
        await cloudinary.uploader.destroy(user.imagePublicId);
      }

      user.image = req.cloudinaryResult.secure_url;
      user.imagePublicId = req.cloudinaryResult.public_id;
    }

    // Update other fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.phone = req.body.phone || user.phone;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("❌ Update User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user (also remove Cloudinary image)
// Delete a user (also remove from Clerk + Cloudinary)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1️⃣ Remove Cloudinary image if exists
    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId);
    }

    // 2️⃣ Remove Clerk account if exists
    if (user.clerkUserId) {
      try {
        await clerkClient.users.deleteUser(user.clerkUserId);
      } catch (err) {
        console.warn("⚠️ Clerk delete failed:", err.errors || err.message);
      }
    }

    // 3️⃣ Remove from MongoDB
    await user.deleteOne();

    res.json({ message: "User removed successfully from DB + Clerk" });
  } catch (err) {
    console.error("❌ Delete User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Sync a user from Clerk (simulate)
export const syncUser = async (clerkEntry) => {
  try {
    const existing = await User.findOne({
      clerkUserId: clerkEntry.clerkUserId,
    });
    if (existing) return existing;

    const newUser = new User({
      clerkUserId: clerkEntry.clerkUserId,
      name: clerkEntry.name,
      email: clerkEntry.email,
      role: clerkEntry.role || "user",
      phone: clerkEntry.phone,
    });

    await newUser.save();
    return newUser;
  } catch (err) {
    console.error("Sync error:", err);
    return null;
  }
};
