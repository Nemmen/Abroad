import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#303f9f',
    },
  },
});

export default function GICYearlyStatus() {
  const [graphData, setGraphData] = useState({ xAxis: [], series: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://127.0.0.1:4000/admin/getYearlyGICData');
        const { xAxis, series } = response.data;

        // Map xAxis from "YYYY-MM" to abbreviated month names
        const mappedXAxis = xAxis.map(date => {
          const [year, month] = date.split('-');
          return new Date(year, month - 1).toLocaleString('default', { month: 'short' });
        });

        // console.log('Mapped xAxis:', mappedXAxis); // Add console log to verify xAxis mapping
        // console.log('Series data:', series); // Add console log to verify series data

        setGraphData({ xAxis: mappedXAxis, series });
        
      } catch (error) {
        console.error('Error fetching yearly GIC data:', error);
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
          p: 2,
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
            borderRadius: '0px',
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
            GIC Yearly Status
          </Typography>
        </Box>

        {/* Line Chart Section */}
        <Box
          sx={{
            width: '100%',
            overflowX: 'scroll',
            scrollbarWidth: 'thin',
            maxWidth: '800px',
            p: 3,
            bgcolor: '#ffffff',
            borderRadius: '0px',
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
                  data: graphData.series,
                  label: 'Past 12 Months GIC Registrations',
                  color: '#3f51b5',
                  points: {
                    show: true, // Show points on the graph
                  },
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
