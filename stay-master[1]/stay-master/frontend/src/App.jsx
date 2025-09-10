import { useContext } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./protectRoutes/ProtectedRoute";
import PublicRoute from "./protectRoutes/PublicRoute";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ListProperty from "./pages/AddProperty";
import MyListings from "./pages/MyListings";
import Explore from "./pages/Explore";
import PropertyDetails from "./pages/PropertyDetails";

const App = () => {
  const { loading } = useContext(AuthContext);
  const location = useLocation();

  const hideNavbarPaths = ["/login", "/create"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-xl text-gray-600">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-green-500 mb-4"></div>
        <span className="animate-pulse text-lg text-gray-700">Loading...</span>
      </div>
    );
  }
  return (
    <>
      <ToastContainer />
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* ✅ Nested Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/list-property" element={<ListProperty />} />
          <Route path="/my-listings" element={<MyListings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default App;
