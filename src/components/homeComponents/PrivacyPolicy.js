import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import PolicyIcon from '@mui/icons-material/Policy';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppTheme from '../../theme/shared-theme/AppTheme';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  ...theme.applyStyles('dark', {
    background: 'linear-gradient(135deg, rgba(17, 25, 40, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  }),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: 'linear-gradient(45deg, #f79b1c, #ff8c00)',
  color: 'white',
  marginBottom: theme.spacing(2),
  boxShadow: '0 8px 20px rgba(247, 155, 28, 0.3)',
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  marginBottom: theme.spacing(3),
  border: '1px solid rgba(247, 155, 28, 0.1)',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(247, 155, 28, 0.02) 100%)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(247, 155, 28, 0.15)',
  },
  ...theme.applyStyles('dark', {
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(247, 155, 28, 0.05) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  }),
}));

function PrivacyPolicyContent() {
  const handleGoBack = () => {
    window.history.back();
  };

  const sections = [
    {
      title: "Information We Collect",
      icon: <PolicyIcon />,
      content: [
        "Information You Provide Directly: Name, email address, phone number, or any other information you provide through forms or inquiries.",
        "Information We Collect Automatically: Information about how you interact with our Website, such as IP address, browser type, and pages visited."
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <VerifiedUserIcon />,
      content: [
        "To provide and manage our Website and services.",
        "To send you updates, promotional offers, and other communications.",
        "To improve Website functionality, user experience, and overall performance.",
        "To comply with legal obligations and protect against fraud."
      ]
    },
    {
      title: "How We Share Your Information",
      icon: <SecurityIcon />,
      content: [
        "Service Providers: Vendors or contractors who assist us in delivering services.",
        "Legal Authorities: When required to comply with applicable laws or legal processes.",
        "Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred."
      ]
    },
    {
      title: "Your Rights",
      icon: <ContactSupportIcon />,
      content: [
        "Access and Correction: Request access to or correction of your personal information.",
        "Deletion: Request the deletion of your personal data, subject to legal or contractual restrictions.",
        "Opt-Out: Unsubscribe from promotional emails.",
        "Data Portability: Request a copy of your data in a machine-readable format."
      ]
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
          : 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
        py: { xs: 4, md: 8 },
        transition: 'background 0.3s ease'
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{
              mb: 3,
              color: '#f79b1c',
              fontWeight: 600,
              border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(247, 155, 28, 0.3)' : 'none',
              '&:hover': {
                backgroundColor: 'rgba(247, 155, 28, 0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Back to Website
          </Button>
          
          <IconWrapper sx={{ mx: 'auto' }}>
            <PolicyIcon sx={{ fontSize: '2rem' }} />
          </IconWrapper>
          
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #f79b1c, #ff8c00)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2
            }}
          >
            Privacy Policy
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: '1.2rem'
            }}
          >
            Abroad Educares values your privacy and is committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </Typography>
          

        </Box>

        {/* Introduction */}
        <StyledPaper>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'text.primary',
              textAlign: 'center'
            }}
          >
            Please read this policy carefully to understand our views and practices regarding your personal data 
            and how we will treat it. By using our website, you acknowledge that you have read and understood this Privacy Policy.
          </Typography>
        </StyledPaper>

        {/* Main Sections */}
        {sections.map((section, index) => (
          <SectionCard key={index}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f79b1c, #ff8c00)',
                  color: 'white',
                  mr: 2,
                  boxShadow: '0 4px 12px rgba(247, 155, 28, 0.3)',
                }}
              >
                {section.icon}
              </Box>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary'
                }}
              >
                {section.title}
              </Typography>
            </Box>
            
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {section.content.map((item, itemIndex) => (
                <Typography
                  key={itemIndex}
                  component="li"
                  variant="body1"
                  sx={{
                    mb: 1.5,
                    lineHeight: 1.7,
                    color: 'text.secondary',
                    fontSize: '1rem'
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </SectionCard>
        ))}

        {/* Additional Sections */}
        <SectionCard>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
            <SecurityIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#f79b1c' }} />
            Data Security
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary', fontSize: '1rem' }}>
            We implement appropriate technical and organizational measures to protect your information. However, 
            no online platform can guarantee absolute security. Please notify us immediately if you suspect any 
            unauthorized access to your data.
          </Typography>
        </SectionCard>

        <SectionCard>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
            <PolicyIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#f79b1c' }} />
            Third-Party Links
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary', fontSize: '1rem' }}>
            Our Website may contain links to third-party websites. We are not responsible for the privacy practices 
            of these external sites. We encourage you to review their privacy policies before providing personal information.
          </Typography>
        </SectionCard>

        <SectionCard>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
            <VerifiedUserIcon sx={{ mr: 2, verticalAlign: 'middle', color: '#f79b1c' }} />
            Updates to This Policy
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary', fontSize: '1rem' }}>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated 
            "Effective Date." We encourage you to review this policy periodically to stay informed.
          </Typography>
        </SectionCard>

        {/* Contact Section */}
        <StyledPaper sx={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#f79b1c',
              mb: 3
            }}
          >
            Contact Us
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontSize: '1.1rem'
            }}
          >
            If you have any questions or concerns about this Privacy Policy, please contact us:
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              gap: 4,
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EmailIcon sx={{ color: '#f79b1c', mr: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                support@abroadeducares.com
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhoneIcon sx={{ color: '#f79b1c', mr: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                +91-9501919187, +91-8143900003
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ color: '#f79b1c', mt: 0.5 }} />
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.6
              }}
            >
              SCO No. 4, First Floor, La Prisma Market,<br />
              Nagla Rd, Zirakpur, Punjab 140603
            </Typography>
          </Box>
        </StyledPaper>

        <Divider sx={{ my: 4 }} />
        
        {/* Footer */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} Abroad Educares. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default function PrivacyPolicy(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <PrivacyPolicyContent />
    </AppTheme>
  );
}