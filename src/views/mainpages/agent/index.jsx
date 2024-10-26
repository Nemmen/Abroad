import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, ThemeProvider, createTheme } from '@mui/material';
import { useColorMode } from '@chakra-ui/react'; // Import Chakra's color mode hook

export default function Index() {
  // Use Chakra's color mode to determine if it's light or dark
  const { colorMode } = useColorMode();

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

  // Pagination settings
  const paginationModel = { page: 0, pageSize: 5 };

  // Column definitions
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) => {
        if (params && params.row) {
          return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
        }
        return ''; // Return empty string if params or row is undefined
      },
    },
  ];

  // Row data
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ mt: 10, width: '100%' }}>

        {/* Welcome Banner */}
        
        <Box 
          sx={{
            backgroundColor: '#11047A', // Updated banner background color
            color: colorMode === 'light' ? '#ffffff' : '#ffffff', // Keep the text white for good contrast
            padding: '48px', 
            borderRadius: '8px',
            mb: 3
          }}
        >
          <Typography variant="h4" component="h1" align="center" fontWeight="bold">
            Welcome to Your Dashboard!
          </Typography>
          <Typography variant="body1" align="center">
            Manage your data with ease. Here’s a quick overview of your records.
          </Typography>
        </Box>

        {/* DataGrid Table */}
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
