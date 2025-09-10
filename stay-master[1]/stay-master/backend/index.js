import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/userLoginRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import propertyRouter from "./routes/propertyRoute.js";
const app = express();


const port = process.env.PORT || 4000;

app.use(express.json());
const allowedOrigin =
  process.env.CLIENT_URL || "https://stay-sqaure.vercel.app";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(cookieParser())
connectCloudinary();

app.use("/api/auth",authRouter)
app.use("/api",propertyRouter)
app.get("/", (req, res) => {
  res.send("API  WORKING");
});

connectDB()
  .then(() => {
    app.listen(port, () => console.log("🚀 Server started on port:", port));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });