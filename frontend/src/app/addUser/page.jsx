"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import MembersList from "../../components/MembersList";
import axios from "axios";
import LoadOverlay from "../../components/LoadOverlay"; // <--- import overlay
import RoleGuard from "../../components/RoleGuard";

export default function AddUser() {
  const { getToken, isSignedIn } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // <--- to refresh list

  if (!isSignedIn) {
    return <p>Please sign in to access this page.</p>;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = await getToken();

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("role", formData.role);
      if (formData.image) data.append("ownerImage", formData.image);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("User created successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "user",
        image: null,
      });

      // refresh the list
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error creating user");
    }

    setLoading(false);
  };

  return (
    <>
      <RoleGuard allowedRoles={["admin"]}>
        {/* Overlay */}
        <LoadOverlay loading={loading} message="Creating user..." />

        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Add New User</h1>

          {message && (
            <p
              className={`mb-4 ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>

        {/* Refresh list on key change */}
        <MembersList key={refreshKey} />
      </RoleGuard>
    </>
  );
}
