import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisplayCustomers from '../Components/Customers/DisplayCustomers';
import AddCustomer from '../Components/Customers/AddCustomer';

const Customers = () => {
  return (
    <Routes>
      <Route index element={<DisplayCustomers />} />
      <Route path="add" element={<AddCustomer />} />
    </Routes>
  );
};

export default Customers;
