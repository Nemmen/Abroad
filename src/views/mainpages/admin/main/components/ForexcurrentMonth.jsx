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

export default function ForexcurrentMonth() {



  const data = {
  
    
      xAxis: [1, 2, 3, 4, 5],
      series: [2, 6, 4, 8, 5]
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
            Forex Current Month snapshot
          </Typography>
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
            xAxis={[{ data: data.xAxis }]}
            series={[{ data: data.series }]}
            width={600}
            height={300}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
