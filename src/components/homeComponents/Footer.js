import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function Copyright() {
  return (
    <Typography variant="caption" sx={{ mt: 1 }}>
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
        Abrocare
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'. All rights reserved.'}
    </Typography>
  );
}

export default function Footer() {
  const handleContactUs = () => {
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
        <Box sx={{ py: { xs: 4, md: 5 } }}>
          <Grid container spacing={3}>
            {/* Company Info & Branding */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="AbroCare Logo"
                    sx={{
                      height: 40,
                      width: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    opacity: 0.8,
                    lineHeight: 1.6,
                    mb: 2,
                    display: 'block',
                    maxWidth: '320px',
                    fontFamily: 'DM Sans, sans-serif',
                    color: (theme) => theme.palette.mode === 'dark' ? '#E0E5F2' : '#666666',
                    fontSize: '0.8rem'
                  }}
                >
                  Gateway to global finance! Seamless financial solutions for international students. 
                  GIC, Blocked Accounts, and Forex services.
                </Typography>
                
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<EmailIcon sx={{ fontSize: '0.9rem' }} />}
                  onClick={handleContactUs}
                  sx={{
                    backgroundColor: '#f79b1c',
                    color: 'white',
                    fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    borderRadius: '8px',
                    px: 2,
                    py: 0.8,
                    fontSize: '0.75rem',
                    boxShadow: '0 2px 10px rgba(247, 155, 28, 0.3)',
                    '&:hover': {
                      backgroundColor: '#e6890a',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 15px rgba(247, 155, 28, 0.4)',
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
                variant="body2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: '#f79b1c',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.85rem'
                }}
              >
                Contact Information
              </Typography>
              
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <EmailIcon sx={{ 
                    color: '#f79b1c', 
                    mt: 0.3, 
                    fontSize: '1rem',
                    p: 0.3,
                    backgroundColor: 'rgba(247, 155, 28, 0.1)',
                    borderRadius: '6px',
                    border: '1px solid rgba(247, 155, 28, 0.2)'
                  }} />
                  <Box>
                    <Typography variant="caption" sx={{ 
                      fontWeight: 600, 
                      opacity: 0.9, 
                      mb: 0.3,
                      display: 'block',
                      color: (theme) => theme.palette.mode === 'dark' ? '#A3AED0' : '#666666',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.7rem'
                    }}>
                      Email Address
                    </Typography>
                    <Link 
                      href="mailto:support@abrocare.com" 
                      sx={{ 
                        color: (theme) => theme.palette.mode === 'dark' ? '#E0E5F2' : '#333333',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.75rem',
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

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationOnIcon sx={{ 
                    color: '#f79b1c', 
                    mt: 0.3, 
                    fontSize: '1rem',
                    p: 0.3,
                    backgroundColor: 'rgba(247, 155, 28, 0.1)',
                    borderRadius: '6px',
                    border: '1px solid rgba(247, 155, 28, 0.2)'
                  }} />
                  <Box>
                    <Typography variant="caption" sx={{ 
                      fontWeight: 600, 
                      opacity: 0.9, 
                      mb: 0.3,
                      display: 'block',
                      color: (theme) => theme.palette.mode === 'dark' ? '#A3AED0' : '#666666',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.7rem'
                    }}>
                      Office Address
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.8, 
                        lineHeight: 1.5,
                        fontWeight: 400,
                        color: (theme) => theme.palette.mode === 'dark' ? '#E0E5F2' : '#333333',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.75rem'
                      }}
                    >
                      Office No. 04, First Floor<br />
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
                variant="body2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: '#f79b1c',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.85rem'
                }}
              >
                Connect With Us
              </Typography>
              
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={{ 
                  opacity: 0.9, 
                  mb: 1.5,
                  display: 'block',
                  color: (theme) => theme.palette.mode === 'dark' ? '#A3AED0' : '#666666',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.7rem'
                }}>
                  Follow us on social media
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  <IconButton
                    href="https://www.instagram.com/officialabroadeducares/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(247, 155, 28, 0.1)',
                      color: '#f79b1c',
                      border: '1px solid rgba(247, 155, 28, 0.2)',
                      borderRadius: '8px',
                      p: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(247, 155, 28, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(247, 155, 28, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <InstagramIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                  
                  <IconButton
                    href="https://www.facebook.com/abroadeducares"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(117, 81, 255, 0.1)',
                      color: '#7551FF',
                      border: '1px solid rgba(117, 81, 255, 0.2)',
                      borderRadius: '8px',
                      p: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(117, 81, 255, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(117, 81, 255, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <FacebookIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                  
                  <IconButton
                    href="https://www.linkedin.com/company/abroad-educares/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(66, 42, 251, 0.1)',
                      color: '#422AFB',
                      border: '1px solid rgba(66, 42, 251, 0.2)',
                      borderRadius: '8px',
                      p: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(66, 42, 251, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(66, 42, 251, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <LinkedInIcon sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ 
                  fontWeight: 600, 
                  opacity: 0.9, 
                  mb: 1,
                  display: 'block',
                  color: (theme) => theme.palette.mode === 'dark' ? '#A3AED0' : '#666666',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.7rem'
                }}>
                  Quick Links
                </Typography>
                <Stack spacing={0.5}>
                  <Link 
                    href="/privacy-policy" 
                    sx={{ 
                      color: (theme) => theme.palette.mode === 'dark' ? '#E0E5F2' : '#333333',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
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
                      fontSize: '0.75rem',
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

        <Divider sx={{ borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(160, 174, 192, 0.2)' : 'rgba(0, 0, 0, 0.1)' }} />
        <Box 
          sx={{ 
            py: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Copyright />
        </Box>
      </Container>
    </Box>
  );
}
