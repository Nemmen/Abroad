import React from 'react';
import { Box, Typography } from '@mui/material';

const Banner = () => (
  <Box
    sx={{
      backgroundColor: '#11047A',
      color: '#ffffff',
      padding: '48px',
      borderRadius: '8px',
      mb: 3,
    }}
  >
    <Typography variant="h4" component="h1" align="center" fontWeight="bold">
      Welcome to GIC Page!
    </Typography>
    <Typography variant="body1" align="center">
      Manage your data with ease. Here’s a quick overview of your records.
    </Typography>
  </Box>
);

export default Banner;
