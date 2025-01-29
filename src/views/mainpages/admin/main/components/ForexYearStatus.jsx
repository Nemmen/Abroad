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

export function ForexYearStatus() {
  const [graphData, setGraphData] = useState({ xAxis: [], series: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://127.0.0.1:4000/admin/getYearlyForexData');
        const { xAxis, series } = response.data;

        // Map xAxis from "YYYY-MM" to month names
        const mappedXAxis = xAxis.map(date => {
          const [year, month] = date.split('-');
          return new Date(year, month - 1).toLocaleString('default', { month: 'long' });
        });

        setGraphData({ xAxis: mappedXAxis, series });
        // console.log('Yearly graph data:', { xAxis: mappedXAxis, series });
      } catch (error) {
        console.error('Error fetching yearly graph data:', error);
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
            Forex Yearly Status
          </Typography>
        </Box>

        {/* Line Chart Section */}
        <Box
          sx={{
            overflowX: 'scroll',
            scrollbarWidth: 'thin',
            width: '100%',
            maxWidth: '800px',
            p: 3,
            bgcolor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          {graphData.xAxis.length > 0 && graphData.series.length > 0 ? (
            <LineChart
              xAxis={[
                {
                  data: graphData.xAxis, // Months of the year
                  label: 'Months',
                  scaleType: 'point',
                  labelStyle: { angle: 0, anchor: 'end' }, // Rotate labels for better readability
                },
              ]}
              series={[
                {
                  data: graphData.series, // Number of forex transactions per month
                  label: 'Past 12 months Forex Entries',
                  color: '#3f51b5',
                },
              ]}
              width={600}
              height={300}
            />
          ) : (
            <Typography
              sx={{
                color: '#999',
                textAlign: 'center',
                fontSize: '16px',
              }}
            >
              No data available to display.
            </Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
