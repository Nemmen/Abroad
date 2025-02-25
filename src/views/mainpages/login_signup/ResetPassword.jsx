import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { post } from "../services/ApiEndpoint";
import { useToast } from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await post("https://abroad-backend-gray.vercel.app/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (response.status === 200) {
        toast({
          title: "Password Reset Successful",
          description: "You can now log in with your new password.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        navigate("/auth/login");
      }
    } catch (error) {
      toast({
        title: "Failed to Reset Password",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reset Password</h2>
        <p className="text-sm text-gray-600 mb-6">Enter the OTP and your new password.</p>
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-semibold text-gray-800">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showPassword ? <HiEyeOff className="text-gray-600" /> : <HiEye className="text-gray-600" />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
