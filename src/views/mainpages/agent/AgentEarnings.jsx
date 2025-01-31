import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiDollar } from "react-icons/bi";
// import { FaMoneyBill} from "react-icons/fa";
import { FaUniversity } from "react-icons/fa";
import { Spinner, useToast } from "@chakra-ui/react";

const AgentEarnings = () => {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState({ gicCommission: 0, forexCommission: 0 });
  const toast = useToast();

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem("token_auth"); // Get auth token
        const response = await axios.get("https://abroad-backend-ten.vercel.app/auth/getAgentCommission", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEarnings(response.data);
      } catch (error) {
        toast({
          title: "Error fetching earnings",
          description: error.response?.data?.message || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [toast]);

  return (
    <div className="p-6">
        <h2 className="text-2xl font-semibold text-start text-gray-700 mb-4">Agent Earnings</h2>
        <div className="flex flex-col items-center justify-center">

        {loading ? (
            <Spinner size="xl" color="blue.500" />
        ) : (
            <div className="grid md:grid-cols-2 gap-6 w-full">
            {/* Forex Earnings Card */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between w-full">
                <div>
                <h3 className="text-xl font-semibold text-gray-700">Forex Earnings</h3>
                <p className="text-2xl font-bold text-blue-600">{earnings.forexCommission}/-</p>
                </div>
                <BiDollar className="text-5xl text-blue-500" />
            </div>

            {/* GIC Earnings Card */}
            <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between w-full">
                <div>
                <h3 className="text-xl font-semibold text-gray-700">GIC Earnings</h3>
                <p className="text-2xl font-bold text-green-600">{earnings.gicCommission}/-</p>
                </div>
                <FaUniversity className="text-5xl text-green-500" />
            </div>
            </div>
        )}
        </div>
    </div>
  );
};

export default AgentEarnings;
