import * as React from 'react';
import { Box, Typography, ThemeProvider, createTheme } from '@mui/material';
import { useColorMode } from '@chakra-ui/react'; // Import Chakra's color mode hook
import AgentStats from './AgentStats';
import AgentEarnings from './AgentEarnings';

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
    [colorMode], // Recompute the theme when the color mode changes
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <div>
        
      </div>
      <Box sx={{ mt: 3, width: "100%" }}>
  {/* Welcome Banner */}
  <Box
    sx={{
      backgroundColor: "#11047A",
      color: "#ffffff",
      px: { xs: 3, sm: 6, md: 12 }, // Responsive padding (Left/Right)
      py: { xs: 6, sm: 8, md: 10 }, // Responsive padding (Top/Bottom)
      borderRadius: "8px",
      mb: 3,
      textAlign: "center", // Ensures center alignment
    }}
  >
    <Typography
      variant="h3"
      sx={{
        fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" }, // Responsive font sizes
        fontWeight: "bold",
      }}
    >
      Welcome to Your Dashboard!
    </Typography>

    <Typography
      variant="body1"
      sx={{
        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" }, // Adjusts for readability
        mt: { xs: 1, sm: 2 }, // Adds spacing on smaller screens
      }}
    >
      Manage your data with ease. Here's a quick overview of your records.
    </Typography>
  </Box>
</Box>

      <div>
        <AgentStats />
      </div>
      <div>
        <AgentEarnings />
      </div>
    </ThemeProvider>
  );
}
