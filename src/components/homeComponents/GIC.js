import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
// import prashant from "../../assets/img/home/prashant.png"
import gic from '../../assets/img/home/gicImage.jpg'
import iciciBankLogo from '../../assets/img/home/iciciBankLogo.png';
import rbcLogo from '../../assets/img/home/rbcLogo.png';

export default function GIC() {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'hsl(210, 98%, 48%)' : 'hsl(210, 98%, 48%)';
  return (
    <Box
      id="GIC"
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
              Effortless GIC Account Management – Simplified. Transparent. Trustworthy.
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
              Managing your Guaranteed Investment Certificate (GIC) is now easier than ever. With our trusted bank partnerships, we ensure a smooth, secure, and fast process for students heading to Canada.
            </Typography>

            {/* Key Features Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Quick Setup
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Instant account number in India and fast GIC blocking confirmation.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Real-Time Tracking
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Stay updated with live status on applications and fund disbursements.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    One Dashboard
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    View all your GIC details, timelines, and documents in a single platform.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Trusted Partners
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Seamlessly bank with ICICI Bank Canada & RBC.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Box
                      component="img"
                      src={iciciBankLogo}
                      alt="ICICI Bank Canada"
                      sx={{
                        height: '25px',
                        width: 'auto',
                        objectFit: 'contain',
                      }}
                    />
                    <Box
                      component="img"
                      src={rbcLogo}
                      alt="RBC"
                      sx={{
                        height: '34px',
                        width: 'auto',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
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
                Start your student journey with confidence—secure your GIC effortlessly today.
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
                  src={gic}
                  alt="GIC Account Management"
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
                  <Typography sx={{ color: '#667eea', fontWeight: 'bold', fontSize: '1rem' }}>GIC</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Student Accounts Section */}
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
            Student Accounts with ICICI Bank Canada & RBC
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Instant Account Opening in India
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Get your account number in just 5 minutes and begin funding right away.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Convenient Fund Transfers
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Accepts transfers from parents, siblings, or spouse.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Flexible Limits
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Get all your GIC in one shot after reaching Canada or can opt for installments.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Seamless Arrival Banking
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Activate your linked RBC Student Account easily upon reaching Canada.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Wide Network Access
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Enjoy banking across 1,200+ branches and 4,200+ ATMs nationwide.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Our Partners */}
        <Box sx={{ mt: 6, textAlign: 'center', p: 4, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 4 }}>
            Our Partners
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Box
              component="img"
              src={iciciBankLogo}
              alt="ICICI Bank Canada"
              sx={{
                height: '30px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Box
              component="img"
              src={rbcLogo}
              alt="RBC"
              sx={{
                height: '40px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Box
              component="img"
              src={require('../../assets/img/home/cibcLogo.png')}
              alt="CIBC"
              sx={{
                height: '25px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}