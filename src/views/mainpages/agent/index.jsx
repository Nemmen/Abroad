import * as React from 'react';
import { Box, Typography, ThemeProvider, createTheme } from '@mui/material';
import { useColorMode } from '@chakra-ui/react'; // Import Chakra's color mode hook
import AgentStats from './AgentStats';

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

 
  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ mt: 3, width: '100%' }}>

        {/* Welcome Banner */}
        
        <Box 
          sx={{
            backgroundColor: '#11047A', // Updated banner background color
            color: colorMode === 'light' ? '#ffffff' : '#ffffff', // Keep the text white for good contrast
            padding: '96px', 
            borderRadius: '8px',
            mb: 3
          }}
        >
          <Typography variant="h3" component="h1" align="center" fontWeight="bold">
            Welcome to Your Dashboard!
          </Typography>
          <Typography variant="body1" align="center">
            Manage your data with ease. Here’s a quick overview of your records.
          </Typography>
        </Box>
      </Box>
      <div>
        <AgentStats/>
      </div>
    </ThemeProvider>
  );
}
