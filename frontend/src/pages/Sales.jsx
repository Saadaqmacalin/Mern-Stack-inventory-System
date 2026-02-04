import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisplaySales from '../Components/Sales/DisplaySales';
import AddSale from '../Components/Sales/AddSale';

const Sales = () => {
  return (
    <Routes>
      <Route index element={<DisplaySales />} />
      <Route path="add" element={<AddSale />} />
    </Routes>
  );
};

export default Sales;
