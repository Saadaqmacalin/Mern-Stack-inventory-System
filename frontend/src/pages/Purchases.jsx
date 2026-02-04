import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisplayPurchases from '../Components/Purchases/DisplayPurchases';
import AddPurchase from '../Components/Purchases/AddPurchase';

const Purchases = () => {
  return (
    <Routes>
      <Route index element={<DisplayPurchases />} />
      <Route path="add" element={<AddPurchase />} />
    </Routes>
  );
};

export default Purchases;
