// models/propertyModel.js
import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
  sharingType: { type: String, required: true }, // "1-sharing", "2-sharing", etc.
  price: { type: Number, required: true },
});

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    name: { type: String, required: true },
    images: [String], // Cloudinary URLs
    description: { type: String, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "colive"],
      required: true,
    },
    city: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    area: { type: String, required: true }, // Autocomplete place
    location: {
      lat: Number,
      lng: Number,
    },
    phone: { type: String, required: true },
    prices: [priceSchema], // Array of sharing types and prices
  },
  { timestamps: true }
);


const propertyModel = mongoose.models.PropertyData || mongoose.model("PropertyData", propertySchema);
export default propertyModel