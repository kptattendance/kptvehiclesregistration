"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import LoadOverlay from "../../components/LoadOverlay"; // import your overlay component
import RoleGuard from "../../components/RoleGuard";

export default function VehicleList({ refreshKey }) {
  const { getToken } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [file, setFile] = useState(null);

  // loading overlay
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Fetching vehicles...");
      const token = await getToken();
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVehicles(res.data);
    } catch (err) {
      toast.error("Failed to fetch vehicles");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [refreshKey]);

  // Start editing
  const handleEdit = (vehicle) => {
    setEditingId(vehicle._id);
    setEditForm(vehicle);
    setFile(null);
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setFile(null);
  };

  // Save edit
  const handleSave = async (id) => {
    try {
      setLoading(true);
      setLoadingMessage("Saving vehicle...");
      const token = await getToken();

      const data = new FormData();
      Object.keys(editForm).forEach((key) => {
        if (key !== "_id" && key !== "createdAt" && key !== "updatedAt")
          data.append(key, editForm[key] || "");
      });
      if (file) data.append("ownerImage", file);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Vehicle updated successfully!");
      setEditingId(null);
      setFile(null);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      setLoading(true);
      setLoadingMessage("Deleting vehicle...");
      const token = await getToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Vehicle deleted successfully!");
      fetchVehicles();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  // Input renderer
  const renderInput = (field, value, type = "text", rowId) => {
    if (editingId === rowId) {
      if (type === "select") {
        return (
          <select
            value={editForm[field] || ""}
            onChange={(e) =>
              setEditForm({ ...editForm, [field]: e.target.value })
            }
            className="border p-1 w-full"
          >
            {field === "year" && (
              <>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </>
            )}
            {field === "department" && (
              <>
                <option value="at">Automobile Engineering</option>
                <option value="ch">Chemical Engineering</option>
                <option value="civil">Civil Engineering</option>
                <option value="cs">Computer Science Engineering</option>
                <option value="ec">
                  Electronics & Communication Engineering
                </option>
                <option value="eee">
                  Electrical & Electronics Engineering
                </option>
                <option value="me">Mechanical Engineering</option>
                <option value="po">Polymer Engineering</option>
              </>
            )}
            {field === "vehicleType" && (
              <>
                <option value="2-wheeler">2-Wheeler</option>
                <option value="4-wheeler">4-Wheeler</option>
              </>
            )}
            {field === "ownershipType" && (
              <>
                <option value="Own">Own</option>
                <option value="Relative">Relative</option>
                <option value="Friend">Friend</option>
              </>
            )}
          </select>
        );
      }
      return (
        <input
          type={type}
          value={editForm[field] || ""}
          onChange={(e) =>
            setEditForm({ ...editForm, [field]: e.target.value })
          }
          className="border p-1 w-full"
        />
      );
    }
    return value || "—";
  };

  return (
    <>
      <RoleGuard allowedRoles={["admin"]}>
        <div className="mt-0 p-4 min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 ">
          <LoadOverlay loading={loading} message={loadingMessage} />

          <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-6">
            Registered Vehicles
          </h1>

          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700">
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Owner</th>
                  <th className="border p-2">Roll No</th>
                  <th className="border p-2">Year</th>
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Vehicle Name</th>
                  <th className="border p-2">Vehicle No</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Ownership</th>
                  <th className="border p-2">Contact Name</th>
                  <th className="border p-2">Make</th>
                  <th className="border p-2">Model</th>
                  <th className="border p-2">Color</th>
                  <th className="border p-2">DL Number</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v, idx) => (
                  <tr
                    key={v._id}
                    className={`text-center border ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition`}
                  >
                    {/* Owner Image */}
                    <td className="border p-2">
                      {editingId === v._id ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={
                              file
                                ? URL.createObjectURL(file)
                                : v.ownerImage ||
                                  "https://via.placeholder.com/50"
                            }
                            alt="owner"
                            className="w-12 h-12 object-cover rounded-full mb-1"
                          />
                          <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="text-xs"
                          />
                        </div>
                      ) : v.ownerImage ? (
                        <img
                          src={v.ownerImage}
                          alt="owner"
                          className="w-12 h-12 object-cover rounded-full mx-auto"
                        />
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Editable Fields */}
                    <td className="border p-2">
                      {renderInput("ownerName", v.ownerName, "text", v._id)}
                    </td>
                    <td className="border p-2">
                      {renderInput("rollNo", v.rollNo)}
                    </td>
                    <td className="border p-2">
                      {renderInput("year", v.year, "select", v._id)}
                    </td>
                    <td className="border p-2">
                      {renderInput("department", v.department, "select", v._id)}
                    </td>
                    <td className="border p-2">
                      {renderInput("phone", v.phone, "text", v._id)}
                    </td>
                    <td className="border p-2">
                      {renderInput("email", v.email, "email", v._id)}
                    </td>
                    <td className="border p-2">
                      {renderInput("vehicleName", v.vehicleName, "text", v._id)}
                    </td>
                    <td className="border p-2">{v.vehicleNumber}</td>
                    <td className="border p-2">
                      {renderInput(
                        "vehicleType",
                        v.vehicleType,
                        "select",
                        v._id
                      )}
                    </td>
                    <td className="border p-2">
                      {renderInput(
                        "ownershipType",
                        v.ownershipType,
                        "select",
                        v._id
                      )}
                    </td>
                    <td className="border p-2">
                      {renderInput("ownerContactName", v.ownerContactName)}
                    </td>
                    <td className="border p-2">
                      {renderInput("make", v.make, "text", v._id)}
                    </td>
                    <td className="border p-2">
                      {renderInput("model", v.model, "text", v._id)}
                    </td>
                    <td className="border p-2">
                      {renderInput("color", v.color, "text", v._id)}
                    </td>
                    <td className="border p-2">
                      {renderInput(
                        "drivingLicenseNumber",
                        v.drivingLicenseNumber,
                        "text",
                        v._id
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-2 flex gap-2 justify-center">
                      {editingId === v._id ? (
                        <>
                          <button
                            onClick={() => handleSave(v._id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <X />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(v)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil />
                          </button>
                          <button
                            onClick={() => handleDelete(v._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 && (
                  <tr>
                    <td colSpan="17" className="p-3 text-gray-500">
                      No vehicles registered
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </RoleGuard>
    </>
  );
}
