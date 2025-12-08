import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
const API_URL = "http://localhost:5000/api/categories";

const AddCategory = () => {
  const [category] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault()
    e.preventDefault();
    try {
      setLoading(true);
      const exists = await axios.get(`${API_URL}?name=${formData.name}`);
      if (Array.isArray(exists.data) && exists.data.length > 0) {
        alert("⚠️ Category already exists!.");
        setLoading(false);
        return;
      }
      await axios.post(API_URL, formData);
      alert("Category registred succuessfully");
      setLoading(false);
    } catch (error) {
      console.error("Error", error);
      if (error.response) {
        alert(
          "❌ Error: " +
            (error.response?.data?.message || "Something went wrong")
        );
      } else {
        alert("❌", error.message);
      }
      setLoading(false);
    }
  };
  return (
    <div className="bg-white w-full max-w-md mx-auto p-6 rounded-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black text-blue-600">
          {category ? "Edit Category" : "Add Category"}
        </h2>
        <button
          className="flex gap-1 text-red-600 w-25 h-15  px-2 py-4 items-center 
        font-semibold rounded-3xl bg-gray-100"
        >
          <FaTimes className="text-red-600" /> <span>Close</span>
        </button>
      </div>
      <hr className="border-red-800 mb-4" />
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className="font-semibold text-gray-700">
          Name:
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your Name"
          required
          className="w-full font-normal px-4 py-2 border border-gray-700 rounded-2xl "
        />
        <label htmlFor="description" className="font-semibold text-gray-700">
          Describtion
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripte the type of the category"
          className="w-full font-normal px-4 py-2 border border-gray-700 rounded-2xl "
        />
        <button
          type="submit"
          disabled={loading}
          className={`text-center text-white text-xl py-2 mt-6 w-full rounded-2xl bg-blue-500 
            ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-indigo-600"}`}
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
