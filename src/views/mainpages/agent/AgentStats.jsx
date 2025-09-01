import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Box, Card, CardContent, Typography, 
  Grid, Avatar, CircularProgress 
} from "@mui/material";
import { GrDocumentVerified } from "react-icons/gr";
import { blue } from "@mui/material/colors";

const AgentStats = () => {
  const [stats, setStats] = useState({ gicCount: 0, forexCount: 0, blockedCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgentStats() {
      try {
        const token = localStorage.getItem("token_auth");
        
        const response = await axios.get("https://abroad-backend-gray.vercel.app/auth/agent/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching Agent Stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgentStats();
  }, []);

  const agentCardData = [
    {
      id: 1,
      title: "Forex Transactions",
      value: stats.forexCount,
      icon: <GrDocumentVerified size={24} />,
      color: blue[500],
      bgColor: blue[50]
    },
    {
      id: 2,
      title: "GIC Transactions",
      value: stats.gicCount,
      icon: <GrDocumentVerified size={24} />,
      color: "#6366F1",
      bgColor: "#EEF2FF"
    },
    {
      id: 3,
      title: "Blocked Entries",
      value: stats.blockedCount || "---",
      icon: <GrDocumentVerified size={24} />,
      color: "#F59E0B",
      bgColor: "#FEF3C7"
    },
  ];

  return (
    <Box sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
        Your Statistics
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {agentCardData.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      sx={{ 
                        bgcolor: item.bgColor,
                        color: item.color,
                        width: 56,
                        height: 56,
                        mr: 2
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="700">
                        {item.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AgentStats;