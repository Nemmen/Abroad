import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import ColorModeIconDropdown from '../../theme/shared-theme/ColorModeIconDropdown';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/system';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
   const theme = useTheme();
    // const textColor = theme.palette.mode === 'dark' ? 'hsl(210, 98%, 48%)' : '';
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="xl">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            {/* Logo */}
            <a href="#home">
              <Box
                component="img"
                src={theme.palette.mode === 'dark' ? '/LogoWhite.png' : '/Logo.png'}
                alt="AbroCare Logo"
                sx={{
                  height: theme.palette.mode === 'dark' 
                    ? { xs: '55px', md: '65px' } 
                    : { xs: '45px', md: '50px' },
                  width: 'auto',
                  objectFit: 'contain',
                  mr: 2,
                  transition: 'all 0.3s ease',
                  filter: theme.palette.mode === 'dark' ? 'brightness(1.1)' : 'none'
                }}
              />
            </a>
            
            {/* Centered Navigation */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              flexGrow: 1,
              justifyContent: 'center',
              gap: { md: 0.25, lg: 0.5, xl: 1 },
              flexWrap: 'nowrap'
            }}>
              <Button variant="text" color="info" size="small" href="#GIC" sx={{ fontSize: { md: '0.7rem', lg: '0.85rem', xl: '1rem' }, fontWeight: 500, px: { md: 0.5, lg: 1, xl: 1.5 }, minWidth: 'auto', whiteSpace: 'nowrap' }}>
                GIC
              </Button>
              <Button variant="text" color="info" size="small" href="#BlockAccount" sx={{ fontSize: { md: '0.7rem', lg: '0.85rem', xl: '1rem' }, fontWeight: 500, px: { md: 0.5, lg: 1, xl: 1.5 }, minWidth: 'auto', whiteSpace: 'nowrap' }}>
                Blocked Account
              </Button>
              <Button variant="text" color="info" size="small" href="#forex" sx={{ fontSize: { md: '0.7rem', lg: '0.85rem', xl: '1rem' }, fontWeight: 500, px: { md: 0.5, lg: 1, xl: 1.5 }, minWidth: 'auto', whiteSpace: 'nowrap' }}>
                Forex
              </Button>
              <Button variant="text" color="info" size="small" href="#oshc" sx={{ fontSize: { md: '0.7rem', lg: '0.85rem', xl: '1rem' }, fontWeight: 500, px: { md: 0.5, lg: 1, xl: 1.5 }, minWidth: 'auto', whiteSpace: 'nowrap' }}>
                OSHC
              </Button>
              <Button variant="text" color="info" size="small" href="#payment-tagging" sx={{ fontSize: { md: '0.7rem', lg: '0.85rem', xl: '1rem' }, fontWeight: 500, px: { md: 0.5, lg: 1, xl: 1.5 }, minWidth: 'auto', whiteSpace: 'nowrap' }}>
                Payment Tagging
              </Button>
              <Button variant="text" color="info" size="small" href="#student-funding" sx={{ fontSize: { md: '0.7rem', lg: '0.85rem', xl: '1rem' }, fontWeight: 500, px: { md: 0.5, lg: 1, xl: 1.5 }, minWidth: 'auto', whiteSpace: 'nowrap' }}>
                Student Funding
              </Button>
              <Button variant="text" color="info" size="small" href="https://abroadeducares.com/" sx={{ fontSize: { md: '0.7rem', lg: '0.85rem', xl: '1rem' }, fontWeight: 500, px: { md: 0.5, lg: 1, xl: 1.5 }, minWidth: 'auto', whiteSpace: 'nowrap' }}> 
                Immigration
              </Button>
              <Button variant="text" color="info" size="small" sx={{ fontSize: { md: '0.7rem', lg: '0.85rem', xl: '1rem' }, fontWeight: 500, px: { md: 0.5, lg: 1, xl: 1.5 }, minWidth: 'auto', whiteSpace: 'nowrap' }} href="#FAQ">
                FAQ
              </Button>
              <Button  variant="text" color="info" size="small" sx={{ fontSize: { md: '0.7rem', lg: '0.85rem', xl: '1rem' }, fontWeight: 500, px: { md: 0.5, lg: 1, xl: 1.5 }, minWidth: 'auto', whiteSpace: 'nowrap' }} href="#enquiry">
                Contact Us
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button color="primary" variant="text" size="medium" onClick={()=>( navigate("/auth/login"))} replace>
              Sign in
            </Button>
            <Button color="primary" variant="contained" size="medium" onClick={()=>( navigate("/auth/signup"))} replace>
              Sign up
            </Button>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
  <Button variant="text" color="info" size="medium" href="#GIC" sx={{ fontSize: '1rem', fontWeight: 500 }}>
    GIC
  </Button>
  <Button variant="text" color="info" size="medium" href="#BlockAccount" sx={{ fontSize: '1rem', fontWeight: 500 }}>
    Blocked Account
  </Button>
  <Button variant="text" color="info" size="medium" href="#forex" sx={{ fontSize: '1rem', fontWeight: 500 }}>
    Forex
  </Button>
  <Button variant="text" color="info" size="medium" href="#oshc" sx={{ fontSize: '1rem', fontWeight: 500 }}>
    OSHC
  </Button>
  <Button variant="text" color="info" size="medium" href="#payment-tagging" sx={{ fontSize: '1rem', fontWeight: 500 }}>
    Payment Tagging
  </Button>
  <Button variant="text" color="info" size="medium" href="#student-funding" sx={{ fontSize: '1rem', fontWeight: 500 }}>
    Student Funding
  </Button>
  <Button variant="text" color="info" size="medium" href="https://abroadeducares.com/" sx={{ fontSize: '1rem', fontWeight: 500 }}>
    Immigration
  </Button>
  <Button variant="text" color="info" size="medium" sx={{ minWidth: 0, fontSize: '1rem', fontWeight: 500 }} href="#FAQ">
    FAQ
  </Button>
  <Button variant="text" color="info" size="medium" sx={{ minWidth: 0, fontSize: '1rem', fontWeight: 500 }} href="#enquiry">
    Contact Us
  </Button>
</Box>

                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth onClick={()=>( navigate("/auth/signup"))} replace>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth onClick={()=>( navigate("/auth/login"))} replace>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
