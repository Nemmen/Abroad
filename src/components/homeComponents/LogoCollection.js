import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { padding, useTheme } from '@mui/system';
import cibc from "../../assets/img/home/cibcLogo.png";
import expartio from "../../assets/img/home/expartioLogo.png";
import fintiba from "../../assets/img/home/fintibaLogo.png";
import flywire from "../../assets/img/home/flywireLogo.png";
import icici from "../../assets/img/home/iciciBankLogo.png";
import rbc from "../../assets/img/home/rbcLogo.png";

const logos = [
  { src: cibc, alt: "CIBC Logo" },
  { src: expartio, alt: "Expartio Logo" },
  { src: fintiba, alt: "Fintiba Logo" },
  { src: flywire, alt: "Flywire Logo" },
  { src: icici, alt: "ICICI Logo" },
  { src: rbc, alt: "RBC Logo" },
];

const containerStyle = {
  width: '160px',
  height: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  margin: '16px',
  borderRadius: '8px',
  border: '1px solid #ddd',
};

const logoStyle = {
  maxWidth: '100%',
  maxHeight: '100%',
  filter: 'grayscale(100%)',
  transition: 'filter 0.3s ease-in-out, contrast 0.3s ease-in-out',
  padding:"0px 10px"
};

export default function LogoCollection() {
  const theme = useTheme();

  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="h3"
        align="center"
        sx={{ color: 'text.secondary' }}
      >
        Our Trusted Partners!
      </Typography>
      <Grid container sx={{ justifyContent: 'center', mt: 0.5, opacity: 1}}>
        {logos.map((logo, index) => (
          <Grid item key={index}>
            <Box
              sx={{
                ...containerStyle,
                backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#f9f9f9',
                '& img:hover': {
                  filter: 'grayscale(0%) contrast(1.2)',
                },
              }}
            >
              <Box
                component="img"
                src={logo.src}
                alt={logo.alt}
                sx={logoStyle}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
