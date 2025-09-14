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
              Blocked Accounts for Germany – Fast, Secure, Embassy-Accepted
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary, mb: 3 }}>
              Prove your financial means with ease. Our Fintiba-powered Blocked Account services are designed for students moving to Germany—fully compliant, reliable, and stress-free.
            </Typography>
            <ul style={{ paddingLeft: '20px', color: theme.palette.text.primary, marginBottom: '20px' }}>
              <li>
                <Typography variant="body1" className='text-md' gutterBottom>
                  <span className="font-bold" style={{ color: textColor }}>100% Compliance:</span> German embassies accept Fintiba at Sutor Bank.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" className='text-md' gutterBottom>
                  <span className='font-bold' style={{ color: textColor }}>Quick Digital Setup:</span> Get instant blocking confirmation online.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" className='text-md' gutterBottom>
                  <span className='font-bold' style={{ color: textColor }}>Safe & Secure:</span> Deposits protected up to €100,000.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" className='text-md' gutterBottom>
                  <span className='font-bold' style={{ color: textColor }}>Fintiba Plus Option:</span> Add health insurance for a complete student package.
                </Typography>
              </li>
            </ul>
            <Typography variant="body1" sx={{ mt: 2, color: textColor, fontWeight: 'bold' }}>
              Open your Blocked Account today—simple, secure, and fully recognized.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary, mt: 2 }}>
              Early Commission disbursement.
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
              Full Support in Refunds.
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
