import { Box, Typography, ThemeProvider, createTheme } from '@mui/material';
import { useColorMode } from '@chakra-ui/react'; // Import Chakra's color mode hook
import React from 'react';
import bgImg from 'assets/img/layout/bgImg.png';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

const columns = [
    { field: 'studentCode', headerName: 'Student Code', width: 70 },
    { field: 'studentName', headerName: 'Student Name', width: 150 },
    { field: 'accOpeningMonth', headerName: 'Acc Opening Month', width: 150 },
    { field: 'passportNo', headerName: 'Passport No.', width: 130 },
    { field: 'studentPhoneNo', headerName: 'Student Contact', width: 130 },
    { field: 'bankVendor', headerName: 'Bank Vendor', width: 150 },
    { field: 'accFundingMonth', headerName: 'Acc Funding Month', width: 160 },
    { field: 'commissionAmt', headerName: 'Commission Amt', width: 140 },
    { field: 'tds', headerName: 'TDS', width: 100 },
    { field: 'netPayable', headerName: 'Net Payable', width: 140 },
    { field: 'commissionStatus', headerName: 'Commission Status', width: 160 },
  ];

const StudentPage = () => {
     const { colorMode } = useColorMode();
        const [rows, setRows] = React.useState([]);
        const [data, setData] = React.useState([]);
      // Create a dynamic MUI theme based on the Chakra color mode
      const muiTheme = React.useMemo(
        () =>
          createTheme({
            palette: {
              mode: colorMode, // This sets the theme mode based on Chakra's color mode ('light' or 'dark')
              primary: {
                main: colorMode === 'light' ? '#000000' : '#ffffff', // Black in light mode, white in dark mode
              },
              background: {
                default: colorMode === 'light' ? '#ffffff' : '#121212', // White background for light, dark for dark mode
                paper: colorMode === 'light' ? '#f0f0f0' : '#1e1e1e', // Slightly darker paper background in dark mode
              },
              text: {
                primary: colorMode === 'light' ? '#000000' : '#ffffff', // Black text for light, white for dark mode
                secondary: colorMode === 'light' ? '#4f4f4f' : '#b0b0b0', // Secondary text color
              },
            },
            components: {
              MuiDataGrid: {
                styleOverrides: {
                  root: {
                    border: '1px solid',
                    borderColor: colorMode === 'light' ? '#000000' : '#ffffff', // Border color adjusts based on the mode
                  },
                },
              },
            },
          }),
        [colorMode] // Recompute the theme when the color mode changes
      );
    

  return (
    <div>
      <ThemeProvider theme={muiTheme}>
            <Box sx={{ mt: 2, width: '100%'}}>
      
              {/* Welcome Banner */}
              
              <Box 
                sx={{
                  backgroundColor: '#11047A', // Updated banner background color
                  color: colorMode === 'light' ? '#ffffff' : '#ffffff', // Keep the text white for good contrast
                  padding: '96px', 
                  borderRadius: '8px',
                  backgroundImage: `url(${bgImg})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'right', // Position the image to the right
                  mb: 3
                }}
              >
                <Typography variant="h3" component="h1" align="start" fontWeight="bold">
                  Manage Your Students Here!
                </Typography>
                <Typography variant="body1" align="start">
                  Manage your students' data with ease. Here’s a quick overview of your records.
                </Typography>
              </Box>
            </Box>
          </ThemeProvider>
          <div>

          </div>
    </div>
  );
};

export default StudentPage;
