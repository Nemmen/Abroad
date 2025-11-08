import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';

export default function FinanceSupport() {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'hsl(210, 98%, 48%)' : 'hsl(210, 98%, 48%)';
  
  return (
    <Box
      id="finance-support"
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
              Need Finance Support? We've Got You Covered!
            </Typography>
            
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: theme.palette.text.secondary, 
                mb: 4,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Are you struggling with a fund issue? Do you have dreams to chase, but financial constraints holding you back? Look no further! Our seamless finance solutions are here to support you.
            </Typography>

            {/* Features Grid */}
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary,
                mb: 3
              }}
            >
              Get the Funding You Need with:
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Hassle-Free Process
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Quick and easy application process to get you the funds you need fast.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Simple & Transparent
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Clear terms and conditions, no hidden fees or surprises.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Lowest Interest Rates
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Competitive rates to help you save money and achieve your goals.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Expert Support
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Our team is here to guide you every step of the way, from application to repayment.
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Why Choose Our Finance Solutions */}
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary,
                mb: 3
              }}
            >
              Why Choose Our Finance Solutions?
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Seamless Application Process: Get a decision quickly and easily, so you can focus on what matters most
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Expert Support: Our team is here to guide you every step of the way
              </Typography>
              <Typography variant="body1" sx={{ color: textColor, fontWeight: 'bold', mt: 2 }}>
                Chase Your Dreams with Confidence
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                Don't let financial constraints hold you back. Contact our team today to learn more about our finance solutions and get the support you need to achieve your goals.
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
                  sx={{
                    width: '95%',
                    height: '95%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '4rem', mb: 2 }}>💰</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>Finance</Typography>
                  <Typography sx={{ color: 'white', fontSize: '1rem' }}>Support</Typography>
                </Box>
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
                  <Typography sx={{ color: '#667eea', fontWeight: 'bold', fontSize: '0.8rem' }}>FUND</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Benefits Section */}
        <Box sx={{ mt: 8 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
              textAlign: 'center',
              mb: 4
            }}
          >
            Finance Solutions Tailored for You
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%', textAlign: 'center' }}>
                <Typography sx={{ color: textColor, fontWeight: 'bold', fontSize: '3rem', mb: 2 }}>⚡</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Quick Approval
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Get instant decisions and fast fund disbursement to meet your urgent financial needs.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%', textAlign: 'center' }}>
                <Typography sx={{ color: textColor, fontWeight: 'bold', fontSize: '3rem', mb: 2 }}>🛡️</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Secure Process
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Your financial information is protected with bank-grade security and encryption.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%', textAlign: 'center' }}>
                <Typography sx={{ color: textColor, fontWeight: 'bold', fontSize: '3rem', mb: 2 }}>🎯</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Flexible Terms
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Choose repayment terms that work for your budget and financial situation.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: textColor, fontWeight: 'bold' }}>
              Get in Touch Today! Our team is ready to help you achieve your financial goals.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}