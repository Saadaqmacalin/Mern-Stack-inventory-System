import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  // User state
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  // Data state
  products: [],
  customers: [],
  suppliers: [],
  categories: [],
  sales: [],
  purchases: [],
  orders: [],
  
  // UI state
  loading: false,
  error: null,
  sidebarOpen: true,
  theme: localStorage.getItem('theme') || 'light',
  
  // Filters and search
  searchQuery: '',
  activeFilters: {},
  
  // Notifications
  notifications: [],
  
  // Analytics data
  analytics: {
    salesData: [],
    inventoryData: {},
    customerData: [],
    financialData: {},
  },
};

// Action types
export const ACTIONS = {
  // Auth actions
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  
  // Data actions
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CUSTOMERS: 'SET_CUSTOMERS',
  SET_SUPPLIERS: 'SET_SUPPLIERS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_SALES: 'SET_SALES',
  SET_PURCHASES: 'SET_PURCHASES',
  SET_ORDERS: 'SET_ORDERS',
  
  // Orders Actions
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',

  // CRUD actions
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',

  // Customer Actions
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',

  // Category Actions
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',

  // Supplier Actions
  ADD_SUPPLIER: 'ADD_SUPPLIER',
  UPDATE_SUPPLIER: 'UPDATE_SUPPLIER',
  DELETE_SUPPLIER: 'DELETE_SUPPLIER',

  // Sales Actions
  ADD_SALE: 'ADD_SALE',
  UPDATE_SALE: 'UPDATE_SALE',
  DELETE_SALE: 'DELETE_SALE',

  // Purchase Actions
  ADD_PURCHASE: 'ADD_PURCHASE',
  UPDATE_PURCHASE: 'UPDATE_PURCHASE',
  DELETE_PURCHASE: 'DELETE_PURCHASE',
  
  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_THEME: 'SET_THEME',
  
  // Search and filter
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  
  // Notifications
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  
  // Analytics
  SET_ANALYTICS: 'SET_ANALYTICS',
  
  // Theme
  SET_THEME: 'SET_THEME',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    // Auth
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      };
    
    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    
    // Data
    case ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    
    case ACTIONS.SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
      };
    
    case ACTIONS.SET_SUPPLIERS:
      return {
        ...state,
        suppliers: action.payload,
      };
    
    case ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    
    case ACTIONS.SET_SALES:
      return {
        ...state,
        sales: action.payload,
      };
    
    case ACTIONS.SET_PURCHASES:
      return {
        ...state,
        purchases: action.payload,
      };
    
    case ACTIONS.SET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };
    
    // Order CRUD
    case ACTIONS.ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    case ACTIONS.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(order => order._id === action.payload.id ? action.payload.data : order),
      };
    case ACTIONS.DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter(order => order._id !== action.payload),
      };

    // CRUD
    case ACTIONS.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    
    case ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload.id ? action.payload.data : product
        ),
      };
    
    case ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload),
      };

    // Customer CRUD
    case ACTIONS.ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };

    case ACTIONS.UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer._id === action.payload.id ? action.payload.data : customer
        ),
      };

    case ACTIONS.DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer._id !== action.payload),
      };

    // Category CRUD
    case ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(category =>
          category._id === action.payload.id ? action.payload.data : category
        ),
      };

    case ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(category => category._id !== action.payload),
      };

    // Supplier CRUD
    case ACTIONS.ADD_SUPPLIER:
      return {
        ...state,
        suppliers: [...state.suppliers, action.payload],
      };

    case ACTIONS.UPDATE_SUPPLIER:
      return {
        ...state,
        suppliers: state.suppliers.map(supplier =>
          supplier._id === action.payload.id ? action.payload.data : supplier
        ),
      };

    case ACTIONS.DELETE_SUPPLIER:
      return {
        ...state,
        suppliers: state.suppliers.filter(supplier => supplier._id !== action.payload),
      };

    // Sales CRUD
    case ACTIONS.ADD_SALE:
      return {
        ...state,
        sales: [...state.sales, action.payload],
      };
    case ACTIONS.UPDATE_SALE:
      return {
        ...state,
        sales: state.sales.map(sale => sale._id === action.payload.id ? action.payload.data : sale),
      };
    case ACTIONS.DELETE_SALE:
      return {
        ...state,
        sales: state.sales.filter(sale => sale._id !== action.payload),
      };

    // Purchase CRUD
    case ACTIONS.ADD_PURCHASE:
      return {
        ...state,
        purchases: [...state.purchases, action.payload],
      };
    case ACTIONS.UPDATE_PURCHASE:
      return {
        ...state,
        purchases: state.purchases.map(purchase => purchase._id === action.payload.id ? action.payload.data : purchase),
      };
    case ACTIONS.DELETE_PURCHASE:
      return {
        ...state,
        purchases: state.purchases.filter(purchase => purchase._id !== action.payload),
      };
    
    // UI
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case ACTIONS.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    
    case ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    
    // Search and filters
    case ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };
    
    case ACTIONS.SET_FILTERS:
      return {
        ...state,
        activeFilters: { ...state.activeFilters, ...action.payload },
      };
    
    case ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        activeFilters: {},
      };
    
    // Notifications
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    // Analytics
    case ACTIONS.SET_ANALYTICS:
      return {
        ...state,
        analytics: { ...state.analytics, ...action.payload },
      };
    
    // Theme
    case ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';
  
  // Action creators
  const actions = {
    // Auth actions
    login: async (credentials) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { user, token } });
        dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: {
          id: Date.now(),
          type: 'success',
          message: 'Login successful!',
        }});
        
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Login failed' });
        return { success: false, error: error.response?.data?.message || 'Login failed' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: ACTIONS.LOGOUT });
    },
    
    // Data fetching actions
    fetchProducts: async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.get(`${API_BASE_URL}/products`);
        // Backend returns: { products: [...] }
        dispatch({ type: ACTIONS.SET_PRODUCTS, payload: response.data.products || [] });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch products' });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    
    fetchCustomers: async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.get(`${API_BASE_URL}/customers`);
        // Backend returns: { count: X, customers: [...] }
        dispatch({ type: ACTIONS.SET_CUSTOMERS, payload: response.data.customers || [] });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch customers' });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    
    fetchSuppliers: async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.get(`${API_BASE_URL}/suppliers`);
        // Backend returns: { TotalSuppliers: X, suppliers: [...] }
        dispatch({ type: ACTIONS.SET_SUPPLIERS, payload: response.data.suppliers || [] });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch suppliers' });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    
    fetchCategories: async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.get(`${API_BASE_URL}/categories`);
        // Backend returns: { totalCategories: X, categories: [...] }
        dispatch({ type: ACTIONS.SET_CATEGORIES, payload: response.data.categories || [] });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch categories' });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    
    fetchSales: async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.get(`${API_BASE_URL}/sales`);
        // Backend returns: { count: X, sales: [...] }
        dispatch({ type: ACTIONS.SET_SALES, payload: response.data.sales || [] });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch sales' });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    
    fetchPurchases: async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.get(`${API_BASE_URL}/purchases`);
        // Backend returns: { count: X, purchases: [...] }
        dispatch({ type: ACTIONS.SET_PURCHASES, payload: response.data.purchases || [] });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch purchases' });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    
    fetchOrders: async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.get(`${API_BASE_URL}/orders`);
        // Backend returns: { orders: [...], ... }
        dispatch({ type: ACTIONS.SET_ORDERS, payload: response.data.orders || [] });
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch orders' });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    
    // CRUD operations
    addProduct: async (productData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.post(`${API_BASE_URL}/products`, productData);
        // Backend returns: { message: ..., product: ... }
        dispatch({ type: ACTIONS.ADD_PRODUCT, payload: response.data.product });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to add product' });
        return { success: false, error: error.response?.data?.message || 'Failed to add product' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    
    updateProduct: async (id, productData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.patch(`${API_BASE_URL}/products/${id}`, productData);
        // Backend returns: { message: ..., product: ... }
        dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: { id, data: response.data.product } });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to update product' });
        return { success: false, error: error.response?.data?.message || 'Failed to update product' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    

    deleteProduct: async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        await axios.delete(`${API_BASE_URL}/products/${id}`);
        dispatch({ type: ACTIONS.DELETE_PRODUCT, payload: id });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to delete product' });
        return { success: false, error: error.response?.data?.message || 'Failed to delete product' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Customer CRUD
    addCustomer: async (customerData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.post(`${API_BASE_URL}/customers`, customerData);
        // Backend returns: { message: ..., customer: ... }
        dispatch({ type: ACTIONS.ADD_CUSTOMER, payload: response.data.customer });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to add customer' });
        return { success: false, error: error.response?.data?.message || 'Failed to add customer' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    updateCustomer: async (id, customerData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.patch(`${API_BASE_URL}/customers/${id}`, customerData);
        // Backend returns: { message: ..., customer: ... }
        dispatch({ type: ACTIONS.UPDATE_CUSTOMER, payload: { id, data: response.data.customer } });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to update customer' });
        return { success: false, error: error.response?.data?.message || 'Failed to update customer' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    deleteCustomer: async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        await axios.delete(`${API_BASE_URL}/customers/${id}`);
        dispatch({ type: ACTIONS.DELETE_CUSTOMER, payload: id });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to delete customer' });
        return { success: false, error: error.response?.data?.message || 'Failed to delete customer' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Category CRUD
    addCategory: async (categoryData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.post(`${API_BASE_URL}/categories`, categoryData);
        // Backend returns: { message, category }
        dispatch({ type: ACTIONS.ADD_CATEGORY, payload: response.data.category });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to add category' });
        return { success: false, error: error.response?.data?.message || 'Failed to add category' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    updateCategory: async (id, categoryData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.patch(`${API_BASE_URL}/categories/${id}`, categoryData);
        // Backend returns: { message, category }
        dispatch({ type: ACTIONS.UPDATE_CATEGORY, payload: { id, data: response.data.category } });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to update category' });
        return { success: false, error: error.response?.data?.message || 'Failed to update category' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    deleteCategory: async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        await axios.delete(`${API_BASE_URL}/categories/${id}`);
        dispatch({ type: ACTIONS.DELETE_CATEGORY, payload: id });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to delete category' });
        return { success: false, error: error.response?.data?.message || 'Failed to delete category' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Supplier CRUD
    addSupplier: async (supplierData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.post(`${API_BASE_URL}/suppliers`, supplierData);
        // Backend returns: { message, supplier }
        dispatch({ type: ACTIONS.ADD_SUPPLIER, payload: response.data.supplier });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to add supplier' });
        return { success: false, error: error.response?.data?.message || 'Failed to add supplier' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    updateSupplier: async (id, supplierData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.patch(`${API_BASE_URL}/suppliers/${id}`, supplierData);
        // Backend returns: { message: ..., supplier: ... }
        dispatch({ type: ACTIONS.UPDATE_SUPPLIER, payload: { id, data: response.data.supplier } });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to update supplier' });
        return { success: false, error: error.response?.data?.message || 'Failed to update supplier' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    deleteSupplier: async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        await axios.delete(`${API_BASE_URL}/suppliers/${id}`);
        dispatch({ type: ACTIONS.DELETE_SUPPLIER, payload: id });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to delete supplier' });
        return { success: false, error: error.response?.data?.message || 'Failed to delete supplier' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Sales CRUD
    addSale: async (saleData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.post(`${API_BASE_URL}/sales`, saleData);
        // Backend returns: { message: ..., sale: ... }
        dispatch({ type: ACTIONS.ADD_SALE, payload: response.data.sale });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to add sale' });
        return { success: false, error: error.response?.data?.message || 'Failed to add sale' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    updateSale: async (id, saleData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.patch(`${API_BASE_URL}/sales/${id}`, saleData);
        // Backend returns: { message: ..., sale: ... }
        dispatch({ type: ACTIONS.UPDATE_SALE, payload: { id, data: response.data.sale } });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to update sale' });
        return { success: false, error: error.response?.data?.message || 'Failed to update sale' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    deleteSale: async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        await axios.delete(`${API_BASE_URL}/sales/${id}`);
        dispatch({ type: ACTIONS.DELETE_SALE, payload: id });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to delete sale' });
        return { success: false, error: error.response?.data?.message || 'Failed to delete sale' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Purchase CRUD
    addPurchase: async (purchaseData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.post(`${API_BASE_URL}/purchases`, purchaseData);
        // Backend returns: { message, purchase }
        dispatch({ type: ACTIONS.ADD_PURCHASE, payload: response.data.purchase });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to add purchase' });
        return { success: false, error: error.response?.data?.message || 'Failed to add purchase' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    updatePurchase: async (id, purchaseData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.patch(`${API_BASE_URL}/purchases/${id}`, purchaseData);
        // Backend returns: { message: ..., purchase: ... }
        dispatch({ type: ACTIONS.UPDATE_PURCHASE, payload: { id, data: response.data.purchase } });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to update purchase' });
        return { success: false, error: error.response?.data?.message || 'Failed to update purchase' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    deletePurchase: async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        await axios.delete(`${API_BASE_URL}/purchases/${id}`);
        dispatch({ type: ACTIONS.DELETE_PURCHASE, payload: id });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to delete purchase' });
        return { success: false, error: error.response?.data?.message || 'Failed to delete purchase' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    
    // Order CRUD
    addOrder: async (orderData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
        // Backend returns: { message, order }
        dispatch({ type: ACTIONS.ADD_ORDER, payload: response.data.order });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to add order' });
        return { success: false, error: error.response?.data?.message || 'Failed to add order' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    updateOrder: async (id, orderData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.put(`${API_BASE_URL}/orders/${id}`, orderData);
        // Backend returns: { message: ..., order: ... }
        dispatch({ type: ACTIONS.UPDATE_ORDER, payload: { id, data: response.data.order } });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to update order' });
        return { success: false, error: error.response?.data?.message || 'Failed to update order' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    updateOrderStatus: async (id, status) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const response = await axios.patch(`${API_BASE_URL}/orders/${id}/status`, { status });
        dispatch({ type: ACTIONS.UPDATE_ORDER, payload: { id, data: response.data.order } });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to update order status' });
        return { success: false, error: error.response?.data?.message || 'Failed to update order status' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },
    deleteOrder: async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        await axios.delete(`${API_BASE_URL}/orders/${id}`);
        dispatch({ type: ACTIONS.DELETE_ORDER, payload: id });
        return { success: true };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to delete order' });
        return { success: false, error: error.response?.data?.message || 'Failed to delete order' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    // UI actions
    toggleSidebar: () => {
      dispatch({ type: ACTIONS.TOGGLE_SIDEBAR });
    },
    
    setTheme: (theme) => {
      localStorage.setItem('theme', theme);
      dispatch({ type: ACTIONS.SET_THEME, payload: theme });
    },
    
    clearError: () => {
      dispatch({ type: ACTIONS.CLEAR_ERROR });
    },
    
    // Analytics actions
    fetchAnalytics: async (period = 'daily') => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const [salesRes, inventoryRes, customerRes, productsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/analytics/sales?period=${period}`),
          axios.get(`${API_BASE_URL}/analytics/inventory`),
          axios.get(`${API_BASE_URL}/analytics/customers`),
          axios.get(`${API_BASE_URL}/analytics/top-products`)
        ]);

        const analyticsData = {
          salesData: salesRes.data.salesAnalytics || [],
          inventoryData: inventoryRes.data.inventoryAnalytics || {},
          customerData: customerRes.data.customerAnalytics || [],
          topProducts: productsRes.data.topProducts || []
        };

        dispatch({ type: ACTIONS.SET_ANALYTICS, payload: analyticsData });
        return { success: true, data: analyticsData };
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch analytics data' });
        return { success: false, error: 'Failed to fetch analytics data' };
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    },

    fetchDemandForecast: async (productId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/predictions/demand-forecast`, { params: { productId } });
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Forecast error:', error);
        return { success: false, error: 'Failed to fetch forecast' };
      }
    },

    fetchInventoryOptimization: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/predictions/inventory-optimization`);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('Optimization error:', error);
        return { success: false, error: 'Failed to fetch optimization' };
      }
    },

    // Notification actions
    addNotification: (notification) => {
      dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: {
        id: Date.now(),
        ...notification,
      }});
    },
    
    removeNotification: (id) => {
      dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id });
    },
  };
  
  // Initialize data on app load - only run once when authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      actions.fetchProducts();
      actions.fetchCustomers();
      actions.fetchSuppliers();
      actions.fetchCategories();
      actions.fetchSales();
      actions.fetchPurchases();
      actions.fetchOrders();
    }
  }, [state.isAuthenticated]); // Only depend on authentication state
  
  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timers = state.notifications.map(notification => 
      setTimeout(() => {
        actions.removeNotification(notification.id);
      }, 5000)
    );
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [state.notifications]); // Only depend on notifications
  
  // Apply theme to HTML element
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);
  
  const value = {
    ...state,
    actions,
    dispatch,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
