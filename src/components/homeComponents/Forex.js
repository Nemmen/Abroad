import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import forex from "../../assets/img/home/forex.jpg";
import flywireLogo from "../../assets/img/home/flywireLogo.png";
import cibcLogo from "../../assets/img/home/cibcLogo.png";

export default function Forex() {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'hsl(210, 98%, 48%)' : 'hsl(210, 98%, 48%)';
  
  return (
    <Box
      id="forex"
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
          {/* Left Side: Image */}
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
                  src={forex}
                  alt="Forex Trading"
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
                  <Typography sx={{ color: theme.palette.mode === 'dark' ? '#90caf9' : '#667eea', fontWeight: 'bold', fontSize: '0.8rem' }}>FX</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side: Text Content */}
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
              Forex Made Simple – Smarter International Transactions
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
              Managing money across borders is now effortless. Our all-in-one foreign exchange solutions are designed to make global payments secure, transparent, and cost-effective.
            </Typography>

            {/* Key Features Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Competitive Rates
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Enjoy the best value with zero hidden charges.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Trusted Security
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Advanced safeguards ensure your funds reach safely, every time.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Fast & Seamless
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Transfer money locally or internationally in just a few clicks.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Unified Dashboard
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.5 }}>
                    Manage all your forex needs alongside other financial services with ease.
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Additional Benefits */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                Fully Transparent process - Make a quote by yourself - Fully Automated process
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Early Commission disbursement
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Save TCS - We can process TCS free Payment from a Single Account
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Full Support in Refunds
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.primary }}>
              Whether you're a student or a Consultant paying tuition overseas, a business handling global operations, or an individual supporting loved ones abroad, our platform ensures convenience, transparency, and complete peace of mind.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: textColor, fontWeight: 'bold' }}>
              Experience smarter forex today—secure, simple, and reliable.
            </Typography>
          </Grid>
        </Grid>

        {/* Partners Section */}
        <Box sx={{ mt: 6, textAlign: 'center', p: 4, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Our Trusted Forex Partners
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box component="img" src={flywireLogo} alt="Flywire" sx={{ width: '100px', height: 'auto' }} />
              
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box component="img" src={cibcLogo} alt="CIBC" sx={{ width: '100px', height: 'auto' }} />
             
            </Box>
          </Box>
          
        </Box>
      </Box>
    </Box>
  );
}
