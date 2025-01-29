import React from 'react'
import axios from "axios";
import { GrDocumentVerified } from "react-icons/gr";
import { MdAttachMoney } from "react-icons/md";

const Stats = () => {
    const [agentData, setAgentData] = useState({ forexCount: 0, gicCount: 0, totalIncome: 0 });

    useEffect(() => {
        async function fetchAgentData() {
          try {
            const response = await axios.get("http://127.0.0.1:4000/auth/getAllGICForex");
            if (response.data) {
              setAgentData({
                forexCount: response.data.forexCount || 0,
                gicCount: response.data.gicCount || 0,
                totalIncome: response.data.totalIncome || 0,
              });
            }
          } catch (error) {
            console.error("Error fetching Agent Data:", error);
          }
        }
    
        
        fetchAgentData();
      }, []);
    
    const agentCardData = [
        {
          id: 1,
          title: "Your Forex Transactions",
          value: agentData.forexCount || 0,
          icon: <GrDocumentVerified size={30} color="blue" />,
        },
        {
          id: 2,
          title: "Your GIC Transactions",
          value: agentData.gicCount || 0,
          icon: <GrDocumentVerified size={30} color="blue" />,
        },
        {
          id: 3,
          title: "Total Income",
          value: `$${agentData.totalIncome.toFixed(2)}` || "---",
          icon: <MdAttachMoney size={30} color="#34d399" />,
        },
      ];
  return (
    <div>
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
  )
}

export default Stats