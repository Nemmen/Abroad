import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Grid,
  Skeleton,
  useMediaQuery 
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import { GrDocumentVerified } from "react-icons/gr";
import { FaMoneyBill } from "react-icons/fa";

const GICForexStatus = () => {
  const [data, setData] = useState({ forexCount: 0, gicCount: 0, aeCommission: 0 });
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();

  // Create MUI theme based on Chakra color mode
  const theme = createTheme({
    palette: {
      mode: colorMode,
      primary: {
        main: colorMode === 'light' ? '#3B82F6' : '#90CAF9',
      },
      secondary: {
        main: colorMode === 'light' ? '#10B981' : '#5CDB95',
      },
      background: {
        default: colorMode === 'light' ? '#ffffff' : '#121212',
        paper: colorMode === 'light' ? '#f9fafc' : '#1E1E1E',
      },
      text: {
        primary: colorMode === 'light' ? '#111827' : '#f3f4f6',
        secondary: colorMode === 'light' ? '#4B5563' : '#9CA3AF',
      },
      chart: {
        line: '#3f51b5',
        grid: colorMode === 'light' ? '#e5e7eb' : '#374151',
      }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
          },
        },
      },
    },
  });

  // Use direct media query for responsiveness
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get("https://abroad-backend-gray.vercel.app/admin/getForexAndGicData");
        // Ensure data is not null or undefined before setting state
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching Forex & GIC data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const cardData = [
    {
      id: 1,
      title: "Forex Transactions",
      value: data.forexCount || 0, // Fallback to 0 if data is undefined or null
      icon: <GrDocumentVerified size={30} style={{ color: colorMode === 'light' ? '#3B82F6' : '#90CAF9' }} />,
      gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    },
    {
      id: 2,
      title: "GIC Transactions",
      value: data.gicCount || 0, // Fallback to 0 if data is undefined or null
      icon: <GrDocumentVerified size={30} style={{ color: colorMode === 'light' ? '#3B82F6' : '#90CAF9' }} />,
      gradient: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
    },
    {
      id: 3,
      title: "AE Commission",
      value: "---", // Fallback if aeCommission is undefined or null
      icon: <FaMoneyBill size={30} style={{ color: colorMode === 'light' ? '#10B981' : '#5CDB95' }} />,
      gradient: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{
          p: 2,
          width: '100%',
        }}
      >
        <Grid container spacing={2}>
          {cardData.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                elevation={1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: colorMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                }}
              >
                <Box
                  sx={{
                    height: '8px',
                    width: '100%',
                    backgroundImage: item.gradient,
                  }}
                />
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 3,
                  }}
                >
                  {loading ? (
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Skeleton variant="circular" width={56} height={56} animation="wave" />
                      <Box sx={{ width: '100%' }}>
                        <Skeleton width="60%" height={36} animation="wave" />
                        <Skeleton width="80%" height={24} animation="wave" />
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1.5,
                          borderRadius: '50%',
                          backgroundColor: colorMode === 'light' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(144, 202, 249, 0.08)',
                          width: 56,
                          height: 56,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h5" fontWeight={600} mb={0.5}>
                          {item.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.title}
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default GICForexStatus;