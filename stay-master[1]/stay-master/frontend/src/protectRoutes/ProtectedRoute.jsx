import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ProtectedRoute = () => {
  const { user, setUser, backendUrl } = useContext(AuthContext);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/auth/get-profile`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setChecking(false);
      }
    };

    verifyUser();
  }, [location.pathname]); // 🔁 recheck when route changes

  

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
