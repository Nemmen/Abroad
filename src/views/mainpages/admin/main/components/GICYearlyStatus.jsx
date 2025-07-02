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

export default function GICYearlyStatus() {
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

  // Use direct media query for responsiveness
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get('https://abroad-backend-gray.vercel.app/admin/getYearlyGICData');
        const { xAxis, series } = response.data;

        // Map xAxis from "YYYY-MM" to abbreviated month names
        const mappedXAxis = xAxis.map(date => {
          const [year, month] = date.split('-');
          return new Date(year, month - 1).toLocaleString('default', { month: 'short' });
        });

        setGraphData({ xAxis: mappedXAxis, series });
      } catch (error) {
        console.error('Error fetching yearly GIC data:', error);
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
              GIC Yearly Status
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
          ) : graphData.xAxis.length > 0 && graphData.series.length > 0 ? (
            <Box 
              sx={{ 
                width: '100%',
                minWidth: isMobile ? 300 : 500,
                maxWidth: '100%'
              }}
            >
              <LineChart
                xAxis={[{
                  data: graphData.xAxis,
                  label: 'Months',
                  scaleType: 'point',
                  tickLabelStyle: {
                    fontSize: 12,
                    fill: theme.palette.text.secondary,
                  },
                }]}
                series={[{
                  data: graphData.series,
                  label: 'Past 12 Months GIC Registrations',
                  color: theme.palette.chart.line,
                  curve: 'monotoneX',
                  area: true,
                  showMark: true,
                }]}
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
                  '.MuiMarkElement-root': {
                    stroke: 'white',
                    strokeWidth: 2,
                    fill: theme.palette.chart.line,
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
              No data available to display
            </Typography>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}