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
    if (!window.confirm("are you sure that you want to delete this category"))
      return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      await rerefresh();
      alert("Category deleted successfully");
    } catch (error) {
      alert("failed to delete the category" + error.message);
    }
  };
  const feilterCategories = (categories || []).filter((c) =>
    [c.name, c.description].some((feild) =>
      String(feild || "")
        .toLowerCase()
        .includes(search.toLowerCase)
    )
  );
  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 ">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Category Manager
      </h1>
      <input
        type="text"
        placeholder="Search Category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 mb-6 px-4 py-2 rounded-lg border border-gray-300 "
      />
      <span className=" h-20 w-20 font-semibold px-4 py-2 ml-15 text-white text-2xl rounded-3xl bg-indigo-500 hover:bg-indigo-400">
        Total Categories:{categories.length}
      </span>
      <button
        onClick={() => navigate("/addCategory")}
        className="h-12  text-white font-semibold ml-6 text-2xl px-2 py-2  rounded-2xl bg-indigo-500 hover:bg-indigo-400"
      >
        Add Category
      </button>
      {loading && <p className="mt-4">Loading Categories...</p>}
      {error && (
        <p className="mt-4 text-red-800">Error Loading Categories...</p>
      )}
    </div>
  );
};

export default DisplayCategories;
