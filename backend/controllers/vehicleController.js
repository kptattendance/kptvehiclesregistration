import Vehicle from "../models/Vehicle.js";
import cloudinary from "cloudinary";

// Bulk upload vehicles
export const bulkUploadVehicles = async (req, res) => {
  try {
    const { vehicles } = req.body; // expects array of objects

    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
      return res.status(400).json({ error: "No vehicles provided" });
    }

    // Optional: Validate required fields
    const requiredFields = [
      "ownerName",
      "rollNo",
      "sem",
      "department",
      "phone",
      "vehicleNumber",
      "vehicleName",
      "vehicleType",
    ];

    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      for (const field of requiredFields) {
        if (!v[field]) {
          return res.status(400).json({
            error: `Row ${i + 1}: Missing required field '${field}'`,
          });
        }
      }
    }

    // Insert many vehicles at once
    const insertedVehicles = await Vehicle.insertMany(vehicles, {
      ordered: false, // continue on errors
    });

    return res.status(201).json({
      message: `Bulk upload successful`,
      count: insertedVehicles.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Bulk upload failed" });
  }
};

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

// ✅ Search vehicle by plate number (manual input)
export const searchVehicleByPlate = async (req, res) => {
  try {
    const { plate } = req.query;

    if (!plate) {
      return res.status(400).json({ error: "Plate number is required" });
    }

    const cleanPlate = plate.replace(/\s+/g, ""); // remove spaces
    const vehicle = await Vehicle.findOne({
      vehicleNumber: { $regex: cleanPlate, $options: "i" },
    });

    if (!vehicle) {
      return res.status(404).json({ message: "No matching vehicle found" });
    }

    return res.status(200).json({ vehicle });
  } catch (err) {
    console.error("Manual search error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Error searching for vehicle" });
  }
};
