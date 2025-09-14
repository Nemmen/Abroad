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
              Forex Made Simple – Smarter International Transactions
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary, mb: 3 }}>
              Managing money across borders is now effortless. Our all-in-one foreign exchange solutions are designed to make global payments secure, transparent, and cost-effective.
            </Typography>
            <ul style={{ paddingLeft: '20px', color: theme.palette.text.primary, marginBottom: '20px' }}>
              <li>
                <Typography variant="body1" className='text-md' gutterBottom>
                  <span className="font-bold" style={{ color: textColor }}>Competitive Rates:</span> Enjoy the best value with zero hidden charges.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" className='text-md' gutterBottom>
                  <span className='font-bold' style={{ color: textColor }}>Trusted Security:</span> Advanced safeguards ensure your funds reach safely, every time.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" className='text-md' gutterBottom>
                  <span className='font-bold' style={{ color: textColor }}>Fast & Seamless:</span> Transfer money locally or internationally in just a few clicks.
                </Typography>
              </li>
              <li>
                <Typography variant="body1" className='text-md' gutterBottom>
                  <span className='font-bold' style={{ color: textColor }}>Unified Dashboard:</span> Manage all your forex needs alongside other financial services with ease.
                </Typography>
              </li>
            </ul>
            <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
              Fully Transparent process - Make a quote by yourself - Fully Automated process
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
              Early Commission disbursement.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
              Save TCS - We can process TCS free Payment from a Single Account.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
              Full Support in Refunds.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.primary }}>
              Whether you're a student or a Consultant paying tuition overseas, a business handling global operations, or an individual supporting loved ones abroad, our platform ensures convenience, transparency, and complete peace of mind.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: textColor, fontWeight: 'bold' }}>
              Experience smarter forex today—secure, simple, and reliable.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
