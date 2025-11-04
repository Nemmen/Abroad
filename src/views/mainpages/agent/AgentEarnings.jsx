import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  Box, Card, CardContent, Typography, 
  Grid, Avatar, CircularProgress 
} from "@mui/material";
import { BiDollar } from "react-icons/bi";
import { FaUniversity } from "react-icons/fa";

const AgentEarnings = () => {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState({ gicCommission: 0, forexCommission: 0 });

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem("token_auth");
        const response = await axios.get("https://abroad-backend-gray.vercel.app/auth/getAgentCommission", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // 10 seconds timeout
          withCredentials: true // Include credentials
        });
        setEarnings(response.data || { gicCommission: 0, forexCommission: 0 });
      } catch (error) {
        console.error("Error fetching earnings:", error);
        setEarnings({ gicCommission: 0, forexCommission: 0 }); // Set default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const earningsData = [
    {
      id: 1,
      title: "Forex Earnings",
      value: `${earnings.forexCommission}/-`,
      icon: <BiDollar size={30} />,
      color: "#3B82F6",
      bgColor: "#EFF6FF",
      link: "/agent/forex"
    },
    {
      id: 2,
      title: "GIC Earnings",
      value: `${earnings.gicCommission}/-`,
      icon: <FaUniversity size={26} />,
      color: "#10B981",
      bgColor: "#ECFDF5",
      link: "/agent/gic"
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
        Your Earnings
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {earningsData.map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <Link to={item.link} style={{ textDecoration: 'none' }}>
                <Card 
                  elevation={0}
                  sx={{ 
                    borderRadius: 2, 
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="h4" fontWeight="700" color={item.color}>
                          {item.value}
                        </Typography>
                      </Box>
                      <Avatar 
                        sx={{ 
                          bgcolor: item.bgColor,
                          color: item.color,
                          width: 64,
                          height: 64
                        }}
                      >
                        {item.icon}
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AgentEarnings;