import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StarIcon from '@mui/icons-material/Star';
import GoogleIcon from '../../assets/img/home/GoogleIcon.png';
const userTestimonials = [
  {
    avatar: <Avatar alt="Ananya Sharma" sx={{ bgcolor: '#1976d2' }}>AS</Avatar>,
    name: 'Ananya Sharma',
    occupation: 'Senior Engineer',
    testimonial:
      "I absolutely love how versatile this platform is! Managing GIC, Blocked Accounts, and Forex services has never been this effortless. The intuitive dashboard has transformed my workflow, making tasks more efficient and enjoyable",
    rating: 5,
  },
  {
    avatar: <Avatar alt="Amit Gupta" sx={{ bgcolor: '#9c27b0' }}>AG</Avatar>,
    name: 'Amit Gupta',
    occupation: 'Lead Product Designer',
    testimonial:
      "One of the standout features of this platform is the exceptional customer support. The team is always quick to respond and incredibly helpful. It's reassuring to work with a service that truly cares about its users.",
    rating: 5,
  },
  {
    avatar: <Avatar alt="Kavya Mehta" sx={{ bgcolor: '#f57c00' }}>KM</Avatar>,
    name: 'Kavya Mehta',
    occupation: 'CTO',
    testimonial:
      'The simplicity and user-friendliness of this platform have significantly streamlined my work. Managing financial services for international students is now hassle-free, thanks to this well-designed solution.',
    rating: 5,
  },
  {
    avatar: <Avatar alt="Rohan Verma" sx={{ bgcolor: '#388e3c' }}>RV</Avatar>,
    name: 'Rohan Verma',
    occupation: 'Senior Engineer',
    testimonial:
      "The attention to detail in this platform is outstanding. From seamless GIC applications to real-time tracking, every feature is thoughtfully designed to provide a premium experience.",
    rating: 5,
  },
  {
    avatar: <Avatar alt="Priya Nair" sx={{ bgcolor: '#d32f2f' }}>PN</Avatar>,
    name: 'Priya Nair',
    occupation: 'Product Designer',
    testimonial:
      "I've tried other services, but this one stands out for its innovative features and seamless integration. The creators have truly addressed the needs of students and agents with this comprehensive solution.",
    rating: 5,
  },
  {
    avatar: <Avatar alt="Rajesh Iyer" sx={{ bgcolor: '#7b1fa2' }}>RI</Avatar>,
    name: 'Rajesh Iyer',
    occupation: 'CDO',
    testimonial:
      "The quality and reliability of this platform exceeded my expectations. It's built to deliver a trustworthy, stress-free experience for financial services. A game-changer for international transactions!",
    rating: 5,
  },
];

export default function Testimonials() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  // Auto-play functionality
  React.useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === userTestimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? userTestimonials.length - 1 : currentIndex - 1);
    setTimeout(() => setIsAutoPlaying(true), 5000); // Resume auto-play after 5 seconds
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === userTestimonials.length - 1 ? 0 : currentIndex + 1);
    setTimeout(() => setIsAutoPlaying(true), 5000); // Resume auto-play after 5 seconds
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 5000); // Resume auto-play after 5 seconds
  };

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
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f8fafe',
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: 'center',
        }}
      >
        <Typography
          component="h2"
          variant="h3"
          gutterBottom
          sx={{ 
            color: 'text.primary',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Customer Testimonials
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            mb: 1
          }}
        >
          What Our Clients Say About Us
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          See what our customers love about our products. Discover how we excel in
          efficiency, durability, and satisfaction. Join us for quality, innovation,
          and reliable support.
        </Typography>
      </Box>

      {/* Carousel Container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '900px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        {/* Navigation Arrows */}
        <IconButton
          onClick={handlePrevious}
          sx={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#1976d2',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,1)',
              transform: 'translateY(-50%) scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        
        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#1976d2',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,1)',
              transform: 'translateY(-50%) scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        {/* Testimonial Cards */}
        <Box
          sx={{
            display: 'flex',
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          {userTestimonials.map((testimonial, index) => (
            <Box
              key={index}
              sx={{
                minWidth: '100%',
                p: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Avatar */}
              <Box sx={{ mb: 3 }}>
                {testimonial.avatar}
              </Box>

              {/* Stars Rating */}
              <Box sx={{ display: 'flex', gap: 0.5, mb: 3 }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} sx={{ color: theme.palette.mode === 'dark' ? '#ffeb3b' : '#ffc107', fontSize: '1.5rem' }} />
                ))}
              </Box>

              {/* Testimonial Text */}
              <Typography
                variant="h6"
                sx={{
                  color: 'black',
                  fontStyle: 'italic',
                  mb: 4,
                  maxWidth: '700px',
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                "{testimonial.testimonial}"
              </Typography>

              {/* Author Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {testimonial.occupation}
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src={GoogleIcon}
                  alt="Google Icon"
                  sx={{ width: '32px', height: '32px', ml: 2 }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Dots Indicator */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            pb: 3,
          }}
        >
          {userTestimonials.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? '#1976d2' : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
