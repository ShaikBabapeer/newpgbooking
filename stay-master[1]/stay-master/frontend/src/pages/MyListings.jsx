import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const MyListings = () => {
  const { backendUrl } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/property/my`, {
        withCredentials: true,
      });
      setProperties(data.properties || []);
    } catch (err) {
      toast.error("Failed to fetch your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`${backendUrl}/api/property/${id}`, {
        withCredentials: true,
      });
      toast.success("Property deleted");
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error("Failed to delete property");
    }
  };

  if (loading) {
    return (
      <div className="mt-24 text-center text-lg text-gray-600">
        Loading your listings...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 mt-12 ">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        My Listings
      </h1>

      {properties.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven't listed any properties yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property._id}
              className="border rounded-xl shadow-sm overflow-hidden bg-white hover:shadow-lg transition"
            >
              <img
                src={property.images?.[0]}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{property.name}</h2>
                <p className="text-sm text-gray-500">
                  {property.city}, {property.area}
                </p>
                <p className="text-sm text-gray-600">
                  🧍 {property.gender} | 📞 {property.phone}
                </p>
                <p className="text-sm">
                  💰 From ₹{Math.min(...property.prices.map((p) => p.price))} /
                  month
                </p>

                <div className="flex justify-between mt-4">
                  <Link
                    to={`/property/${property._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
