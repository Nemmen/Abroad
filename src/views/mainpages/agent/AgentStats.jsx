import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoneyBill} from "react-icons/fa";
import { GrDocumentVerified } from "react-icons/gr";

const AgentStats = () => {
  const [stats, setStats] = useState({ gicCount: 0, forexCount: 0, blockedCount: 0 });

  useEffect(() => {
    async function fetchAgentStats() {
      try {
        const token = localStorage.getItem("token_auth"); // Fetch token from local storage
        
        const response = await axios.get("http://127.0.0.1:4000/auth/agent/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setStats(response.data);
          
        }
      } catch (error) {
        console.error("Error fetching Agent Stats:", error);
      }
    }

    fetchAgentStats();
  }, []);

  const agentCardData = [
    {
      id: 1,
      title: "Your Forex Transactions",
      value: stats.forexCount,
      icon: <GrDocumentVerified size={30} color="blue" />,
    },
    {
      id: 2,
      title: "Your GIC Transactions",
      value: stats.gicCount,
      icon: <GrDocumentVerified size={30} color="blue" />,
    },
    {
      id: 3,
      title: "Blocked Entries",
      value: stats.blockedCount||"---",
      icon: <GrDocumentVerified size={30} color="blue" />,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentCardData.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-full p-3">{item.icon}</div>
              <div>
                <h5 className="text-2xl font-semibold">{item.value}</h5>
                <p className="text-gray-500">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentStats;
