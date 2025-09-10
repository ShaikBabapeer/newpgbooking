// controllers/propertyController.js
import propertyModel from "../models/Property.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const createProperty = async (req, res) => {
  try {
    const { name, description, gender, city, area, phone } = req.body;

    const lat = req.body.lat;
    const lng = req.body.lng;
    const prices = req.body.prices;
   
    console.log("🧾 name:", name);
    console.log("🧾 description:", description);
    console.log("🧾 gender:", gender);
    console.log("🧾 city:", city);
    console.log("🧾 area:", area);
    console.log("🧾 phone:", phone);
    console.log("🧾 lat:", lat);
    console.log("🧾 lng:", lng);
    console.log("🖼️ files:", req.files?.length);
    console.log("💸 prices:", prices);
    // Check for missing required fields
    if (!name || !description || !gender || !city || !phone || !lat || !lng || !area) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one image is required" });
    }

    // Upload images to Cloudinary
    const imageUploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "pg-property-images" })
    );
    const uploadedImages = await Promise.all(imageUploadPromises);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    // Delete local temp files
    req.files.forEach((file) => fs.unlinkSync(file.path));

    // Parse prices JSON safely
    let parsedPrices = [];
    try {
      parsedPrices = typeof prices === "string" ? JSON.parse(prices) : prices;
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid prices format" });
    }

    const property = await propertyModel.create({
      owner: req.user._id,
      name,
      description,
      gender,
      city,
      area: area || "", // optional fallback
      location: {
        lat: Number(lat),
        lng: Number(lng),
      },
      phone,
      prices: parsedPrices,
      images: imageUrls,
    });
    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);
    res.status(201).json({
      success: true,
      message: "Property listed successfully",
      property,
    });
  } catch (err) {
    console.error("Create Property Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await propertyModel.find().populate("owner", "name"); // only include `name` from UserData

    res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching properties",
    });
  }
};


export const deletePropertyByOwner = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user._id; // Set by isAuthenticated middleware

    const property = await propertyModel.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Ensure only the owner can delete
    if (property.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this property",
      });
    }

    await propertyModel.findByIdAndDelete(propertyId);

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Delete Property Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const userId = req.user._id; // Set by isAuthenticated middleware

    const properties = await propertyModel
      .find({ owner: userId })
      .populate("owner", "name") // Populate only the name of owner
      .sort({ createdAt: -1 }); // Optional: latest first

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Get My Listings Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await propertyModel.findById(id).populate("owner", "name");
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, property });
  } catch (err) {
    console.error("Get Property Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};