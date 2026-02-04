import axios from "axios";
import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const API_URL = "http://localhost:5000/api/purchases";

const PurchaseContext = createContext();

export const PurchaseProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const data = res.data?.purchases || res.data || [];

      if (Array.isArray(data)) {
        setPurchases(data);
        console.log("Fetched Purchases:", data);
      } else {
        setPurchases([]);
      }
    } catch (err) {
      console.error("Failed to fetch purchases:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const rerefresh = async () => {
    await fetchPurchases();
  };

  return (
    <PurchaseContext.Provider
      value={{ purchases, setPurchases, setLoading, loading, error, rerefresh }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchaseContext = () => useContext(PurchaseContext);

export default PurchaseProvider;
