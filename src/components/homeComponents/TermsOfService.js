import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import GavelIcon from '@mui/icons-material/Gavel';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import PolicyIcon from '@mui/icons-material/Policy';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
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

function TermsOfServiceContent() {
  const handleGoBack = () => {
    window.history.back();
  };

  const sections = [
    {
      title: "General Terms",
      icon: <GavelIcon />,
      content: [
        "The portal is intended for registered business partners and authorized users only.",
        "All services are subject to applicable laws, regulations, and guidelines of financial and regulatory authorities.",
        "The Service Provider reserves the right to amend these Terms at any time with prior notice."
      ]
    },
    {
      title: "Forex Services",
      icon: <CurrencyExchangeIcon />,
      content: [
        "Forex transactions shall be carried out at real-time market-linked rates, with applicable service fees clearly displayed.",
        "Users must comply with all foreign exchange regulations, including RBI/financial authority requirements.",
        "Transactions are non-reversible once executed, except as permitted by law or regulatory policies."
      ]
    },
    {
      title: "GIC & Block Accounts",
      icon: <AccountBalanceIcon />,
      content: [
        "The portal facilitates account creation with authorized banks/financial institutions.",
        "Users are responsible for submitting accurate and verified client documents.",
        "Refunds, withdrawals, and account-related disputes are governed by the respective bank's policies."
      ]
    },
    {
      title: "Insurance Services",
      icon: <SecurityIcon />,
      content: [
        "The portal provides access to policies offered by third-party insurers.",
        "Policy issuance, claims, cancellations, and refunds are subject to the insurer's own terms and conditions.",
        "The portal is not liable for claim rejections or delays caused by insurers."
      ]
    },
    {
      title: "Ticketing Services",
      icon: <FlightTakeoffIcon />,
      content: [
        "Ticket bookings are subject to airline/travel partner availability and pricing.",
        "Cancellation, rescheduling, and refunds will follow the policies of the respective airline/vendor.",
        "The portal is not responsible for delays, rescheduling, or cancellations made by airlines or travel partners."
      ]
    },
    {
      title: "Fees & Commissions",
      icon: <BusinessIcon />,
      content: [
        "Service charges, commissions, or processing fees will be communicated upfront before confirming any transaction.",
        "Payments must be settled within the agreed billing cycle.",
        "Fees once paid are non-refundable unless otherwise specified."
      ]
    }
  ];

  const additionalSections = [
    {
      title: "Data Protection & Confidentiality",
      content: [
        "All client and transaction data shared through the portal shall remain confidential.",
        "Users must not disclose portal login credentials or sensitive information to unauthorized parties.",
        "The portal complies with applicable data protection and privacy regulations."
      ]
    },
    {
      title: "Compliance & Restrictions",
      content: [
        "Users must ensure compliance with KYC, AML, and other regulatory norms.",
        "Any misuse, fraudulent activity, or violation of law will result in suspension or termination of services without liability."
      ]
    },
    {
      title: "Limitation of Liability",
      content: [
        "The portal acts as a facilitator and is not responsible for third-party service failures, delays, or disputes.",
        "The Service Provider's liability shall not exceed the service fee/commission earned from the disputed transaction."
      ]
    },
    {
      title: "Termination",
      content: [
        "The Service Provider may suspend or terminate access if a User breaches these Terms.",
        "Either party may terminate the relationship with prior written notice of 30 days."
      ]
    },
    {
      title: "Governing Law & Dispute Resolution",
      content: [
        "These Terms shall be governed by the laws of local Jurisdiction.",
        "Disputes shall be resolved amicably; failing which, they will be referred to arbitration at Mohali Jurisdiction in accordance with applicable arbitration laws."
      ]
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
          : 'linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)',
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
            <GavelIcon sx={{ fontSize: '2rem' }} />
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
            Terms & Conditions
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
            These Terms & Conditions govern the use of services offered through the Abrocare platform, 
            including Forex, GIC, Block Accounts, Insurance, and Ticketing services.
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
              textAlign: 'center',
              mb: 2
            }}
          >
            By accessing or using our portal, "User/Partner" agrees to comply with and be bound by these Terms.
          </Typography>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(247, 155, 28, 0.1), rgba(255, 140, 0, 0.1))',
              border: '1px solid rgba(247, 155, 28, 0.2)',
              textAlign: 'center'
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: '#f79b1c',
                fontSize: '1.1rem'
              }}
            >
              By using this portal, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
            </Typography>
          </Box>
        </StyledPaper>

        {/* Main Service Sections */}
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
        {additionalSections.map((section, index) => (
          <SectionCard key={`additional-${index}`}>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary', 
                mb: 3,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f79b1c, #ff8c00)',
                  mr: 2,
                }}
              />
              {section.title}
            </Typography>
            
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
            Need Help Understanding These Terms?
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontSize: '1.1rem'
            }}
          >
            If you have any questions about these Terms & Conditions, please contact us:
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
              Unit 202, Tower A, Skyline Elevate,<br />
              PR-7, Airport Road, Zirakpur, Punjab 140603
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

export default function TermsOfService(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <TermsOfServiceContent />
    </AppTheme>
  );
}