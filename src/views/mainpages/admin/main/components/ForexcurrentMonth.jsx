import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  CardHeader,
  Skeleton,
  useMediaQuery
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';

export default function ForexCurrentMonth() {
  const [graphData, setGraphData] = useState({ xAxis: [], series: [] });
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

  // Use media query with the created theme
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get('https://abroad-backend-gray.vercel.app/admin/getCurrentMonthForex');
        const { month, totalEntries } = response.data;

        // Prepare data for the graph
        const currentDate = new Date();
        const daysInMonth = Math.min(
          new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
          31
        );
        const xAxis = Array.from({ length: daysInMonth }, (_, i) => i + 1); // Days of the month
        const series = Array(daysInMonth).fill(0);
        series[0] = totalEntries; // Map total entries to the first day (example adjustment)

        setGraphData({ xAxis, series });
      } catch (error) {
        console.error('Error fetching graph data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Card 
        elevation={1}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={600}>
              Forex Current Month Snapshot
            </Typography>
          }
          sx={{
            backgroundImage: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
            color: 'white',
            pb: 2,
          }}
        />
        <CardContent 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: colorMode === 'light' ? '#f1f1f1' : '#333',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#3B82F6',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#2563EB',
            },
            // Firefox scrollbar styling
            scrollbarWidth: 'thin',
            scrollbarColor: '#3B82F6 transparent',
          }}
        >
          {loading ? (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={300} animation="wave" />
            </Box>
          ) : graphData.xAxis.length > 0 ? (
            <Box 
              sx={{ 
                width: '100%',
                minWidth: isMobile ? 300 : 500,
                maxWidth: '100%'
              }}
            >
              <LineChart
                xAxis={[
                  {
                    data: graphData.xAxis,
                    label: 'Days of the Month',
                    scaleType: 'point',
                    tickLabelStyle: {
                      fontSize: 12,
                      fill: theme.palette.text.secondary,
                    },
                  },
                ]}
                series={[
                  {
                    data: graphData.series,
                    label: 'Number of Forex Transactions',
                    color: theme.palette.chart.line,
                    curve: 'monotoneX',
                    area: true,
                    showMark: false,
                  },
                ]}
                width={isMobile ? 350 : 600}
                height={300}
                margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
                sx={{
                  '.MuiLineElement-root': {
                    strokeWidth: 2,
                  },
                  '.MuiAreaElement-root': {
                    fillOpacity: 0.1,
                  },
                  '.MuiChartsAxis-tickLabel': {
                    fontSize: '0.75rem',
                  },
                  '.MuiChartsAxis-line': {
                    stroke: theme.palette.text.secondary,
                  },
                  '.MuiChartsAxis-tick': {
                    stroke: theme.palette.text.secondary,
                  },
                  '.MuiChartsAxis-grid': {
                    stroke: theme.palette.chart.grid,
                    strokeDasharray: '3 3',
                  },
                }}
              />
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ py: 10 }}>
              No data available for the current month
            </Typography>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}