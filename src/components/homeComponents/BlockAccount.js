import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import BlockAccountImg from "../../assets/img/home/BlockAccountImg.png";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function BlockAccount() {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'hsl(210, 98%, 48%)' : '';
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      id="BlockAccount"
      sx={{
        py: 4,
        px: 2,
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '1200px',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Conditionally Render Image on Small Screens */}
          {isSmallScreen && (
            <Grid item xs={12}>
              <Box
                sx={{
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
                  src={BlockAccountImg}
                  alt="GIC Image"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '500px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Grid>
          )}

          {/* Text Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
              Your Trusted Solution for Blocked Accounts
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: "hsl(210, 98%, 48%)" }}>
              Fast. Easy. Reliable.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
              Streamlined Blocked Account Services You Can Count On
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}>
              Simplify the process of setting up and managing Blocked Accounts for international students:
            </Typography>
            <ul style={{ paddingLeft: '20px', color: theme.palette.text.primary }}>
              <li>
                <Typography variant="body1" className='text-md'>
                  <span className="font-bold" style={{ color: textColor }}>Quick Approvals:</span> Partnered with reliable local banks for faster blocking confirmation.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" className='text-md'>
                  <span className='font-bold' style={{ color: textColor }}>No City Registration Needed:</span> Easy access to funds upon arrival in Germany.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" className='text-md'>
                  <span className='font-bold' style={{ color: textColor }}>Guided Process:</span> Multi-language support and app-based navigation for your journey.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" className='text-md'>
                  <span className='font-bold' style={{ color: textColor }}>Instant Confirmation:</span> Receive prompt account opening confirmation through our trusted partners.
                </Typography>
              </li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.primary }}>
              Facilitate an easy GIC Blocked Account setup for a seamless visa application experience.
            </Typography>
          </Grid>

          {/* Render Image on Medium and Larger Screens */}
          {!isSmallScreen && (
            <Grid item xs={12} md={6}>
              <Box
                sx={{
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
                  src={BlockAccountImg}
                  alt="GIC Image"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '500px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
