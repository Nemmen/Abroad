import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/system';
import GoogleIcon from '../../assets/img/home/GoogleIcon.png';
const userTestimonials = [
  {
    avatar: <Avatar alt="Ananya Sharma" src="/static/images/avatar/1.jpg" />,
    name: 'Ananya Sharma',
    occupation: 'Senior Engineer',
    testimonial:
      "I absolutely love how versatile this platform is! Managing GIC, Blocked Accounts, and Forex services has never been this effortless. The intuitive dashboard has transformed my workflow, making tasks more efficient and enjoyable",
  },
  {
    avatar: <Avatar alt="Amit Gupta" src="/static/images/avatar/2.jpg" />,
    name: 'Amit Gupta',
    occupation: 'Lead Product Designer',
    testimonial:
      "One of the standout features of this platform is the exceptional customer support. The team is always quick to respond and incredibly helpful. It's reassuring to work with a service that truly cares about its users.",
  },
  {
    avatar: <Avatar alt="Kavya Mehta" src="/static/images/avatar/3.jpg" />,
    name: 'Kavya Mehta',
    occupation: 'CTO',
    testimonial:
      'The simplicity and user-friendliness of this platform have significantly streamlined my work. Managing financial services for international students is now hassle-free, thanks to this well-designed solution.',
  },
  {
    avatar: <Avatar alt="Rohan Verma" src="/static/images/avatar/4.jpg" />,
    name: 'Rohan Verma',
    occupation: 'Senior Engineer',
    testimonial:
      "The attention to detail in this platform is outstanding. From seamless GIC applications to real-time tracking, every feature is thoughtfully designed to provide a premium experience.",
  },
  {
    avatar: <Avatar alt="Priya Nair" src="/static/images/avatar/5.jpg" />,
    name: 'Priya Nair',
    occupation: 'Product Designer',
    testimonial:
      "I've tried other services, but this one stands out for its innovative features and seamless integration. The creators have truly addressed the needs of students and agents with this comprehensive solution.",
  },
  {
    avatar: <Avatar alt="Rajesh Iyer" src="/static/images/avatar/6.jpg" />,
    name: 'Rajesh Iyer',
    occupation: 'CDO',
    testimonial:
      "The quality and reliability of this platform exceeded my expectations. It's built to deliver a trustworthy, stress-free experience for financial services. A game-changer for international transactions!",
  },
];

// const whiteLogos = [

  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628e8573c43893fe0ace_Sydney-white.svg',
  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg',
  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg',
  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg',
  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg',
  // 'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg',
// ];

// const darkLogos = [
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg',
//   'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg',
// ];

const logoStyle = {
  width: '40px',
  // opacity: 0.3,
};

export default function Testimonials() {
  const theme = useTheme();
  // const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;
  
  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
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
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: 'text.primary' }}
        >
          Testimonials
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          See what our customers love about our products. Discover how we excel in
          efficiency, durability, and satisfaction. Join us for quality, innovation,
          and reliable support.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {userTestimonials.map((testimonial, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index} sx={{ display: 'flex' }}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
              }}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: 'text.secondary' }}
                >
                  {testimonial.testimonial}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <CardHeader
                  avatar={testimonial.avatar}
                  title={testimonial.name}
                  // subheader={testimonial.occupation}
                />
                <img
                  // src={logos[index]}
                  // alt={`Logo ${index + 1}`}
                  src={GoogleIcon}
                  style={logoStyle}
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
