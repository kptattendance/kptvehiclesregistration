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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <p className="text-xl font-semibold text-gray-700">
          Please sign in to access this page.
        </p>
      </div>
    );
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

      setMessage("✅ User created successfully!");
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
      setMessage(err.response?.data?.error || "❌ Error creating user");
    }

    setLoading(false);
  };

  return (
    <RoleGuard allowedRoles={["admin"]}>
      {/* Overlay */}
      <LoadOverlay loading={loading} message="Creating user..." />

      <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl transition hover:shadow-2xl">
          <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Add New User
          </h1>

          {message && (
            <p
              className={`mb-4 text-center text-sm font-medium ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-gray-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>

        {/* Refresh list on key change */}
        <div className="max-w-4xl mx-auto mt-10">
          <MembersList key={refreshKey} />
        </div>
      </div>
    </RoleGuard>
  );
}
