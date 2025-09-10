import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6"
        >
          Find the Perfect <span className="text-purple-600">Stay</span> Near
          You
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg sm:text-xl text-gray-700 mb-10"
        >
          Discover PGs, Hostels, and Shared Rooms in your city. Fast, simple,
          and built with trust in mind
        </motion.p>
        <div className="flex justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/explore")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition"
          >
            Find a Stay
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/list-property")}
            className="bg-white text-purple-600 border border-purple-600 px-6 py-3 rounded-lg shadow hover:bg-purple-100 transition"
          >
            List Your Property
          </motion.button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { title: "Verified Listings", icon: "🏠" },
          { title: "Easy Filtering", icon: "🔍" },
          { title: "Contact Owners", icon: "📞" },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800">
              {item.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
