import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import axios from "axios";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { backendUrl,user,setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null); // remove user from context
     
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
      
    }
  };
  
  const links = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/my-listings", label: "My Listings", authOnly: true },
    { to: "/list-property", label: "List Property", authOnly: true },
  ];

  return (
    <nav className="bg-slate-900 text-white px-5 sm:px-10 py-3 flex items-center justify-between shadow-md fixed top-0 w-full z-50">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">
        <Link to="/" className="text-red-500">
          STAY<span className="text-white">SQUARE</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-6">
        {links.map(
          (link) =>
            (!link.authOnly || user) && (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-red-400 transition duration-150"
              >
                {link.label}
              </Link>
            )
        )}

        {!user ? (
          <Link
            to="/login"
            className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-slate-800 p-4 flex flex-col space-y-4 md:hidden z-50">
          {links.map(
            (link) =>
              (!link.authOnly || user) && (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-red-400 transition duration-150"
                >
                  {link.label}
                </Link>
              )
          )}

          {!user ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-red-600 px-4 py-2 rounded text-center hover:bg-red-700"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
