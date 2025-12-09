// src/Components/User/GetUsers.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./userContext.jsx";

const API_URL = "http://localhost:5000/api/users";

const GetUsers = () => {
  const { users, loading, error, refreshUsers } = useUserContext();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleEdit = (user) => {
    navigate("/userRegistration", { state: { user } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      await refreshUsers();
      alert("User deleted");
    } catch (err) {
      alert("Failed to delete the user: " + err.message);
    }
  };

  const filteredData = (users || []).filter((u) =>
    [u.name, u.email, u.Status].some((field) =>
      String(field || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 mb-6 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 "
      />
      <span className="ml-30 h-35 w-35 py-2 px-2 text-white bg-indigo-500 text-2xl font-semibold rounded-2xl">
        Total Users:{users.length}
      </span>
      <button
        onClick={() => navigate("/userRegistration")}
        className="px-6 py-2 ml-15  rounded-2xl font-semibold text-white bg-indigo-500 hover:bg-indigo-700 shadow-md transition"
      >
        Add User
      </button>

      {loading && <p className="mt-4">Loading users...</p>}
      {error && <p className="mt-4 text-red-600">Error loading users.</p>}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              {["#", "Name", "Email", "Status", "Actions"].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {filteredData.length ? (
              filteredData.map((u, index) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm">{index + 1}</td>
                  <td className="px-6 py-3 text-sm">{u.name}</td>
                  <td className="px-6 py-3 text-sm">{u.email}</td>
                  <td className="px-6 py-3 text-sm font-medium text-indigo-600">
                    {u.Status}
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetUsers;
