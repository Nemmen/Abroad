import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { 
  MenuItem, 
  TextField, 
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

export default function DynamicLineChart() {
  const [view, setView] = useState('month');
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [],
  });
  const [loading, setLoading] = useState(false);
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
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '& fieldset': {
              borderColor: colorMode === 'light' ? '#3B82F6' : '#90CAF9',
            },
            '&:hover fieldset': {
              borderColor: colorMode === 'light' ? '#2563EB' : '#60A5FA',
            },
            '&.Mui-focused fieldset': {
              borderColor: colorMode === 'light' ? '#1D4ED8' : '#93C5FD',
              borderWidth: '2px',
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: colorMode === 'light' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(144, 202, 249, 0.16)',
            },
            '&:hover': {
              backgroundColor: colorMode === 'light' ? 'rgba(59, 130, 246, 0.04)' : 'rgba(144, 202, 249, 0.08)',
            },
          },
        },
      },
    },
  });

  // Use direct media query for responsiveness
  const isMobile = useMediaQuery('(max-width:600px)');

  const data = {
    month: {
      xAxis: [1, 2, 3, 4, 5, 6],
      series: [3, 5, 7, 6, 8, 10],
    },
    date: {
      xAxis: [1, 2, 3, 4, 5],
      series: [2, 6, 4, 8, 5],
    },
    yearly: {
      xAxis: [2019, 2020, 2021, 2022, 2023],
      series: [10, 15, 20, 25, 30],
    },
  };

  useEffect(() => {
    // Initialize with default view
    setChartData({
      xAxis: data[view].xAxis,
      series: data[view].series,
    });
  }, []);

  const handleViewChange = (event) => {
    const selectedView = event.target.value;
    setLoading(true);
    
    // Simulate loading state
    setTimeout(() => {
      setView(selectedView);
      setChartData({
        xAxis: data[selectedView].xAxis,
        series: data[selectedView].series,
      });
      setLoading(false);
    }, 500);
  };

  // Chart labels based on view
  const chartLabels = {
    month: 'Days of the Month',
    date: 'Date',
    yearly: 'Year',
  };

  const seriesLabels = {
    month: 'Monthly GIC Transactions',
    date: 'Daily GIC Transactions',
    yearly: 'Yearly GIC Registrations',
  };

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
              GIC Analytics
            </Typography>
          }
          action={
            <TextField
              select
              label="Select View"
              value={view}
              onChange={handleViewChange}
              variant="outlined"
              size="small"
              sx={{
                minWidth: 120,
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem',
                },
              }}
            >
              <MenuItem value="month">Monthly</MenuItem>
              <MenuItem value="date">Daily</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </TextField>
          }
          sx={{
            backgroundImage: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
            color: 'white',
            pb: 2,
            '& .MuiCardHeader-action': {
              margin: 0
            }
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
          ) : chartData.xAxis.length > 0 ? (
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
                    data: chartData.xAxis,
                    label: chartLabels[view],
                    scaleType: view === 'yearly' ? 'linear' : 'point',
                    tickLabelStyle: {
                      fontSize: 12,
                      fill: theme.palette.text.secondary,
                    },
                  },
                ]}
                series={[
                  {
                    data: chartData.series,
                    label: seriesLabels[view],
                    color: theme.palette.chart.line,
                    curve: 'monotoneX',
                    area: true,
                    showMark: true,
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
              No data available for the selected view
            </Typography>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}