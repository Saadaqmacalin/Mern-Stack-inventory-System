import React, { useState } from "react";
import { useCategoryContext } from "../Categories/Categories.jsx";
import { useNavigate } from "react-router";
import axios from "axios";

const API_URL = "http://localhost:5000/api/categories";

const DisplayCategories = () => {
  const { categories, setCategories, loading, error, rerefresh } =
    useCategoryContext();

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleEdit = (category) => {
    navigate("/AddCategory", { state: { category } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      await rerefresh();
      alert("Category deleted successfully");
    } catch (error) {
      alert("Failed to delete the category: " + error.message);
    }
  };

  const filteredData = (categories || []).filter((c) =>
    [c.name, c.description].some((field) =>
      String(field || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight">
        Category Manager
      </h1>

      {/* Search + Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <span className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-lg font-semibold shadow-md">
          Total: {categories.length}
        </span>

        <button
          onClick={() => navigate("/addCategory")}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-lg font-semibold shadow-md hover:bg-indigo-500 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-indigo-600 text-lg font-medium mt-4">
          Loading Categories...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-600 font-semibold">
          Error Loading Categories...
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white shadow-xl rounded-2xl overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              {["#", "Name", "Description", "Edit", "Delete"].map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-700 divide-y">
            {filteredData.length ? (
              filteredData.map((c, index) => (
                <tr
                  key={c._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4">{c.description}</td>

                  {/* Edit Button */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold shadow hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                  </td>

                  {/* Delete Button */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold shadow hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No Categories Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayCategories;
