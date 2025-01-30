import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#303f9f' },
  },
});

export default function ForexCurrentMonth() {
  const [graphData, setGraphData] = useState({ xAxis: [], series: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://abroad-backend-ten.vercel.app/admin/getCurrentMonthForex');
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
        // console.log('Graph data:', { xAxis, series });
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'max-content',
          p: 2,
          alignItems: 'center',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '800px',
            height: '90px',
            mb: 2,
            p: 2,
            bgcolor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            sx={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            Forex Current Month Snapshot
          </Typography>
        </Box>

        {/* Line Chart Section */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '800px',
            overflowX: 'scroll',
            scrollbarWidth: 'thin',
            p: 3,
            bgcolor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <LineChart
            xAxis={[
              {
                data: graphData.xAxis, // Days of the month
                label: 'Days of the Month',
              },
            ]}
            series={[
              {
                data: graphData.series, // Number of forex transactions
                label: 'Number of Forex Transactions',
                color: '#3f51b5',
              },
            ]}
            width={600}
            height={300}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
