import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { backendUrl, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/send-login-otp`,
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setShowOtp(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otp = inputRefs.current.map((input) => input.value).join("");

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/verify-login-otp`,
        { email, otp },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(response.data.user); // ✅ update auth context
        toast.success("Login successful");
        navigate("/dashboard"); // ✅ redirect after login
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Helpers
  const handleInput = (e, index) => {
    if (e.target.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").slice(0, 6);
    data.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200  px-4">
      <h1 className="absolute left-5 sm:left-20 top-5 font-bold text-2xl  tracking-wide  cursor-pointer text-red-500">
        STAY <span className="text-black ">SQUARE</span>
      </h1>
      <div className="bg-slate-900 p-8 rounded-lg shadow-md w-full max-w-sm">
        {!showOtp ? (
          <>
            <h2 className="text-2xl font-semibold text-white text-center mb-6">
              Login
            </h2>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="Enter your Gmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded bg-[#333A5C] text-white mb-4 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-4">
              Don't have an account?{" "}
              <span
                className="text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate("/create")}
              >
                Create one
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-white text-center mb-4">
              Enter OTP
            </h2>
            <p className="text-indigo-300 text-center mb-4 text-sm">
              We sent a 6-digit OTP to your Gmail
            </p>
            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-between mb-6" onPaste={handlePaste}>
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      ref={(el) => (inputRefs.current[i] = el)}
                      onInput={(e) => handleInput(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="w-10 h-10 text-center text-white bg-[#333A5C] rounded text-xl"
                      required
                    />
                  ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {loading ? "Verifying..." : "Verify OTP & Login"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
