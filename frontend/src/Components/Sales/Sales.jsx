import axios from "axios";
import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const API_URL = "http://localhost:5000/api/sales";

const SaleContext = createContext();

export const SaleProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const data = res.data?.sales || res.data || [];

      if (Array.isArray(data)) {
        setSales(data);
        console.log("Fetched Sales:", data);
      } else {
        setSales([]);
      }
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const rerefresh = async () => {
    await fetchSales();
  };

  return (
    <SaleContext.Provider
      value={{ sales, setSales, setLoading, loading, error, rerefresh }}
    >
      {children}
    </SaleContext.Provider>
  );
};

export const useSaleContext = () => useContext(SaleContext);

export default SaleProvider;
