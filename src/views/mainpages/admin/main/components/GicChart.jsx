import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { MenuItem, TextField, Box, Typography } from '@mui/material';
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

export default function DynamicLineChart() {
  const [view, setView] = React.useState('month');
  const [chartData, setChartData] = React.useState({
    xAxis: [1, 2, 3, 4],
    series: [2, 4, 6, 8],
  });

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

  const handleViewChange = (event) => {
    const selectedView = event.target.value;
    setView(selectedView);
    setChartData({
      xAxis: data[selectedView].xAxis,
      series: data[selectedView].series,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
       
          minHeight: '',
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
            GIC Analytics
          </Typography>

          {/* Dropdown using TextField */}
          <TextField
            select
            label="Select View"
            value={view}
            onChange={handleViewChange}
            variant="outlined"
            sx={{
              width: '250px',
              backgroundColor: '#ffffff',
              '& .MuiInputLabel-root': {
                fontWeight: 'bold',
              },
            }}
          >
            <MenuItem value="month">Monthly</MenuItem>
            <MenuItem value="date">Daily</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </TextField>
        </Box>

        {/* Line Chart Section */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '800px',
            p: 3,
            bgcolor: '#ffffff',
            borderRadius: '0px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <LineChart
            xAxis={[{ data: chartData.xAxis }]}
            series={[{ data: chartData.series }]}
            width={600}
            height={300}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
