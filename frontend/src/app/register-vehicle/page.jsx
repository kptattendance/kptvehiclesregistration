"use client";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import LoadOverlay from "../../components/LoadOverlay";
import RoleGuard from "../../components/RoleGuard";

export default function RegisterVehicle({ onSuccess }) {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    ownerName: "",
    rollNo: "",
    sem: "",
    department: "",
    phone: "",
    email: "",
    vehicleNumber: "",
    vehicleName: "",
    vehicleType: "2-wheeler",
    ownershipType: "Own",
    ownerContactName: "",
    make: "",
    model: "",
    color: "",
    drivingLicenseNumber: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (file) data.append("ownerImage", file);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Vehicle registered successfully!");
      setFormData({
        ownerName: "",
        rollNo: "",
        sem: "",
        department: "",
        phone: "",
        email: "",
        vehicleNumber: "",
        vehicleName: "",
        vehicleType: "2-wheeler",
        ownershipType: "Own",
        ownerContactName: "",
        make: "",
        model: "",
        color: "",
        drivingLicenseNumber: "",
      });
      setFile(null);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to register vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RoleGuard allowedRoles={["admin"]}>
        <LoadOverlay loading={loading} message="Registering vehicle..." />

        <form
          onSubmit={handleSubmit}
          className="p-4 mt-6 bg-white shadow rounded-lg space-y-3"
        >
          <h2 className="text-xl font-bold">Register Vehicle</h2>

          {/* Student / Owner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={formData.ownerName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              name="rollNo"
              placeholder="Roll No"
              value={formData.rollNo}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
            </select>

            {/* Department Dropdown */}
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Department</option>
              <option value="at">Automobile Engineering</option>
              <option value="ch">Chemical Engineering</option>
              <option value="civil">Civil Engineering</option>
              <option value="cs">Computer Science Engineering</option>
              <option value="ec">
                Electronics & Communication Engineering
              </option>
              <option value="eee">Electrical & Electronics Engineering</option>
              <option value="me">Mechanical Engineering</option>
              <option value="po">Polymer Engineering</option>
            </select>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="vehicleNumber"
              placeholder="Vehicle Number"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              name="vehicleName"
              placeholder="Vehicle Name"
              value={formData.vehicleName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="2-wheeler">2-Wheeler</option>
              <option value="4-wheeler">4-Wheeler</option>
            </select>
            <select
              name="ownershipType"
              value={formData.ownershipType}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >
              <option value="Own">Own</option>
              <option value="Relative">Relative</option>
              <option value="Friend">Friend</option>
            </select>
            <input
              type="text"
              name="ownerContactName"
              placeholder="Owner Contact Name (if not own)"
              value={formData.ownerContactName}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              name="make"
              placeholder="Make (e.g., Honda)"
              value={formData.make}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              name="model"
              placeholder="Model (e.g., Activa 5G)"
              value={formData.model}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              name="color"
              placeholder="Color"
              value={formData.color}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              name="drivingLicenseNumber"
              placeholder="Driving License Number"
              value={formData.drivingLicenseNumber}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Profile Image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 w-full rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </RoleGuard>
    </>
  );
}
