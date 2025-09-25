import Vehicle from "../models/Vehicle.js";
import cloudinary from "cloudinary";

// CREATE vehicle
export const createVehicle = async (req, res) => {
  try {
    const {
      ownerName,
      rollNo,
      sem,
      department,
      phone,
      email,
      vehicleNumber,
      vehicleName,
      vehicleType,
      ownershipType,
      ownerContactName,
      make,
      model,
      color,
      drivingLicenseNumber,
    } = req.body;

    let ownerImage = null;
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "vehicles",
      });
      ownerImage = result.secure_url;
    }

    const vehicle = new Vehicle({
      ownerName,
      rollNo,
      sem,
      department,
      phone,
      email,
      vehicleNumber,
      vehicleName,
      vehicleType,
      ownershipType,
      ownerContactName,
      make,
      model,
      color,
      drivingLicenseNumber,
      ownerImage,
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ all vehicles
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

// UPDATE vehicle
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // If new image uploaded
    if (req.file) {
      // Delete old image from cloudinary if exists
      if (vehicle.ownerImage) {
        const publicId = vehicle.ownerImage.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(`vehicles/${publicId}`);
      }

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "vehicles",
      });
      vehicle.ownerImage = result.secure_url;
    }

    // Update other fields
    Object.keys(req.body).forEach((key) => {
      vehicle[key] = req.body[key];
    });

    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Delete image from cloudinary if exists
    if (vehicle.ownerImage) {
      const publicId = vehicle.ownerImage.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader.destroy(`vehicles/${publicId}`);
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
