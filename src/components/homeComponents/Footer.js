import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';

// Removed invalid import of SitemarkIcon
// If you want an icon here, replace it with a valid one from @mui/icons-material

function Copyright() {
  return (
    <Typography variant="body2" sx={{ mt: 2 }}>
      {'Copyright © '}
      <Link 
        color="primary" 
        href="https://abrocare.com"
        sx={{ 
          textDecoration: 'none',
          fontWeight: 600,
          color: '#f79b1c',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        AbroCare
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'. All rights reserved.'}
    </Typography>
  );
}

export default function Footer() {
  const handleContactUs = () => {
    // Scroll to enquiry section smoothly
    const enquirySection = document.getElementById('enquiry');
    if (enquirySection) {
      enquirySection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <Box
      component="footer"
      id='contactus'
      sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
        color: (theme) => theme.palette.mode === 'dark' ? 'white' : '#1a1a1a',
        mt: 'auto',
        position: 'relative',
        borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 6, md: 8 } }}>
          {/* Main Footer Content */}
          <Grid container spacing={4}>
            {/* Company Info & Branding */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ 
                    fontSize: '2rem', 
                    mr: 1, 
                    color: '#f79b1c',
                    filter: 'drop-shadow(0 2px 4px rgba(247, 155, 28, 0.3))'
                  }} />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: 'DM Sans, sans-serif',
                      color: '#f79b1c',
                    }}
                  >
                    AbroCare
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.8,
                    lineHeight: 1.7,
                    mb: 3,
                    maxWidth: '350px',
                    fontFamily: 'DM Sans, sans-serif',
                    color: (theme) => theme.palette.mode === 'dark' ? '#E0E5F2' : '#666666',
                    fontSize: '1.1rem'
                  }}
                >
                  Your Global Exposure Partner! Get seamless financial solutions for international students. 
                  Manage GIC, Blocked Accounts, and Forex services with embassy-accepted, transparent, and secure solutions.
                </Typography>
                
                <Button
                  variant="contained"
                  startIcon={<EmailIcon />}
                  onClick={handleContactUs}
                  sx={{
                    backgroundColor: '#f79b1c',
                    color: 'white',
                    fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    borderRadius: '12px',
                    px: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(247, 155, 28, 0.3)',
                    '&:hover': {
                      backgroundColor: '#e6890a',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(247, 155, 28, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Enquiry Now
                </Button>
              </Box>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  color: '#f79b1c',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                Contact Information
              </Typography>
              
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <EmailIcon sx={{ 
                    color: '#f79b1c', 
                    mt: 0.5, 
                    fontSize: '1.3rem',
                    p: 0.5,
                    backgroundColor: 'rgba(247, 155, 28, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(247, 155, 28, 0.2)'
                  }} />
                  <Box>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      opacity: 0.9, 
                      mb: 0.5,
                      color: (theme) => theme.palette.mode === 'dark' ? '#A3AED0' : '#666666',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Email Address
                    </Typography>
                    <Link 
                      href="mailto:manpreet@abrocare.com" 
                      sx={{ 
                        color: (theme) => theme.palette.mode === 'dark' ? '#E0E5F2' : '#333333',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontFamily: 'DM Sans, sans-serif',
                        '&:hover': { 
                          color: '#f79b1c',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      support@abrocare.com
                    </Link>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LocationOnIcon sx={{ 
                    color: '#f79b1c', 
                    mt: 0.5, 
                    fontSize: '1.3rem',
                    p: 0.5,
                    backgroundColor: 'rgba(247, 155, 28, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(247, 155, 28, 0.2)'
                  }} />
                  <Box>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      opacity: 0.9, 
                      mb: 0.5,
                      color: (theme) => theme.palette.mode === 'dark' ? '#A3AED0' : '#666666',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Office Address
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8, 
                        lineHeight: 1.6,
                        fontWeight: 400,
                        color: (theme) => theme.palette.mode === 'dark' ? '#E0E5F2' : '#333333',
                        fontFamily: 'DM Sans, sans-serif'
                      }}
                    >
                      Office Number 04, First Floor<br />
                      La Prisma Market, Nagla Road<br />
                      Zirakpur, 140603, Punjab, India
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Quick Links & Social Media */}
            <Grid item xs={12} md={4}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  color: '#f79b1c',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                Connect With Us
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ 
                  opacity: 0.9, 
                  mb: 2,
                  color: (theme) => theme.palette.mode === 'dark' ? '#A3AED0' : '#666666',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Follow us on social media for updates and tips
                </Typography>
                <Stack direction="row" spacing={2}>
                  <IconButton
                    href="https://www.instagram.com/officialabroadeducares/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: 'rgba(247, 155, 28, 0.1)',
                      color: '#f79b1c',
                      border: '1px solid rgba(247, 155, 28, 0.2)',
                      borderRadius: '12px',
                      p: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(247, 155, 28, 0.2)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(247, 155, 28, 0.3)',
                        color: '#ffffff',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <InstagramIcon sx={{ fontSize: '1.5rem' }} />
                  </IconButton>
                  
                  <IconButton
                    href="https://www.facebook.com/abroadeducares"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: 'rgba(117, 81, 255, 0.1)',
                      color: '#7551FF',
                      border: '1px solid rgba(117, 81, 255, 0.2)',
                      borderRadius: '12px',
                      p: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(117, 81, 255, 0.2)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(117, 81, 255, 0.3)',
                        color: '#ffffff',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <FacebookIcon sx={{ fontSize: '1.5rem' }} />
                  </IconButton>
                  
                  <IconButton
                    href="https://www.linkedin.com/company/abroad-educares/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: 'rgba(66, 42, 251, 0.1)',
                      color: '#422AFB',
                      border: '1px solid rgba(66, 42, 251, 0.2)',
                      borderRadius: '12px',
                      p: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(66, 42, 251, 0.2)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(66, 42, 251, 0.3)',
                        color: '#ffffff',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <LinkedInIcon sx={{ fontSize: '1.5rem' }} />
                  </IconButton>
                </Stack>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ 
                  fontWeight: 600, 
                  opacity: 0.9, 
                  mb: 1.5,
                  color: (theme) => theme.palette.mode === 'dark' ? '#A3AED0' : '#666666',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  Quick Links
                </Typography>
                <Stack spacing={1}>
                  
                  <Link 
                    href="/privacy-policy" 
                    sx={{ 
                      color: (theme) => theme.palette.mode === 'dark' ? '#E0E5F2' : '#333333',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontFamily: 'DM Sans, sans-serif',
                      '&:hover': { 
                        color: '#f79b1c',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    href="/terms-of-service" 
                    sx={{ 
                      color: (theme) => theme.palette.mode === 'dark' ? '#E0E5F2' : '#333333',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontFamily: 'DM Sans, sans-serif',
                      '&:hover': { 
                        color: '#f79b1c',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Terms of Service
                  </Link>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Footer */}
        <Divider sx={{ borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(160, 174, 192, 0.2)' : 'rgba(0, 0, 0, 0.1)' }} />
        <Box 
          sx={{ 
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Copyright />
         
        </Box>
      </Container>
    </Box>
  );
}
