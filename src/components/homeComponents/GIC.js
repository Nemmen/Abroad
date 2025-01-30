import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import gic from "../../assets/img/home/gicImage.png";
import prashant from "../../assets/img/home/prashant.png"
export default function GIC() {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'hsl(210, 98%, 48%)' : '';
  return (
    <Box
      id="GIC"
      sx={{
        py: 4,
        px: 2,
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
        display: 'flex',
        justifyContent: 'center', // Center the section
      }}
    >
      <Box
        sx={{
          width: '90%', // Set width relative to viewport (adjust as needed)
          maxWidth: '1200px', // Match the max width of LogoCollection
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left Side: Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                // width: '160px',
                // height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                margin: '16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#f9f9f9',
              }}
            >
              <Box
                component="img"
                // src={gic}
                src={prashant}
                alt="GIC Image"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Grid>

          {/* Right Side: Text Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Effortless GIC Account Management  

            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: "hsl(210, 98%, 48%)" }}>
            Simplified. Transparent. Trustworthy.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
            Hassle-Free GIC Application and Tracking.
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight:"bold" }}>
            Make GIC services stress-free for agents and students:  
            </Typography>
            <ul style={{ paddingLeft: '20px', color: theme.palette.text.primary }}>
              <li>
                <Typography variant="body" className='text-md' >
                <span className="font-bold"  style={{ color: textColor }}>Easy Applications:</span> Partnered with reliable local banks for faster blocking confirmation.
                </Typography>
              </li>
              <li>
                <Typography variant="body" className='text-md' >
                <span className='font-bold' style={{ color: textColor }}>Real-Time Tracking:</span> Monitor application status and transactions effortlessly.
                </Typography>
              </li>
              <li>
                <Typography variant="body" className='text-md' >
                <span className='font-bold' style={{ color: textColor }}>Reliable Partners:</span>  Collaborate with trusted financial institutions.  
                </Typography>
              </li>
              <li>
                <Typography variant="body" className='text-md' >
                <span className='font-bold' style={{ color: textColor }}>User-Friendly Dashboard:</span> Access and manage all GIC-related data in one place.
                </Typography>
              </li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.primary }}>
            Set up and manage GIC accounts with confidence and convenience.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
