import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SubjectIcon from '@mui/icons-material/Subject';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';

// Styled components for the enquiry form
const StyledCard = styled(Card)(({ theme }) => ({
  background:
    'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
  },
  ...theme.applyStyles('dark', {
    background:
      'linear-gradient(135deg, rgba(17, 25, 40, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  }),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 20px rgba(0, 123, 255, 0.2)',
    },
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    }),
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '16px',
    padding: '14px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
  borderRadius: '12px',
  padding: '12px 30px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  color: 'white',
  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
  color: 'white',
  marginRight: '12px',
  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
}));

export default function Features() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    contact: '',
    subject: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Map form data to match backend API structure
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.contact, // Backend expects 'phone' instead of 'contact'
        subject: formData.subject,
        message: formData.comment, // Backend expects 'message' instead of 'comment'
      };

      const response = await axios.post(
        'https://abroad-backend-gray.vercel.app/admin/enquiries/create',
        submitData,
      );

      if (response.data.success) {
        alert('Thank you for your enquiry! We will get back to you within 24 hours.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          contact: '',
          subject: '',
          comment: '',
        });
      } else {
        throw new Error('Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert(
        'Sorry, there was an error submitting your enquiry. Please try again or contact us directly.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container id="enquiry" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={6} alignItems="center">
        {/* Left Side - Content */}
        <Grid item xs={12} lg={6}>
          <Box sx={{ pr: { lg: 4 } }}>
            <Typography
              component="h2"
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                fontSize: { xs: '1.8rem', md: '2.8rem' },
                lineHeight: 1.2,
              }}
            >
              Your Global Exposure Partner!
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 4,
                lineHeight: 1.4,
              }}
            >
              Seamless Financial Solutions for International Students
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              At AbroCare, we specialize in making your study abroad dreams a
              reality. Get expert assistance with GIC accounts, Blocked Accounts
              for Germany, and comprehensive Forex services - all managed
              seamlessly in one secure platform.
            </Typography>

            {/* Features List */}
            {/* Features List */}
            <Box sx={{ mb: 4 }}>
              {[
                'Embassy-accepted GIC accounts for Canada - Get account number in 5 minutes',
                'Fintiba-powered Blocked Accounts for Germany - Fully compliant',
                'Competitive Forex rates with TCS-free payment options',
                'Real-time tracking and transparent fee structures',
                'Dedicated support from application to arrival',
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                >
                  {/* Blue bullet */}
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      minWidth: 12,
                      borderRadius: '50%',
                      backgroundColor: '#1976d2', // blue color
                      mr: 2,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.primary', fontWeight: 500 }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Right Side - Form */}
        <Grid item xs={12} lg={6}>
          <StyledCard sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Enquiry Now!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 400,
                }}
              >
                Get personalized guidance for your study abroad financial needs.
                We'll respond within 24 hours.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Name Field */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconBox>
                      <PersonIcon fontSize="small" />
                    </IconBox>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      Full Name
                    </Typography>
                  </Box>
                  <StyledTextField
                    fullWidth
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* Email & Contact Row */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconBox>
                      <EmailIcon fontSize="small" />
                    </IconBox>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      Email Address
                    </Typography>
                  </Box>
                  <StyledTextField
                    fullWidth
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconBox>
                      <PhoneIcon fontSize="small" />
                    </IconBox>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      Phone Number
                    </Typography>
                  </Box>
                  <StyledTextField
                    fullWidth
                    type="tel"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleInputChange('contact')}
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* Subject Field */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconBox>
                      <SubjectIcon fontSize="small" />
                    </IconBox>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      Subject
                    </Typography>
                  </Box>
                  <StyledTextField
                    fullWidth
                    placeholder="GIC Setup / Blocked Account / Forex / Other"
                    value={formData.subject}
                    onChange={handleInputChange('subject')}
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* Comment Field */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconBox>
                      <CommentIcon fontSize="small" />
                    </IconBox>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      Your Message
                    </Typography>
                  </Box>
                  <StyledTextField
                    fullWidth
                    placeholder="Enter your message here..."
                    value={formData.comment}
                    onChange={handleInputChange('comment')}
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <StyledButton
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    startIcon={<SendIcon />}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                  </StyledButton>
                </Grid>
              </Grid>
            </form>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
}
