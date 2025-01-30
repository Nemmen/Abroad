import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../services/ApiEndpoint";
import { useToast } from "@chakra-ui/react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await post("http://127.0.0.1:4000/auth/send-otp", { email });

      if (response.status === 200) {
        toast({
          title: "OTP Sent",
          description: "Check your email for the OTP.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        navigate("/auth/reset-password", { state: { email } });
      }
    } catch (error) {
      toast({
        title: "Failed to send OTP",
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6">Enter your email to receive an OTP.</p>
        <form onSubmit={handleSendOTP}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
