import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Stack,
  CircularProgress,
  IconButton,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';

function AdminStudentFundingView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [fundingData, setFundingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [documents, setDocuments] = useState([]);
  const [documentPreview, setDocumentPreview] = useState({ open: false, url: '', title: '' });

  const paymentTenureOptions = ['Less than 3 Months', '6 Months', 'More than 6 Months'];
  const statusOptions = ['Pending', 'In Progress', 'Approved', 'Rejected', 'Completed'];

  // Excluded fields (read-only display fields)
  const excludedFields = ['_id', 'createdAt', 'updatedAt', 'isDeleted', '__v'];
  const readOnlyFields = ['studentName', 'studentEmail', 'studentPhone', 'agentName'];

  const theme = createTheme({
    palette: {
      mode: colorMode,
      primary: {
        main: colorMode === 'light' ? '#667eea' : '#90CAF9',
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
        `https://abroad-backend-gray.vercel.app/api/student-funding/admin/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
          },
          withCredentials: true
        }
      );

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setFundingData({
          ...data,
          studentName: data.offerLetterDetails?.studentName || 
                      data.offerLetterDetails?.studentRef?.name || 'N/A',
          studentEmail: data.offerLetterDetails?.studentRef?.email || 'N/A',
          studentPhone: data.offerLetterDetails?.studentRef?.phoneNumber || 
                       data.offerLetterDetails?.studentRef?.phone || 'N/A',
          agentName: data.agentRef?.name || 'N/A',
        });

        setEditableData({
          amountRequired: data.amountRequired || '',
          countryAppliedFor: data.countryAppliedFor || '',
          studentId: data.offerLetterDetails?.studentId || '',
          institutionName: data.offerLetterDetails?.institutionName || '',
          courseName: data.offerLetterDetails?.courseName || '',
          courseTenure: data.offerLetterDetails?.courseTenure || '',
          paymentRequirementTenure: data.paymentRequirementTenure || '',
          status: data.status || 'Pending',
          remarks: data.remarks || '',
        });

        setDocuments(
          data.documents?.map(doc => ({
            type: doc.type || '',
            fileId: doc.fileId || '',
            _id: doc._id
          })) || []
        );
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

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentChange = (index, field, value) => {
    const newDocuments = [...documents];
    newDocuments[index][field] = value;
    setDocuments(newDocuments);
  };

  const addDocument = () => {
    setDocuments([...documents, { type: '', fileId: '' }]);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleFileChange = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://abroad-backend-gray.vercel.app/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
          },
          withCredentials: true
        }
      );

      if (response.data && response.data.fileId) {
        handleDocumentChange(index, 'fileId', response.data.fileId);
        
        toast({
          title: 'Success',
          description: 'File uploaded successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        amountRequired: parseFloat(editableData.amountRequired),
        countryAppliedFor: editableData.countryAppliedFor,
        offerLetterDetails: {
          studentRef: fundingData.offerLetterDetails?.studentRef?._id || fundingData.offerLetterDetails?.studentRef,
          studentId: editableData.studentId,
          institutionName: editableData.institutionName,
          courseName: editableData.courseName,
          courseTenure: editableData.courseTenure,
        },
        paymentRequirementTenure: editableData.paymentRequirementTenure,
        documents: documents
          .filter(doc => doc.type && doc.fileId)
          .map(doc => ({
            type: doc.type,
            fileId: doc.fileId,
          })),
        status: editableData.status,
        remarks: editableData.remarks,
      };

      const response = await axios.put(
        `https://abroad-backend-gray.vercel.app/api/student-funding/admin/update/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Student funding request updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsEditMode(false);
        fetchFundingData(); // Refresh data
      }
    } catch (error) {
      console.error('Error saving funding data:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update funding data',
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
            onClick={() => navigate('/admin/student-funding')}
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
              onClick={() => navigate('/admin/student-funding')}
            >
              Back to List
            </Button>
            {!isEditMode ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditToggle}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setIsEditMode(false);
                    fetchFundingData();
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </Card>

        {/* Basic Information */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Amount Required
              </Typography>
              {isEditMode ? (
                <TextField
                  fullWidth
                  type="number"
                  value={editableData.amountRequired}
                  onChange={(e) => handleChange('amountRequired', e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
              ) : (
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  ${fundingData.amountRequired?.toLocaleString() || 'N/A'}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Country Applied For
              </Typography>
              {isEditMode ? (
                <TextField
                  fullWidth
                  value={editableData.countryAppliedFor}
                  onChange={(e) => handleChange('countryAppliedFor', e.target.value)}
                  size="small"
                />
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.countryAppliedFor || 'N/A'}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Payment Requirement Tenure
              </Typography>
              {isEditMode ? (
                <FormControl fullWidth size="small">
                  <Select
                    value={editableData.paymentRequirementTenure}
                    onChange={(e) => handleChange('paymentRequirementTenure', e.target.value)}
                  >
                    {paymentTenureOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.paymentRequirementTenure || 'N/A'}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              {isEditMode ? (
                <FormControl fullWidth size="small">
                  <Select
                    value={editableData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    {statusOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Chip
                  label={fundingData.status || 'Pending'}
                  color={getStatusColor(fundingData.status)}
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Agent Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {fundingData.agentName}
              </Typography>
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
            <Grid item xs={12} md={4}>
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

            <Grid item xs={12} md={4}>
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

            <Grid item xs={12} md={4}>
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
              <Typography variant="caption" color="text.secondary">
                Student ID
              </Typography>
              {isEditMode ? (
                <TextField
                  fullWidth
                  value={editableData.studentId}
                  onChange={(e) => handleChange('studentId', e.target.value)}
                  size="small"
                />
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.offerLetterDetails?.studentId || 'N/A'}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Institution Name
              </Typography>
              {isEditMode ? (
                <TextField
                  fullWidth
                  value={editableData.institutionName}
                  onChange={(e) => handleChange('institutionName', e.target.value)}
                  size="small"
                />
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.offerLetterDetails?.institutionName || 'N/A'}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Course Name
              </Typography>
              {isEditMode ? (
                <TextField
                  fullWidth
                  value={editableData.courseName}
                  onChange={(e) => handleChange('courseName', e.target.value)}
                  size="small"
                />
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.offerLetterDetails?.courseName || 'N/A'}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Course Tenure
              </Typography>
              {isEditMode ? (
                <TextField
                  fullWidth
                  value={editableData.courseTenure}
                  onChange={(e) => handleChange('courseTenure', e.target.value)}
                  size="small"
                />
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fundingData.offerLetterDetails?.courseTenure || 'N/A'}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Card>

        {/* Documents */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <DescriptionIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Documents
              </Typography>
            </Stack>
            {isEditMode && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addDocument}
                size="small"
              >
                Add Document
              </Button>
            )}
          </Stack>
          <Divider sx={{ mb: 3 }} />

          {documents.length === 0 ? (
            <Alert severity="info">No documents uploaded</Alert>
          ) : (
            <Grid container spacing={2}>
              {documents.map((doc, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    {isEditMode ? (
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Document Type"
                            value={doc.type}
                            onChange={(e) => handleDocumentChange(index, 'type', e.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<AttachFileIcon />}
                            fullWidth
                          >
                            {doc.fileId ? 'File Uploaded' : 'Upload File'}
                            <input
                              type="file"
                              hidden
                              onChange={(e) => handleFileChange(index, e)}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                          </Button>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <IconButton
                            color="error"
                            onClick={() => removeDocument(index)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ) : (
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
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Card>

        {/* Remarks */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Remarks
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {isEditMode ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editableData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Add remarks..."
            />
          ) : (
            <Typography variant="body1" color="text.secondary">
              {fundingData.remarks || 'No remarks available'}
            </Typography>
          )}
        </Card>

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

export default AdminStudentFundingView;
