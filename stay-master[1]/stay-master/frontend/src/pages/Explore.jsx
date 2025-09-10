import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Explore = () => {
  const { backendUrl } = useContext(AuthContext);
  const [allProperties, setAllProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");

  const cities = [
    "Bengaluru",
    "Hyderabad",
    "Mumbai",
    "Chennai",
    "Kolkata",
    "Noida",
    "Pune",
    "Kochi",
    "Lucknow",
    "Delhi",
    "Ahmedabad",
    "Jaipur",
    "Indore",
    "Chandigarh",
    "Bhopal",
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/property/all`);
        setAllProperties(data.properties);
        setFiltered(data.properties);
      } catch (err) {
        console.error("Failed to load properties:", err);
      }
    };
    fetchProperties();
  }, [backendUrl]);

  // Combined filter
  const filterProperties = (selectedCity, selectedGender) => {
    let filteredList = allProperties;

    if (selectedCity) {
      filteredList = filteredList.filter((p) => p.city === selectedCity);
    }

    if (selectedGender) {
      filteredList = filteredList.filter((p) => p.gender === selectedGender);
    }

    setFiltered(filteredList);
  };

  const handleCityChange = (e) => {
    const selected = e.target.value;
    setCity(selected);
    filterProperties(selected, gender);
  };

  const handleGenderChange = (e) => {
    const selected = e.target.value;
    setGender(selected);
    filterProperties(city, selected);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-16 ">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Explore PG Listings
      </h1>

      {/* Filters */}
      <div className="flex justify-center flex-wrap gap-4 mb-6">
        {/* City Filter */}
        <select
          value={city}
          onChange={handleCityChange}
          className="p-3 border rounded shadow-sm min-w-[200px]"
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Gender Filter */}
        <select
          value={gender}
          onChange={handleGenderChange}
          className="p-3 border rounded shadow-sm min-w-[200px]"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="colive">Co-Live</option>
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No listings found.</p>
      ) : (
        <div className="space-y-6">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="flex flex-col sm:flex-row bg-white border rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              {/* Image */}
              <div className="sm:w-1/3 w-full h-[200px] sm:h-[180px] bg-gray-200">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="sm:w-2/3 w-full p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">{p.name}</h2>
                  <p className="text-gray-600 text-sm mb-1">
                    📍 {p.area}, {p.city}
                  </p>
                  <p className="text-gray-600 font-medium text-sm mb-2 uppercase">
                    {p.gender}
                  </p>
                  <p className="text-green-600 font-bold text-lg">
                    Starts from ₹
                    {Math.min(...p.prices.map((price) => price.price))}
                  </p>
                </div>

                <div className="mt-3">
                  <Link
                    to={`/property/${p._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    See More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
