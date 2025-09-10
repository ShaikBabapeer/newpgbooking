import mongoose from "mongoose";

const userSignupSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

// TTL index to auto-delete OTP documents once expired
userSignupSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const UserOtpModel =
  mongoose.models.userSignup || mongoose.model("UserOtp", userSignupSchema);

export default UserOtpModel;
