// src/Components/User/userContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";

const API_URL = `${API_BASE_URL}/users`;

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]); // actual DB data stored here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      const data = res.data?.users || res.data || [];
      if (Array.isArray(data)) setUsers(data);
      else setUsers([]);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refreshUsers = async () => {
    // refresh
    await fetchUsers();
  };

  return (
    <UserContext.Provider
      value={{ users, setUsers, loading, error, refreshUsers }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
