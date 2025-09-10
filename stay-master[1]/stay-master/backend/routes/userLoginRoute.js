import express from "express";
import {
  sendVerifyOtp,
  verifyLoginOtp,
  sendLoginOtp,
  verifyOtpController,
  getMyProfile,
  logoutController,
} from "../controllers/userLoginController.js";

const authRouter = express.Router();

authRouter.post("/send-verify-otp",sendVerifyOtp)
authRouter.post("/verify-otp", verifyOtpController);
authRouter.post("/send-login-otp", sendLoginOtp);
authRouter.post("/verify-login-otp", verifyLoginOtp);
authRouter.get("/get-profile", getMyProfile);
authRouter.post("/logout", logoutController);
export default authRouter
