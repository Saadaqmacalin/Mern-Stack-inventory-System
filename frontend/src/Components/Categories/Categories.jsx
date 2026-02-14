import axios from "axios";
import React, {
  useCallback,
  createContext,
  useContext,
  useState,
} from "react";
import API_BASE_URL from "../../config/api";

const API_URL = `${API_BASE_URL}/categories`;

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const data = res.data?.categories || res.data || [];

      if (Array.isArray(data)) {
        setCategories(data);
         console.log("Fetched Categories:", data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const rerefresh = async () => {
    await fetchCategories();
  };

  return (
    <CategoryContext.Provider
      value={{ categories, setCategories,setLoading, loading, error, rerefresh }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => useContext(CategoryContext);
