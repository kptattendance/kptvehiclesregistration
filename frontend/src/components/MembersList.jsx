"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const MembersList = () => {
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch Clerk token on mount
  useEffect(() => {
    const fetchToken = async () => {
      if (!isSignedIn) return;
      const jwt = await getToken();
      setToken(jwt);
    };
    fetchToken();
  }, [getToken, isSignedIn]);

  // Fetch users
  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  if (!isSignedIn) return <p>Please sign in to view members.</p>;

  // Inline edit handlers
  const handleEdit = (user) => {
    setEditId(user._id);
    setEditForm({ ...user });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditForm({});
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
      setEditId(null);
      setEditForm({});
    } catch (err) {
      console.error("❌ Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  return (
    <div className="p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Members List</h2>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-md rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  <div className="flex justify-center items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span>Loading members...</span>
                  </div>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) =>
                editId === user._id ? (
                  <tr key={user._id} className="bg-yellow-50">
                    <td className="border p-2">
                      <img
                        src={user.image || "https://via.placeholder.com/50"}
                        alt={user.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="border p-2">
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleChange}
                        className="border p-1 rounded w-full"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => handleSave(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={user._id} className="hover:bg-gray-50 border">
                    <td className="border p-2 text-center">
                      <img
                        src={user.image || "https://via.placeholder.com/50"}
                        alt={user.name}
                        className="w-12 h-12 object-cover rounded-full mx-auto"
                      />
                    </td>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">{user.phone}</td>
                    <td className="border p-2">{user.role}</td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersList;
