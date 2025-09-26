import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    // Student / Owner Details
    ownerName: { type: String, required: true },
    ownerImage: { type: String }, // secure_url
    ownerImageId: { type: String }, // NEW - cloudinary public_id

    rollNo: { type: String },
    sem: { type: String },
    department: { type: String },
    phone: { type: String, required: true },
    email: { type: String },

    // Vehicle Details
    vehicleNumber: { type: String, required: true, unique: true, index: true },
    vehicleName: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: ["2-wheeler", "4-wheeler"],
      required: true,
    },
    ownershipType: {
      type: String,
      enum: ["Own", "Relative", "Friend"],
      default: "Own",
    },
    ownerContactName: { type: String },
    make: { type: String },
    model: { type: String },
    color: { type: String },
    drivingLicenseNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", VehicleSchema);
