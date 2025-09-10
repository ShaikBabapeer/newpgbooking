import UserOtpModel from "../models/userLogin.js";

import jwt from "jsonwebtoken"
import transporter from "../config/nodemailer.js";
import userDataModel from "../models/userData.js";



export const sendVerifyOtp = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Accept only @gmail.com (case-insensitive)
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Only @gmail.com email addresses are allowed",
      });
    }

    // Check if email already registered
    const existingUser = await userDataModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Optional: Throttle OTP requests (5 min cooldown)
    const existingOtp = await UserOtpModel.findOne({ email });
    if (existingOtp && new Date() < existingOtp.expireAt) {
      return res.status(429).json({
        success: false,
        message:
          "OTP already sent. Please wait a few minutes before requesting again.",
      });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expireAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

    // Save or update OTP in DB
    await UserOtpModel.findOneAndUpdate(
      { email },
      { name, otp, expireAt },
      { upsert: true, new: true }
    );

    // Email content
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your StaySquare OTP",
      html: `
        <p>Hello <b>${name}</b>,</p>
        <p>Your OTP for StaySquare signup is: <h2>${otp}</h2></p>
        <p>This OTP is valid for 5 minutes.</p>
        <br/>
        <p style="font-size:12px;color:gray;">If you didn't request this, you can safely ignore this email.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "OTP sent to your Gmail address",
    });
  } catch (error) {
    console.error("Error in sendVerifyOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending OTP",
    });
  }
};
// --------------------------------------------------------------------------------------------------------------------------------



export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    // Find OTP entry
    const existing = await UserOtpModel.findOne({ email });

    if (!existing) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or not found" });
    }

    if (existing.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP is valid, create user
    const name = existing.name;

    const newUser = new userDataModel({ name, email });
    await newUser.save();

    // Delete OTP after use
    await UserOtpModel.deleteOne({ email });

    // Create JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });

    // Set cookie (secure in production only)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "OTP verified and user created",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


// ----------------------------------------------------------------------------------------------------------------------------

export const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await userDataModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Email not found. Please create an account.",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);

    await UserOtpModel.findOneAndUpdate(
      { email },
      {
        name: user.name,
       
        otp,
        expireAt,
      },
      { upsert: true, new: true }
    );

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your StaySquare Login OTP",
      html: `<p>Hello ${user.name},</p>
                 <p>Your login OTP is <b>${otp}</b>.</p>
                 <p>It is valid for 5 minutes.</p>
                 <br>
                 <p style="font-size:12px;color:gray;">If you didn't request this, you can safely ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Login OTP error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//------------------------------------------------------------------------------------------------------------------------------------


export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const existing = await UserOtpModel.findOne({ email });

    if (!existing || existing.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    const user = await userDataModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    await UserOtpModel.deleteOne({ email });

    // Create JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });

    // Set cookie (secure in production only)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      
      user: {
        name: user.name,
        
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login OTP verify error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//------------------------------------------------------------------------------------------------------------------
export const getMyProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userDataModel.findById(decoded.userId).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

//------------------------------------------------------------------------------------------------------------------------------------

export const logoutController = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};