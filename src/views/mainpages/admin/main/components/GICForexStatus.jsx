import React, { useState, useEffect } from "react";
import axios from "axios";
import { GrDocumentVerified } from "react-icons/gr";
import { FaMoneyBill } from "react-icons/fa";

const GICForexStatus = () => {
  const [data, setData] = useState({ forexCount: 0, gicCount: 0, aeCommission: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://abroad-backend-gray.vercel.app/admin/getForexAndGicData");
        // Ensure data is not null or undefined before setting state
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching Forex & GIC data:", error);
      }
    }
    fetchData();
  }, []);

  const cardData = [
    {
      id: 1,
      title: "Forex Transactions",
      value: data.forexCount || 0, // Fallback to 0 if data is undefined or null
      icon: <GrDocumentVerified size={30} color={ "blue"} />,
    },
    {
      id: 2,
      title: "GIC Transactions",
      value: data.gicCount || 0, // Fallback to 0 if data is undefined or null
      icon: <GrDocumentVerified size={30} color={ "blue"} />,
    },
    {
      id: 3,
      title: "AE Commission",
      value: "---", // Fallback if aeCommission is undefined or null
      icon: <FaMoneyBill size={30} color={ "#34d399"} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {cardData.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="bg-gray-100 rounded-full p-3">{item.icon}</div>

            {/* Text Section */}
            <div>
              <h5 className="text-2xl font-semibold">{item.value}</h5>
              <p className="text-gray-500">{item.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GICForexStatus;
