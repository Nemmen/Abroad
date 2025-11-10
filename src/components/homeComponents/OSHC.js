import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';

export default function OSHC() {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'hsl(210, 98%, 48%)' : 'hsl(210, 98%, 48%)';
  
  return (
    <Box
      id="oshc"
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
              What is OSHC?
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
              Overseas Student Health Cover (OSHC) is a type of health insurance required for international students studying in Australia. It provides coverage for medical expenses, hospital stays, and other health-related costs.
            </Typography>

            {/* Benefits Grid */}
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary,
                mb: 3
              }}
            >
              Benefits of OSHC:
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Medical Care Access
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Access to medical care in Australia
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Hospital Coverage
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Coverage for hospital stays and medical procedures
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Prescription Coverage
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Prescription medication coverage
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Emergency Transport
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Emergency ambulance transport
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Why Choose Our OSHC Plans */}
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary,
                mb: 3
              }}
            >
              Why Choose Our OSHC Plans:
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Competitive Rates: Our partners offer affordable OSHC plans to fit your budget
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Easy and Quick Process: Apply online or through our office, and get your OSHC coverage in no time
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ End-to-End Support: Our team provides assistance throughout the application process and during your stay in Australia
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Comprehensive Coverage: Our OSHC plans provide extensive coverage for medical expenses, hospital stays, and more
              </Typography>
              <Typography variant="body1" sx={{ color: textColor, fontWeight: 'bold', mt: 2 }}>
                Get Your OSHC Today! Contact us to learn more about our OSHC plans and get a quote.
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
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '4rem', mb: 2 }}>🏥</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>OSHC</Typography>
                  <Typography sx={{ color: 'white', fontSize: '1rem' }}>Health Cover</Typography>
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
                  <Typography sx={{ color: '#667eea', fontWeight: 'bold', fontSize: '0.8rem' }}>AUS</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Top OSHC Providers Section */}
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
            Top OSHC Providers in Australia
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  AHM (Australian Health Management)
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Offers affordable and comprehensive OSHC plans with a wide range of benefits.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Bupa
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Provides global healthcare expertise with tailored OSHC solutions, including coverage for pre-existing conditions.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Medibank
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  A trusted Australian health insurer with competitive OSHC rates and comprehensive coverage.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Allianz
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Offers world-class OSHC coverage with 24/7 assistance and a range of benefits, including medical evacuation.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}