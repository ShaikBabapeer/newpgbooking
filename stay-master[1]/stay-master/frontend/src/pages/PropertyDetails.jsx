import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { AuthContext } from "../context/AuthContext";
import { GoogleMapsContext } from "../context/GoogleMapsContext";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const PropertyDetails = () => {
  const { backendUrl} = useContext(AuthContext);
  const { isLoaded } = useContext(GoogleMapsContext); // ✅ use shared loader
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/property/${id}`);
        const data = res.data.property;
        if (!data) throw new Error("No property found");

        setProperty(data);
        setMainImage(data.images?.[0] || "");
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch property:", err.message);
        setError("Property not found or server error.");
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, backendUrl]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 mt-20 py-10 animate-fade-in ">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-green-700">
        {property.name}
      </h2>

      {mainImage && (
        <div className="w-full aspect-video bg-gray-200 rounded shadow overflow-hidden mb-4">
          <img
            src={mainImage}
            alt="Main"
            className="w-full h-full object-cover object-center transition-all duration-300"
          />
        </div>
      )}

      {property.images?.length > 1 && (
        <div className="flex gap-3 overflow-x-auto mb-6 pb-1 scrollbar-hide">
          {property.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`img-${idx}`}
              onClick={() => setMainImage(img)}
              className={`h-20 w-28 rounded cursor-pointer object-cover border-2 transition-transform duration-200 ${
                mainImage === img
                  ? "border-blue-500 scale-105"
                  : "border-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="text-gray-700 text-lg font-semibold mb-1">
          📍 {property.area}, {property.city}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <p className="text-gray-700 text-lg font-semibold mb-1 uppercase">
          Property Suitable For : {property.gender}
        </p>
        <p className="text-gray-600">{property.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-2">
          🛏️ Sharing Types & Prices
        </h3>
        <ul className="space-y-1 text-gray-700">
          {property.prices?.map((p, idx) => (
            <li key={idx} className="border-b py-1">
              <span className="font-medium">{p.sharingType}:</span> ₹{p.price}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-5 rounded-lg bg-yellow-100 border border-yellow-300 mb-6">
        <h3 className="text-lg font-semibold mb-1 text-yellow-800">
          📞 Contact Owner
        </h3>
        <p className="text-xl font-bold">{property.phone}</p>
      </div>

      {isLoaded && property.location?.lat && property.location?.lng && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-green-700">
            📍 Location
          </h3>
          <div className="rounded overflow-hidden shadow-lg">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{
                lat: parseFloat(property.location.lat),
                lng: parseFloat(property.location.lng),
              }}
              zoom={14}
            >
              <Marker
                position={{
                  lat: parseFloat(property.location.lat),
                  lng: parseFloat(property.location.lng),
                }}
              />
            </GoogleMap>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
