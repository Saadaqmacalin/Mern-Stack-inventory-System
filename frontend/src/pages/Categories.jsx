import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisplayCategories from '../Components/Categories/DisplayCategories';
import AddCategory from '../Components/Categories/AddCategory';

const Categories = () => {
  return (
    <Routes>
      <Route index element={<DisplayCategories />} />
      <Route path="add" element={<AddCategory />} />
    </Routes>
  );
};

export default Categories;
