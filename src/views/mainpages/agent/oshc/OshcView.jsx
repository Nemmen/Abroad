import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Stack,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';

function OshcView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.Auth);
  const { colorMode } = useColorMode();
  const [oshcData, setOshcData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentPreview, setDocumentPreview] = useState({ open: false, url: '', title: '' });
  
  // Determine if we're in admin or agent context
  const isAdmin = window.location.pathname.includes('/admin/');

  // Create MUI theme based on Chakra color mode
  const theme = createTheme({
    palette: {
      mode: colorMode,
      primary: {
        main: colorMode === 'light' ? '#3B82F6' : '#90CAF9',
      },
      background: {
        default: colorMode === 'light' ? '#ffffff' : '#121212',
        paper: colorMode === 'light' ? '#f9fafc' : '#1E1E1E',
      },
      text: {
        primary: colorMode === 'light' ? '#111827' : '#f3f4f6',
        secondary: colorMode === 'light' ? '#4B5563' : '#9CA3AF',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            padding: '10px 24px',
            fontWeight: 600,
          },
        },
      },
    },
  });

  // Fetch OSHC data
  useEffect(() => {
    if (id) {
      fetchOshcData();
    }
  }, [id]);

  const fetchOshcData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `https://abroad-backend-gray.vercel.app/api/oshc/${id}`;
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // For cookie-based auth
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}. Please check your authentication or try again later.`);
      }

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        // API returns populated studentRef and agentRef objects
        const data = result.data;
        setOshcData({
          ...data,
          id: data._id,
          studentName: data.studentRef?.name || 'N/A',
          email: data.studentRef?.email || 'N/A',
          mobile: data.studentRef?.phoneNumber || data.studentRef?.mobile || 'N/A',
          agentName: data.agentRef?.name || 'N/A',
        });
      } else {
        throw new Error(result.message || 'Failed to fetch OSHC data');
      }
    } catch (error) {
      console.error('Error fetching OSHC data:', error);
      setError(error.message || 'Failed to load OSHC data. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load OSHC data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPartnerColor = (partner) => {
    const colors = {
      'AHM': '#1976d2',
      'NIB': '#388e3c',
      'Allianz': '#d32f2f',
      'Medibank': '#ff9800',
      'Bupa': '#9c27b0'
    };
    return colors[partner] || '#757575';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDocumentView = (url, title) => {
    setDocumentPreview({ open: true, url, title });
  };

  const handleDocumentDownload = async (documentPath, documentType) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/download/${encodeURIComponent(documentPath)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${oshcData.studentName}_${documentType}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to download document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchOshcData}>
            Retry
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  if (!oshcData) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
          <Alert severity="warning">
            OSHC entry not found.
          </Alert>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
        {/* Header */}
        <Card sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate(isAdmin ? '/admin/oshc' : '/agent/oshc')} sx={{ mr: 1 }}>
                <ArrowBackIcon />
              </IconButton>
              <LocalHospitalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  OSHC Details
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Entry ID: {oshcData.id || oshcData._id}
                </Typography>
              </Box>
            </Box>
            
            {!isAdmin && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/agent/oshc/edit/${id}`)}
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                Edit Entry
              </Button>
            )}
          </Box>
        </Card>

        <Grid container spacing={3}>
          {/* Student Information */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                Student Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Student Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {oshcData.studentName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Email Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {oshcData.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Mobile Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {oshcData.mobile}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BadgeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Passport Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {oshcData.passportNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BadgeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Student ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {oshcData.studentId}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Insurance Partner
                      </Typography>
                      <Chip 
                        label={oshcData.partner}
                        sx={{ 
                          backgroundColor: getPartnerColor(oshcData.partner),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Policy Information */}
            <Card sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                Policy Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DateRangeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Policy Start Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {formatDate(oshcData.policyStartDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DateRangeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Policy End Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {formatDate(oshcData.policyEndDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Premium Amount
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        ${oshcData.premium || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Commission Amount
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        ${oshcData.commission || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {oshcData.notes && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Additional Notes
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary', p: 2, backgroundColor: 'background.default', borderRadius: 2 }}>
                        {oshcData.notes}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>

            {/* Documents */}
            <Card sx={{ p: 3, backgroundColor: 'background.paper' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                Documents
              </Typography>
              
              <Grid container spacing={2}>
                {oshcData.documents && oshcData.documents.length > 0 ? (
                  oshcData.documents.map((doc, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ 
                        p: 2, 
                        border: 1, 
                        borderColor: 'divider', 
                        borderRadius: 2,
                        backgroundColor: 'background.default'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            {doc.type || 'Document'}
                          </Typography>
                        </Box>
                        
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            component="a"
                            href={doc.url}
                            download={doc.filename}
                          >
                            Download
                          </Button>
                        </Stack>
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                      No documents uploaded
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Card>
          </Grid>

          {/* Status and Agent Information */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                Status Information
              </Typography>
              
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Chip 
                  label={oshcData.status}
                  color={getStatusColor(oshcData.status)}
                  sx={{ 
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    px: 2,
                    py: 1
                  }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {isAdmin && (
                <>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Agent
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                    {oshcData.agentName || 'N/A'}
                  </Typography>
                </>
              )}
              
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Created Date
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary', mb: 2 }}>
                {formatDate(oshcData.createdAt)}
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Last Updated
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {formatDate(oshcData.updatedAt)}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Document Preview Dialog */}
        <Dialog
          open={documentPreview.open}
          onClose={() => setDocumentPreview({ open: false, url: '', title: '' })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {documentPreview.title === 'passport' ? 'Passport' : 'Offer Letter'}
            </Typography>
            <IconButton onClick={() => setDocumentPreview({ open: false, url: '', title: '' })}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {documentPreview.url && (
              <Box sx={{ width: '100%', height: '500px' }}>
                <iframe
                  src={documentPreview.url}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title={`${documentPreview.title} Document`}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDocumentPreview({ open: false, url: '', title: '' })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default OshcView;