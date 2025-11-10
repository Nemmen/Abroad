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
  Table,
  TableBody,
  TableCell,
  TableRow,
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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PublicIcon from '@mui/icons-material/Public';
import BusinessIcon from '@mui/icons-material/Business';

function StudentFundingView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.Auth);
  const { colorMode } = useColorMode();
  const [fundingData, setFundingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentPreview, setDocumentPreview] = useState({ open: false, url: '', title: '' });

  const theme = createTheme({
    palette: {
      mode: colorMode,
      primary: {
        main: colorMode === 'light' ? '#667eea' : '#90CAF9',
      },
      background: {
        default: colorMode === 'light' ? '#ffffff' : '#121212',
        paper: colorMode === 'light' ? '#f9fafc' : '#1E1E1E',
      },
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
    },
  });

  useEffect(() => {
    if (id) {
      fetchFundingData();
    }
  }, [id]);

  const fetchFundingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://abroad-backend-gray.vercel.app/api/student-funding/agent/get?agentRef=${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
          },
          withCredentials: true
        }
      );

      if (response.data.success && response.data.data) {
        const fundingRequest = response.data.data.find(item => item._id === id);
        
        if (fundingRequest) {
          setFundingData({
            ...fundingRequest,
            studentName: fundingRequest.offerLetterDetails?.studentName || 
                        fundingRequest.offerLetterDetails?.studentRef?.name || 'N/A',
            studentEmail: fundingRequest.offerLetterDetails?.studentRef?.email || 'N/A',
            studentPhone: fundingRequest.offerLetterDetails?.studentRef?.phoneNumber || 
                         fundingRequest.offerLetterDetails?.studentRef?.phone || 'N/A',
            agentName: fundingRequest.agentRef?.name || 'N/A',
          });
        } else {
          throw new Error('Funding request not found');
        }
      } else {
        throw new Error('Failed to fetch funding data');
      }
    } catch (error) {
      console.error('Error fetching funding data:', error);
      setError(error.message || 'Failed to load funding data');
      toast({
        title: 'Error',
        description: 'Failed to load funding data',
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
      case 'in progress':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDocumentView = (url, title) => {
    setDocumentPreview({ open: true, url, title });
  };

  const handleEdit = () => {
    navigate(`/agent/student-funding/edit/${id}`);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error || !fundingData) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error || 'Funding request not found'}</Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/agent/student-funding')}
            sx={{ mt: 2 }}
          >
            Back to List
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AccountBalanceIcon sx={{ fontSize: 40, color: 'white' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
                Student Funding Details
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Request ID: {id}
              </Typography>
            </Box>
            <Chip
              label={fundingData.status || 'Pending'}
              color={getStatusColor(fundingData.status)}
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 2,
                py: 2.5
              }}
            />
          </Stack>
        </Card>

        {/* Action Buttons */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/agent/student-funding')}
            >
              Back to List
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              Edit
            </Button>
          </Stack>
        </Card>

        {/* Basic Information */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <AttachMoneyIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Basic Information
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Amount Required
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  ${fundingData.amountRequired?.toLocaleString() || 'N/A'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Country Applied For
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.countryAppliedFor || 'N/A'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Payment Requirement Tenure
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.paymentRequirementTenure || 'N/A'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Agent Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.agentName}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Student Information */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <PersonIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Student Information
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PersonIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Student Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {fundingData.studentName}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {fundingData.studentEmail}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {fundingData.studentPhone}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        {/* Offer Letter Details */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <SchoolIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Offer Letter Details
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Student ID
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.offerLetterDetails?.studentId || 'N/A'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Institution Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.offerLetterDetails?.institutionName || 'N/A'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Course Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.offerLetterDetails?.courseName || 'N/A'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Course Tenure
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.offerLetterDetails?.courseTenure || 'N/A'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Documents */}
        {fundingData.documents && fundingData.documents.length > 0 && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <DescriptionIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Documents
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {fundingData.documents.map((doc, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <DescriptionIcon color="primary" />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {doc.type || `Document ${index + 1}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {doc.fileId}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleDocumentView(doc.fileId, doc.type)}
                          color="primary"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => window.open(doc.fileId, '_blank')}
                          color="primary"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        )}

        {/* Additional Information */}
        {fundingData.remarks && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Remarks
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              {fundingData.remarks || 'No remarks available'}
            </Typography>
          </Card>
        )}

        {/* Timeline */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Timeline
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body2">
                {formatDate(fundingData.createdAt)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body2">
                {formatDate(fundingData.updatedAt)}
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Document Preview Dialog */}
        <Dialog
          open={documentPreview.open}
          onClose={() => setDocumentPreview({ open: false, url: '', title: '' })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{documentPreview.title}</Typography>
              <IconButton
                onClick={() => setDocumentPreview({ open: false, url: '', title: '' })}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ minHeight: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography color="text.secondary">
                Document preview not available. Click download to view the file.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => window.open(documentPreview.url, '_blank')}>
              Download
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default StudentFundingView;
