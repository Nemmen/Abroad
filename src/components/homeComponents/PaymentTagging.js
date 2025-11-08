import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import flywireLogo from "../../assets/img/home/flywireLogo.png";
import cibcLogo from "../../assets/img/home/cibcLogo.png";
import convera from "../../assets/img/home/convera.png";

export default function PaymentTagging() {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? 'hsl(210, 98%, 48%)' : 'hsl(210, 98%, 48%)';
  
  return (
    <Box
      id="payment-tagging"
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
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '4rem', mb: 2 }}>💳</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>Payment</Typography>
                  <Typography sx={{ color: 'white', fontSize: '1rem' }}>Tagging</Typography>
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
                  <Typography sx={{ color: '#667eea', fontWeight: 'bold', fontSize: '0.8rem' }}>PAY</Typography>
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
              Maximize Your Earnings with Payment Tagging!
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
              Are you looking for a way to streamline your payment processes and earn commissions? Look no further! We offer payment tagging solutions with top partners.
            </Typography>

            {/* Partners Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={flywireLogo}
                    alt="Flywire"
                    sx={{
                      height: '40px',
                      width: 'auto',
                      objectFit: 'contain',
                      mb: 2
                    }}
                  />
                  {/* <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Flywire
                  </Typography> */}
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.5 }}>
                    A global leader in cross-border payments, enabling you to track payments, reduce costs, and improve efficiency.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                    <Box
                    component="img"
                    src={convera}
                    alt="Flywire"
                    sx={{
                      height: '40px',
                      width: 'auto',
                      objectFit: 'contain',
                      mb: 2
                    }}
                  />
                  {/* <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    Convera
                  </Typography> */}
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.5 }}>
                    A leading provider of global payment solutions offering fast, secure, and transparent cross-border payments in multiple currencies.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={cibcLogo}
                    alt="CIBC"
                    sx={{
                      height: '30px',
                      width: 'auto',
                      objectFit: 'contain',
                      mb: 2
                    }}
                  />
                  {/* <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 1, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
                    CIBC
                  </Typography> */}
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.5 }}>
                    A major Canadian bank offering a range of secure and reliable payment solutions for individuals and businesses.
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Benefits */}
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary,
                mb: 3
              }}
            >
              Tag Your Payments and Earn Commissions!
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Earn Commissions: Get rewarded for your payments with our easy and simple process
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Streamline Your Payments: Track and manage your payments efficiently with our partners
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                ✓ Improve Transparency: Get clear visibility into your payment transactions
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* How It Works Section */}
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
            How It Works
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%', textAlign: 'center' }}>
                <Typography sx={{ color: textColor, fontWeight: 'bold', fontSize: '2rem', mb: 2 }}>1</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Create Payment Instructions
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Create or share payment instruction letters with our partners.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%', textAlign: 'center' }}>
                <Typography sx={{ color: textColor, fontWeight: 'bold', fontSize: '2rem', mb: 2 }}>2</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Tag Your Payments
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Tag your payments to track and manage them efficiently.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, backgroundColor: 'white', borderRadius: 3, boxShadow: 2, height: '100%', textAlign: 'center' }}>
                <Typography sx={{ color: textColor, fontWeight: 'bold', fontSize: '2rem', mb: 2 }}>3</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textColor, mb: 2 }}>
                  Earn Commissions
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Earn commissions on your payments.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: textColor, fontWeight: 'bold' }}>
              Get Started Today! Contact us to learn more about our payment tagging solutions and start earning commissions on your payments.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}