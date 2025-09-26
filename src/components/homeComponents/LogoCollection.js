import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/system';
import { keyframes } from '@mui/system';
import cibc from "../../assets/img/home/cibcLogo.png";
import expartio from "../../assets/img/home/expartioLogo.png";
import fintiba from "../../assets/img/home/fintibaLogo.png";
import flywire from "../../assets/img/home/flywireLogo.png";
import icici from "../../assets/img/home/iciciBankLogo.png";
import rbc from "../../assets/img/home/rbcLogo.png";
import convera from "../../assets/img/home/convera.png"

// All logos in a single array for continuous slider
const allLogos = [
  { src: flywire, alt: "Flywire Logo", category: "Forex" },
  { src: cibc, alt: "CIBC Logo", category: "Forex & GIC" },
  { src: icici, alt: "ICICI Bank Logo", category: "GIC" },
  { src: rbc, alt: "RBC Bank Logo", category: "GIC" },
  { src: fintiba, alt: "Fintiba Logo", category: "Blocked Account" },
  { src: expartio, alt: "Expatrio Logo", category: "Blocked Account" },
  { src: convera, alt: "Convera Logo" },
];

// Keyframes for smooth infinite scroll
const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const containerStyle = {
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  margin: '0 20px',
  borderRadius: '12px',
  border: '1px solid #e0e0e0',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  minWidth: '180px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
};

const logoStyle = {
  maxWidth: '140px',
  maxHeight: '80px',
  filter: 'grayscale(20%)',
  transition: 'filter 0.3s ease-in-out',
  padding: "10px",
  objectFit: 'contain',
};

export default function LogoCollection() {
  const theme = useTheme();

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...allLogos, ...allLogos];

  return (
    <Box 
      id="logoCollection" 
      sx={{ 
        py: 6, 
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f8f9fa',
        overflow: 'hidden'
      }}
    >
      <Typography
        component="h2"
        variant="h3"
        align="center"
        sx={{ 
          color: 'text.primary', 
          mb: 2,
          fontWeight: 'bold',
          fontSize: { xs: '1.75rem', md: '2.5rem' }
        }}
      >
        Our Trusted Partners
      </Typography>
      
      <Typography
        variant="body1"
        align="center"
        sx={{ 
          color: 'text.secondary', 
          mb: 5,
          maxWidth: '600px',
          mx: 'auto'
        }}
      >
        Partnering with leading financial institutions worldwide to provide you with secure and reliable services
      </Typography>

      {/* Sliding Container */}
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            width: '100px',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
          },
          '&::before': {
            left: 0,
            background: `linear-gradient(to right, ${theme.palette.mode === 'dark' ? '#121212' : '#f8f9fa'}, transparent)`,
          },
          '&::after': {
            right: 0,
            background: `linear-gradient(to left, ${theme.palette.mode === 'dark' ? '#121212' : '#f8f9fa'}, transparent)`,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            animation: `${scroll} 20s linear infinite`,
            '&:hover': {
              animationPlayState: 'paused',
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <Box
              key={index}
              sx={{
                ...containerStyle,
                backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
                '& img:hover': {
                  filter: 'grayscale(0%)',
                },
              }}
            >
              <Box
                component="img"
                src={logo.src}
                alt={logo.alt}
                sx={{
                  ...logoStyle,
                  // Special styling for Convera logo to make it larger
                  ...(logo.alt === "Convera Logo" && {
                    maxWidth: '170px',
                    maxHeight: '100px',
                    transform: 'scale(1.2)',
                  }),
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Service Categories */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{ 
            color: 'text.secondary',
            fontStyle: 'italic'
          }}
        >
          Forex • GIC Accounts • Blocked Accounts • International Banking
        </Typography>
      </Box>
    </Box>
  );
}