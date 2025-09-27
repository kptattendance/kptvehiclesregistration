"use client";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import LoadOverlay from "../../components/LoadOverlay";
import RoleGuard from "../../components/RoleGuard";
import * as XLSX from "xlsx";

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

  // Bulk upload state
  const [bulkFile, setBulkFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("Registering vehicle...");

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
      setLoadingMessage("");
    }
  };

  // Bulk Upload Handler
  const handleBulkUpload = async () => {
    if (!bulkFile) {
      toast.error("Please select an Excel file first");
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage("Uploading bulk vehicles...");
      const token = await getToken();

      const data = await bulkFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet); // Array of objects

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/bulk`,
        { vehicles: rows },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Bulk upload successful! (${rows.length} vehicles)`);
      setBulkFile(null);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.error || "Bulk upload failed");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <LoadOverlay loading={loading} message={loadingMessage} />

      {/* Single Entry Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 mt-0 bg-white shadow rounded-lg space-y-6 min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 "
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Register Vehicle
        </h1>

        {/* Student / Owner Details */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            Student / Owner Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={formData.ownerName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="rollNo"
              placeholder="Roll No"
              value={formData.rollNo}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <select
              name="sem"
              value={formData.sem}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
            </select>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border p-2 rounded w-full"
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
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Vehicle Details */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Vehicle Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="vehicleNumber"
              placeholder="Vehicle Number"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="vehicleName"
              placeholder="Vehicle Name"
              value={formData.vehicleName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="2-wheeler">2-Wheeler</option>
              <option value="4-wheeler">4-Wheeler</option>
            </select>
            <select
              name="ownershipType"
              value={formData.ownershipType}
              onChange={handleChange}
              className="border p-2 rounded w-full"
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
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="make"
              placeholder="Make (e.g., Honda)"
              value={formData.make}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="model"
              placeholder="Model (e.g., Activa 5G)"
              value={formData.model}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="color"
              placeholder="Color"
              value={formData.color}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="drivingLicenseNumber"
              placeholder="Driving License Number"
              value={formData.drivingLicenseNumber}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Profile Image */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            Upload Owner Photo
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>

      {/* Bulk Upload Section */}
      <div className="p-6 mt-6 bg-white shadow rounded-lg space-y-4 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bulk Upload Vehicles (Excel)
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Upload an Excel file with columns: ownerName, rollNo, sem, department,
          phone, email, vehicleNumber, vehicleName, vehicleType, ownershipType,
          ownerContactName, make, model, color, drivingLicenseNumber
        </p>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setBulkFile(e.target.files[0])}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleBulkUpload}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
        >
          {loading ? "Uploading..." : "Upload Excel"}
        </button>
      </div>
    </RoleGuard>
  );
}
