// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
 
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/auth/get-profile`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true); // Start fresh loading on route change
    fetchUser();
  }, [location.pathname]); 

  const value = {
    user,
    setUser,
    loading,
    backendUrl
  }
  return (
    <AuthContext.Provider value={ value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider
