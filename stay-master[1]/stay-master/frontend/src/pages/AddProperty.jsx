import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { AuthContext } from "../context/AuthContext";
import { GoogleMapsContext } from "../context/GoogleMapsContext";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const ListProperty = () => {
  const { backendUrl } = useContext(AuthContext);
  const { isLoaded } = useContext(GoogleMapsContext);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    gender: "",
    city: "",
    area: "",
    phone: "",
    prices: [{ sharingType: "1-sharing", price: "" }],
    location: { lat: 17.385044, lng: 78.486671 },
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "in" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const area = place.formatted_address || place.name;

          setForm((prev) => ({
            ...prev,
            area,
            location: { lat, lng },
          }));
        }
      });
    }
  }, [isLoaded]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (index, key, value) => {
    const updated = [...form.prices];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, prices: updated }));
  };

  const addPriceField = () => {
    if (form.prices.length < 9) {
      setForm((prev) => ({
        ...prev,
        prices: [...prev.prices, { sharingType: "", price: "" }],
      }));
    }
  };

  const handleMapClick = (e) => {
    const { latLng } = e;
    setForm((prev) => ({
      ...prev,
      location: {
        lat: latLng.lat(),
        lng: latLng.lng(),
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.gender)
      return toast.error("Please select the gender for this property");
    if (!form.description || form.description.length < 10)
      return toast.error("Please add a detailed description");
    if (!form.area) return toast.error("Please select area from suggestions");
    if (images.length < 1)
      return toast.error("Please upload at least one image");

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));
    for (let key in form) {
      if (key === "prices") {
        formData.append("prices", JSON.stringify(form.prices));
      } else if (key === "location") {
        formData.append("lat", form.location.lat);
        formData.append("lng", form.location.lng);
      } else {
        formData.append(key, form[key]);
      }
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${backendUrl}/api/property/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Property listed!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Listing failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 mt-20 ">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        List Your Property
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            type="text"
            placeholder="Property Name"
            value={form.name}
            onChange={handleInputChange}
            required
            className="p-3 border rounded"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Contact Number"
            value={form.phone}
            onChange={handleInputChange}
            required
            className="p-3 border rounded"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleInputChange}
            required
            className="p-3 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="colive">Co-Live</option>
          </select>
          <select
            name="city"
            value={form.city}
            onChange={handleInputChange}
            required
            className="p-3 border rounded"
          >
            <option value="">Select City</option>
            {[
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
            ].map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Write about this property..."
          value={form.description}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full p-3 border rounded"
        />

        {/* Area Autocomplete */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter Area or Landmark"
          className="w-full border p-3 rounded"
        />

        {/* Map Selector */}
        <div>
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            📍 Click to select location on map
          </button>
          {isLoaded && showMap && (
            <div className="my-4">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={form.location}
                zoom={13}
                onClick={handleMapClick}
              >
                <Marker position={form.location} />
              </GoogleMap>
            </div>
          )}
        </div>

        {/* Sharing Prices */}
        <div>
          <h3 className="font-semibold mb-2">Sharing Types & Prices</h3>
          <div className="space-y-3">
            {form.prices.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <select
                  value={item.sharingType}
                  onChange={(e) =>
                    handlePriceChange(idx, "sharingType", e.target.value)
                  }
                  className="p-2 border rounded w-1/2"
                >
                  {Array.from({ length: 9 }, (_, i) => `${i + 1}-sharing`).map(
                    (type) => (
                      <option key={type}>{type}</option>
                    )
                  )}
                </select>
                <input
                  type="number"
                  placeholder="Rent (₹)"
                  value={item.price}
                  onChange={(e) =>
                    handlePriceChange(idx, "price", e.target.value)
                  }
                  className="p-2 border rounded w-1/2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addPriceField}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add another sharing
            </button>
          </div>
        </div>

        {/* Images Upload */}
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          {previewImages.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {previewImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Preview ${i}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center border rounded cursor-pointer p-2 text-blue-600 hover:bg-blue-100"
              >
                + Add Image
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-100"
            >
              + Upload Images
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-3 rounded text-lg ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSubmitting ? "Listing..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
};

export default ListProperty;
