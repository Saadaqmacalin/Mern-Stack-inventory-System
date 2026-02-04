import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisplaySuppliers from '../Components/Suppliers/DisplaySuppliers';
import AddSupplier from '../Components/Suppliers/AddSupplier';

const Suppliers = () => {
  return (
    <Routes>
      <Route index element={<DisplaySuppliers />} />
      <Route path="add" element={<AddSupplier />} />
    </Routes>
  );
};

export default Suppliers;
