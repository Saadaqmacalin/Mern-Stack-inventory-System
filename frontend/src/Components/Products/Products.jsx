import axios from "axios";
import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const API_URL = "http://localhost:5000/api/products";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const data = res.data?.products || res.data || [];

      if (Array.isArray(data)) {
        setProducts(data);
        console.log("Fetched Products:", data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const rerefresh = async () => {
    await fetchProducts();
  };

  return (
    <ProductContext.Provider
      value={{ products, setProducts, setLoading, loading, error, rerefresh }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);

export default ProductProvider; // Default export for backwards compatibility if needed, though we should use named export
