import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import forex from "../../assets/img/home/forexImg.png";

export default function Forex() {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'hsl(210, 98%, 48%)' : '';
  return (
    <Box
      id="forex"
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
                src={forex}
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
            Your Go-To Portal for Forex Needs  


            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: "hsl(210, 98%, 48%)" }}>
            Secure. Competitive. Convenient.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
            
Streamline your international transactions with effortless solutions.
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight:"bold" }}>
            
Simplify your foreign exchange transactions with seamless integration:  
 
            </Typography>
            <ul style={{ paddingLeft: '20px', color: theme.palette.text.primary }}>
              <li>
                <Typography variant="body" className='text-md' >
                <span className="font-bold"  style={{ color: textColor }}>Best Exchange Rates:</span> Competitive forex rates with no hidden charges.  


                </Typography>
              </li>
              <li>
                <Typography variant="body" className='text-md' >
                <span className='font-bold' style={{ color: textColor }}>Secure Transactions:</span> Guaranteed safety with every transaction.  

                </Typography>
              </li>
              <li>
                <Typography variant="body" className='text-md' >
                <span className='font-bold' style={{ color: textColor }}>Quick Transfers:</span>  Local and international transfers made easy.  

                </Typography>
              </li>
              <li>
                <Typography variant="body" className='text-md' >
                <span className='font-bold' style={{ color: textColor }}>Integrated Portal:</span> Manage all forex needs alongside other services.  

                </Typography>
              </li>
            </ul>
            <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.primary }}>
         
Handle forex for students, businesses, or personal use – all in one place.

            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
