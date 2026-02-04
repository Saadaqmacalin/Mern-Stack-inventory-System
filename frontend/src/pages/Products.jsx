import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisplayProducts from '../Components/Products/DisplayProducts';
import AddProducts from '../Components/Products/AddProducts';

const Products = () => {
  return (
    <Routes>
      <Route index element={<DisplayProducts />} />
      <Route path="add" element={<AddProducts />} />
    </Routes>
  );
};

export default Products;
