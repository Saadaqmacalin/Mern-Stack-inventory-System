import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    Status: "USER",
  });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch users
  const getUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(
        Array.isArray(res.data?.users || res.data)
          ? res.data?.users || res.data
          : []
      );
    } catch {
      alert("Failed to fetch users.");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, Status } = form;

    if (!name || !email || !Status || (!editing && !password)) {
      return alert("Please fill all required fields.");
    }

    setLoading(true);
    try {
      const payload = { name, email, Status, ...(password && { password }) };
      if (editing?._id) await axios.patch(`${API_URL}/${editing._id}`, payload);
      else await axios.post(API_URL, payload);

      alert(editing ? "User updated!" : "User added!");
      setForm({ name: "", email: "", password: "", Status: "USER" });
      setEditing(null);
      setShowForm(false);
      getUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: u.password , Status: u.Status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("User deleted!");
      getUsers();
    } catch {
      alert("Failed to delete user.");
    }
  };

  const filtered = users.filter((u) =>
    [u.name, u.email, u.Status].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        User Management
      </h1>

      <div className="flex justify-between mb-5">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-1/2 focus:outline-blue-400"
        />
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setForm({ name: "", email: "", password: "", Status: "USER" });
          }}
          className={`px-5 py-2 rounded-lg text-white ${
            showForm ? "bg-gray-500" : "bg-blue-500"
          }`}
        >
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg w-full"
            required
          />
          <input
            type="password"
            name="password"
            placeholder={editing ? "Leave blank to keep password" : "Password"}
            value={form.password}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg w-full"
            required={!editing}
          />
          <select
            name="Status"
            value={form.Status}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg w-full"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 w-full py-2 rounded-lg text-white"
          >
            {loading ? "Saving..." : editing ? "Update User" : "Add User"}
          </button>
        </form>
      )}

      <table className="w-full border-collapse border rounded-lg">
        <thead>
          <tr className="bg-blue-100 text-left">
            {["Name", "Email", "Status", "Actions"].map((head) => (
              <th key={head} className="border px-4 py-2">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length ? (
            filtered.map((u) => (
              <tr key={u._id} className="text-center border-t">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.Status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
