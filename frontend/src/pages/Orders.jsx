import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisplayOrders from '../Components/Orders/DisplayOrders';
import AddOrder from '../Components/Orders/AddOrder';

const Orders = () => {
  return (
    <Routes>
      <Route index element={<DisplayOrders />} />
      <Route path="add" element={<AddOrder />} />
    </Routes>
  );
};

export default Orders;
