import Vehicle from "../models/Vehicle.js";
import cloudinary from "cloudinary";

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ single vehicle
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle({
      ...req.body,
      ownerImage: req.cloudinaryResult?.secure_url || null,
      ownerImageId: req.cloudinaryResult?.public_id || null,
    });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Not found" });

    // If new image uploaded
    if (req.cloudinaryResult?.secure_url) {
      // Delete old image from cloudinary if exists
      if (vehicle.ownerImageId) {
        await cloudinary.v2.uploader.destroy(vehicle.ownerImageId);
      }
      vehicle.ownerImage = req.cloudinaryResult.secure_url;
      vehicle.ownerImageId = req.cloudinaryResult.public_id;
    }

    // Update other fields
    Object.keys(req.body).forEach((key) => {
      if (key !== "ownerImage" && key !== "ownerImageId") {
        vehicle[key] = req.body[key];
      }
    });

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Delete image from cloudinary if exists
    if (vehicle.ownerImageId) {
      await cloudinary.v2.uploader.destroy(vehicle.ownerImageId);
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
