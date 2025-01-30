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
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: '#3f51b5',
          },
          '&:hover fieldset': {
            borderColor: '#303f9f',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#303f9f',
            borderWidth: '2px',
          },
        },
      },
    },
  },
});

export default function GICcurrentMonth() {
  const [graphData, setGraphData] = useState({ xAxis: [], series: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://127.0.0.1:4000/admin/getCurrentMonthGICs');
        const { xAxis, series } = response.data;

        // Update the graph data state
        setGraphData({ xAxis, series });
      } catch (error) {
        console.error('Error fetching GIC data:', error);
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
            GIC Current Month Snapshot
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
            borderRadius: '0px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <LineChart
            xAxis={[{ data: graphData.xAxis, label: 'Days of the Month' }]}
            series={[{ data: graphData.series, label: 'GIC Transactions', color: '#3f51b5' }]}
            width={600}
            height={300}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
