import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Divider,
  CircularProgress,
  Link as MuiLink,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode, useToast } from '@chakra-ui/react';
import {
  User as UserIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Briefcase as BuildingIcon,
  FileText as FileTextIcon,
  Calendar as CalendarIcon,
  Tag as TagIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
} from 'react-feather';
import { deletePaymentTagging } from '../../services/ApiEndpoint';

function AgentPaymentTaggingView({ isAdmin = false, onEdit = null }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();
  
  // DELETE functionality states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
            fontWeight: 600,
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://abroad-backend-gray.vercel.app/api/payment-tagging/admin/get/${id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching payment tagging:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // DELETE functionality - Handle delete confirmation
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deletePaymentTagging(id);
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Payment Tagging record deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Close dialog and navigate back to payment tagging list
        setIsDeleteDialogOpen(false);
        navigate(isAdmin ? '/admin/payment-tagging' : '/agent/payment-tagging');
      }
    } catch (error) {
      console.error('Error deleting Payment Tagging record:', error);
      
      // Handle different error scenarios
      let errorMessage = 'Failed to delete Payment Tagging record';
      
      if (error.response?.status === 404) {
        errorMessage = 'Payment Tagging record not found or already deleted';
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized - Admin access required';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const InfoCard = ({ icon: Icon, label, value, color = 'primary.main' }) => (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: color,
              color: 'white',
            }}
          >
            <Icon size={18} />
          </Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="medium">
          {value || 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Completed':
        return 'info';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, sm: 3 }, mb: 4 }}>
        <Card elevation={1}>
          <Box
            sx={{
              p: 3,
              backgroundImage: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight="600" color="white">
                Payment Tagging Details
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                  startIcon={<EditIcon size={18} />}
                  onClick={() => {
                    if (onEdit) {
                      onEdit();
                    } else {
                      navigate(`/agent/payment-tagging/form/${id}`);
                    }
                  }}
                >
                  Edit
                </Button>
                {/* DELETE button - Admin only for this service */}
                {isAdmin && (
                  <IconButton
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={loading}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <Trash2Icon size={20} />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={6}>
                <CircularProgress />
              </Box>
            ) : data ? (
              <>
                {/* Student Information */}
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  Student Information
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <InfoCard
                      icon={UserIcon}
                      label="Student Name"
                      value={data.studentRef?.name || data.studentName}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoCard
                      icon={MailIcon}
                      label="Email"
                      value={data.email}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoCard
                      icon={PhoneIcon}
                      label="Mobile Number"
                      value={data.mobile}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoCard
                      icon={BuildingIcon}
                      label="Institution Name"
                      value={data.institutionName}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Payment Information */}
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  Payment Information
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <InfoCard
                      icon={FileTextIcon}
                      label="Payment Reference Number"
                      value={data.paymentReferenceNumber}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoCard
                      icon={TagIcon}
                      label="Letter Type"
                      value={data.letterType}
                      color="#10B981"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoCard
                      icon={CalendarIcon}
                      label="Date of Letter Generation"
                      value={formatDate(data.dateOfLetterGeneration)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1.5,
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              color: 'white',
                            }}
                          >
                            <CheckCircleIcon size={18} />
                          </Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Status
                          </Typography>
                        </Box>
                        <Chip
                          label={data.status}
                          color={getStatusColor(data.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Documents */}
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  Documents
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {data.paymentInstructionLetter && (
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">
                            Payment Instruction Letter
                          </Typography>
                          <MuiLink
                            href={`https://drive.google.com/file/d/${data.paymentInstructionLetter}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                          >
                            View Document
                          </MuiLink>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {data.documents && data.documents.length > 0 && (
                    <>
                      {data.documents.map((doc, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">
                                {doc.type || `Document ${index + 1}`}
                              </Typography>
                              <MuiLink
                                href={`https://drive.google.com/file/d/${doc.fileId}/view`}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                              >
                                View Document
                              </MuiLink>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </>
                  )}
                </Grid>

                {/* Remarks */}
                {data.remarks && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                      Remarks
                    </Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body1">{data.remarks}</Typography>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Metadata */}
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoCard
                      icon={CalendarIcon}
                      label="Created At"
                      value={formatDate(data.createdAt)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoCard
                      icon={CalendarIcon}
                      label="Last Updated"
                      value={formatDate(data.updatedAt)}
                    />
                  </Grid>
                </Grid>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No data found
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* DELETE Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Payment Tagging Record</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this Payment Tagging record? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default AgentPaymentTaggingView;
