import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/attendencedemo`);
  } catch (err) {
    console.error("❌ Initial connection failed:", err);
    process.exit(1); // Optional: stop server if DB fails
  }
};

export default connectDB;
