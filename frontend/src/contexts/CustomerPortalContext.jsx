import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
    customer: JSON.parse(localStorage.getItem('customer')) || null,
    isCustomerAuthenticated: !!localStorage.getItem('customerToken'),
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    products: [],
    categories: [],
    orders: [],
    loading: false,
    error: null,
};

const ACTIONS = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGOUT: 'LOGOUT',
    SET_PRODUCTS: 'SET_PRODUCTS',
    SET_CATEGORIES: 'SET_CATEGORIES',
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    UPDATE_CART_QTY: 'UPDATE_CART_QTY',
    CLEAR_CART: 'CLEAR_CART',
    SET_ORDERS: 'SET_ORDERS',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
};

const portalReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.LOGIN_SUCCESS:
            return { ...state, customer: action.payload.customer, isCustomerAuthenticated: true, error: null };
        case ACTIONS.LOGOUT:
            return { ...state, customer: null, isCustomerAuthenticated: false, cart: [] };
        case ACTIONS.SET_PRODUCTS:
            return { ...state, products: action.payload };
        case ACTIONS.SET_CATEGORIES:
            return { ...state, categories: action.payload };
        case ACTIONS.ADD_TO_CART:
            const existingItem = state.cart.find(item => item.productId === action.payload.productId);
            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map(item => 
                        item.productId === action.payload.productId 
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                    )
                };
            }
            return { ...state, cart: [...state.cart, action.payload] };
        case ACTIONS.REMOVE_FROM_CART:
            return { ...state, cart: state.cart.filter(item => item.productId !== action.payload) };
        case ACTIONS.UPDATE_CART_QTY:
            return {
                ...state,
                cart: state.cart.map(item => 
                    item.productId === action.payload.productId 
                    ? { ...item, quantity: action.payload.quantity }
                    : item
                )
            };
        case ACTIONS.CLEAR_CART:
            return { ...state, cart: [] };
        case ACTIONS.SET_ORDERS:
            return { ...state, orders: action.payload };
        case ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

const CustomerPortalContext = createContext();

export const CustomerPortalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(portalReducer, initialState);
    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    const actions = {
        login: async (credentials) => {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            try {
                const res = await axios.post(`${API_BASE}/customer-portal/login`, credentials);
                localStorage.setItem('customerToken', res.data.token);
                localStorage.setItem('customer', JSON.stringify(res.data.customer));
                dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: res.data });
                return { success: true };
            } catch (err) {
                dispatch({ type: ACTIONS.SET_ERROR, payload: err.response?.data?.message || 'Login failed' });
                return { success: false, error: err.response?.data?.message };
            } finally {
                dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            }
        },
        register: async (data) => {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            try {
                const res = await axios.post(`${API_BASE}/customer-portal/register`, data);
                localStorage.setItem('customerToken', res.data.token);
                localStorage.setItem('customer', JSON.stringify(res.data.customer));
                dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: res.data });
                return { success: true };
            } catch (err) {
                return { success: false, error: err.response?.data?.message };
            } finally {
                dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            }
        },
        logout: () => {
            localStorage.removeItem('customerToken');
            localStorage.removeItem('customer');
            localStorage.removeItem('cart');
            dispatch({ type: ACTIONS.LOGOUT });
        },
        fetchProducts: async () => {
            try {
                const res = await axios.get(`${API_BASE}/products`);
                dispatch({ type: ACTIONS.SET_PRODUCTS, payload: res.data.products });
            } catch (err) { console.error(err); }
        },
        fetchCategories: async () => {
            try {
                const res = await axios.get(`${API_BASE}/categories`);
                dispatch({ type: ACTIONS.SET_CATEGORIES, payload: res.data.categories });
            } catch (err) { console.error(err); }
        },
        placeOrder: async (orderData) => {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            const token = localStorage.getItem('customerToken');
            try {
                const res = await axios.post(`${API_BASE}/customer-portal/orders`, orderData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch({ type: ACTIONS.CLEAR_CART });
                return { success: true, order: res.data.order };
            } catch (err) {
                return { success: false, error: err.response?.data?.message };
            } finally {
                dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            }
        },
        fetchMyOrders: async () => {
            const token = localStorage.getItem('customerToken');
            try {
                const res = await axios.get(`${API_BASE}/customer-portal/my-orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch({ type: ACTIONS.SET_ORDERS, payload: res.data.orders });
            } catch (err) { console.error(err); }
        },
        addToCart: (product, quantity = 1) => {
            dispatch({ type: ACTIONS.ADD_TO_CART, payload: { ...product, quantity, productId: product._id } });
        },
        removeFromCart: (productId) => {
            dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });
        },
        updateCartQty: (productId, quantity) => {
            dispatch({ type: ACTIONS.UPDATE_CART_QTY, payload: { productId, quantity } });
        }
    };

    return (
        <CustomerPortalContext.Provider value={{ ...state, actions }}>
            {children}
        </CustomerPortalContext.Provider>
    );
};

export const useCustomerPortal = () => useContext(CustomerPortalContext);
