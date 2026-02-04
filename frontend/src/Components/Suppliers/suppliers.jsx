import axios from "axios";
import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const API_URL = "http://localhost:5000/api/suppliers";

const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const data = res.data?.suppliers || res.data || [];

      if (Array.isArray(data)) {
        setSuppliers(data);
        console.log("Fetched Suppliers:", data);
      } else {
        setSuppliers([]);
      }
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const rerefresh = async () => {
    await fetchSuppliers();
  };

  return (
    <SupplierContext.Provider
      value={{ suppliers, setSuppliers, setLoading, loading, error, rerefresh }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplierContext = () => useContext(SupplierContext);

export default SupplierProvider;
