import * as React from 'react';
import { Box, Typography, ThemeProvider, createTheme, Paper } from '@mui/material';
import { useColorMode } from '@chakra-ui/react'; // Import Chakra's color mode hook
import AgentStats from './AgentStats';
import AgentEarnings from './AgentEarnings';
import DashboardCharts from './DashboardCharts';

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
      <Box sx={{ mx: 'auto', maxWidth: '1400px' }}>
        <Box sx={{ mt: 3, width: "100%" }}>
          <Paper 
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
              color: "#ffffff",
              px: { xs: 3, sm: 6, md: 8 },
              py: { xs: 6, sm: 7, md: 8 },
              borderRadius: "16px",
              mb: 4,
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "2.75rem" },
                fontWeight: "700",
                letterSpacing: "-0.5px"
              }}
            >
              Welcome to Your Dashboard!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                mt: { xs: 1, sm: 2 },
                opacity: 0.9,
                maxWidth: "700px",
                mx: "auto" 
              }}
            >
              Manage your data with ease. Here's a quick overview of your records.
            </Typography>
          </Paper>
        </Box>

        <AgentStats />
        <AgentEarnings />
        <DashboardCharts />
      </Box>
    </ThemeProvider>
  );
}