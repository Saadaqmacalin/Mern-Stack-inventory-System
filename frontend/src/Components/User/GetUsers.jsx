import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/users";

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      const data = res.data.users || res.data;
      if (!Array.isArray(data)) return;
      setUsers(data);
    } catch (error) {
      alert("Error fetching users: " + error.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredData = users.filter((u) =>
    [u.name, u.email, u.Status].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );
 
  const handleEdit = (user) => {
    navigate("/userRegistration", { state: { user } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("User deleted");
      await getUsers();
    } catch (error) {
      alert("Failed to delete the user", error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        User Management
      </h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 mb-6 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              {["Name", "Email", "Status", "Actions"].map((head) => (
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
              filteredData.map((u) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm">{u.name}</td>
                  <td className="px-6 py-3 text-sm">{u.email}</td>
                  <td className="px-6 py-3 text-sm font-medium text-indigo-600">
                    {u.Status}
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => {
                        handleEdit(u);
                        // navigate("/userRegistration");
                      }}
                      className="bg-gradient from-blue-400 to-blue-600 text-red-400 px-3 py-1 rounded-lg text-sm font-medium shadow-md hover:from-blue-500 hover:to-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-gradient from-red-400 to-red-600 text-red-400 px-3 py-1 rounded-lg text-sm font-medium shadow-md hover:from-red-500 hover:to-red-700 transition"
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
