import React, { useState } from "react";
import { useCategoryContext } from "../Categories/Categories.jsx";
import { useNavigate } from "react-router";
import axios from "axios";
const API_URL = "http://localhost:5000/api/categories";

const DisplayCategories = () => {
  const { categories, setCategories, loading, error, rerefresh } = useCategoryContext();

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
  return <div className="text-center font-bold text-3xl">Display Categories</div>;
};

export default DisplayCategories;
