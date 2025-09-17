import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const items = [
  {
    icon: <AccountBalanceIcon />,
    title: 'Trusted Bank Partnerships',
    description:
      'Partner with leading banks like ICICI, RBC, CIBC, and authorized providers like Fintiba for reliable financial services.',
  },
  {
    icon: <SecurityIcon />,
    title: 'Embassy-Approved Solutions',
    description:
      'All our GIC and Blocked Account services are fully compliant and accepted by Canadian and German embassies.',
  },
  {
    icon: <SpeedIcon />,
    title: 'Quick Processing',
    description:
      'Get your account number in just 5 minutes and experience fast fund transfers with real-time tracking.',
  },
  {
    icon: <VerifiedUserIcon />,
    title: 'Transparent Operations',
    description:
      'Complete visibility into your applications, fund status, and commission details through our unified dashboard.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: 'Dedicated Student Support',
    description:
      'Expert guidance throughout your journey from application to arrival, with specialized support for international students.',
  },
  {
    icon: <TrendingUpIcon />,
    title: 'Competitive Rates',
    description:
      'Enjoy competitive exchange rates for forex services and transparent fee structures with no hidden charges.',
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Why Choose AbroCare
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
            Your trusted partner for GIC accounts, Blocked accounts, and Forex services. 
            We simplify financial requirements for students pursuing education in Canada and Germany 
            with transparent processes and expert support.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'hsla(220, 25%, 25%, 0.3)',
                  backgroundColor: 'grey.800',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
