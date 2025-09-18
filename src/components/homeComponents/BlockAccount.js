import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import blocked from "../../assets/img/home/blocked.jpg";
import fintibaLogo from "../../assets/img/home/fintibaLogo.png";
import expatrioLogo from "../../assets/img/home/expartioLogo.png";

export default function BlockAccount() {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'hsl(210, 98%, 48%)' : 'hsl(210, 98%, 48%)';

  return (
    <Box
      id="BlockAccount"
      sx={{
        py: 6,
        px: 2,
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f8fafe',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '1400px',
        }}
      >
        <Grid container spacing={6} alignItems="center">
          {/* Left Side: Text Content */}
          <Grid item xs={12} md={7}>
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.2,
                mb: 3
              }}
            >
              Blocked Accounts for Germany – Fast, Secure, Embassy-Accepted
            </Typography>
            
            <Typography 
              variant="body1" 
              gutterBottom 
              sx={{ 
                color: theme.palette.text.secondary, 
                mb: 4,
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}
            >
              Prove your financial means with ease. Our Fintiba-powered Blocked Account services are designed for students moving to Germany—fully compliant, reliable, and stress-free.
            </Typography>

            {/* Key Features Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: textColor, mb: 1 }}>
                    100% Compliance
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    German embassies accept Fintiba at Sutor Bank.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: textColor, mb: 1 }}>
                    Quick Digital Setup
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Get instant blocking confirmation online.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: textColor, mb: 1 }}>
                    Safe & Secure
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Deposits protected up to €100,000.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: textColor, mb: 1 }}>
                    Fintiba Plus Option
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Add health insurance for a complete student package.
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Additional Benefits */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Early Commission disbursement
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Full Support in Refunds
              </Typography>
              <Typography variant="body1" sx={{ color: textColor, fontWeight: 'bold', mt: 2 }}>
                Open your Blocked Account today—simple, secure, and fully recognized.
              </Typography>
            </Box>
          </Grid>

          {/* Right Side: Image */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '500px',
                  height: '400px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  p: 2,
                }}
              >
                <Box
                  component="img"
                  src={blocked}
                  alt="Blocked Account Germany"
                  sx={{
                    width: '95%',
                    height: '95%',
                    objectFit: 'cover',
                    borderRadius: '16px',
                  }}
                />
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  <Typography sx={{ color: '#667eea', fontWeight: 'bold', fontSize: '0.8rem' }}>Blocked</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Partners Section */}
        <Box sx={{ mt: 6, textAlign: 'center', p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Our Trusted Partners for Germany
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box component="img" src={fintibaLogo} alt="Fintiba" sx={{ width: '100px', height: 'auto' }} />
             
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box component="img" src={expatrioLogo} alt="Expatrio" sx={{ width: '100px', height: 'auto' }} />
              
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
