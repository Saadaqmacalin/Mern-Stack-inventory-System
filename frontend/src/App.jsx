import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './Components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Sales from './pages/Sales';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Predictions from './pages/Predictions';
import Reports from './pages/Reports';
import Purchases from './pages/Purchases';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { ProtectedRoute, PublicRoute } from './Components/auth/ProtectedRoute';

// Customer Portal Imports
import { CustomerPortalProvider } from './contexts/CustomerPortalContext';
import StorefrontLayout from './Components/layout/StorefrontLayout';
import ShopHome from './pages/shop/ShopHome';
import CustomerAuth from './pages/shop/CustomerAuth';
import Cart from './pages/shop/Cart';
import MyOrders from './pages/shop/MyOrders';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products/*" element={<Products />} />
            <Route path="customers/*" element={<Customers />} />
            <Route path="suppliers/*" element={<Suppliers />} />
            <Route path="sales/*" element={<Sales />} />
            <Route path="orders/*" element={<Orders />} />
            <Route path="purchases/*" element={<Purchases />} />
            <Route path="categories/*" element={<Categories />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Customer Portal Routes */}
          <Route
            path="/shop"
            element={
              <CustomerPortalProvider>
                <StorefrontLayout />
              </CustomerPortalProvider>
            }
          >
            <Route index element={<ShopHome />} />
            <Route path="auth" element={<CustomerAuth />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
