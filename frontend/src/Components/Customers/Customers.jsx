import axios from "axios";
import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const API_URL = "http://localhost:5000/api/customers";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const data = res.data?.customers || res.data || [];

      if (Array.isArray(data)) {
        setCustomers(data);
        console.log("Fetched Customers:", data);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const rerefresh = async () => {
    await fetchCustomers();
  };

  return (
    <CustomerContext.Provider
      value={{ customers, setCustomers, setLoading, loading, error, rerefresh }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => useContext(CustomerContext);

export default CustomerProvider;
