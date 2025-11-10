import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
  Divider,
  IconButton,
  Alert,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import { useColorMode } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');

function AdminOshcForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.Auth);
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { colorMode } = useColorMode();

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
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          fullWidth: true,
        },
        styleOverrides: {
          root: {
            marginBottom: 16,
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

  const documentTypeOptions = ['passport', 'offerLetter'];

  // Form state
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    mobile: '',
    policyStartDate: '',
    policyEndDate: '',
    passportNumber: '',
    studentId: '',
    partner: '',
    status: 'Pending',
    notes: '',
    premium: '',
    commission: '',
    agentId: '',
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});
  const [agents, setAgents] = useState([]);

  const addDocuments = () => {
    setDocuments([
      ...documents,
      {
        documentType: '',
        documentFile: '',
        fileName: '',
      },
    ]);
  };

  const removeDocument = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
  };

  const handleDocumentChange = (index, field, value) => {
    const newDocuments = [...documents];
    newDocuments[index][field] = value;
    setDocuments(newDocuments);
  };

  const handleFileChange = (index, file) => {
    const newDocuments = [...documents];
    newDocuments[index].documentFile = file;
    newDocuments[index].fileName = file?.name || '';
    setDocuments(newDocuments);
  };

  // Handle form data changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Fetch agents for dropdown
  useEffect(() => {
    fetchAgents();
  }, []);

  // Load data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchOshcData(id);
    }
  }, [id, isEditMode]);

  const fetchAgents = async () => {
    try {
      const response = await fetch('https://abroad-backend-gray.vercel.app/api/agents', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAgents(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const fetchOshcData = async (oshcId) => {
    try {
      setLoading(true);
      
      const response = await fetch(`https://abroad-backend-gray.vercel.app/api/oshc/admin/${oshcId}`, {
        method: 'GET',
        credentials: 'include',
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
        const oshcData = result.data;
        setFormData({
          studentName: oshcData.studentName || '',
          email: oshcData.email || '',
          mobile: oshcData.mobile || '',
          policyStartDate: oshcData.policyStartDate ? oshcData.policyStartDate.split('T')[0] : '',
          policyEndDate: oshcData.policyEndDate ? oshcData.policyEndDate.split('T')[0] : '',
          passportNumber: oshcData.passportNumber || '',
          studentId: oshcData.studentId || '',
          partner: oshcData.partner || '',
          status: oshcData.status || 'Pending',
          notes: oshcData.notes || '',
          premium: oshcData.premium || '',
          commission: oshcData.commission || '',
          agentId: oshcData.agentId || '',
        });

        // Set existing documents if any
        if (oshcData.documents && oshcData.documents.length > 0) {
          setDocuments(oshcData.documents.map(doc => ({
            documentType: doc.type || '',
            documentFile: '',
            fileName: doc.filename || '',
            existingFile: doc.url || '',
          })));
        }
      } else {
        throw new Error(result.message || 'Failed to fetch OSHC data');
      }
    } catch (error) {
      console.error('Error fetching OSHC data:', error);
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!formData.policyStartDate) newErrors.policyStartDate = 'Policy start date is required';
    if (!formData.policyEndDate) newErrors.policyEndDate = 'Policy end date is required';
    if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.partner) newErrors.partner = 'Partner selection is required';
    if (!formData.agentId) newErrors.agentId = 'Agent selection is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFiles = async () => {
    const filesToUpload = documents.filter(doc => doc.documentFile);
    
    if (filesToUpload.length === 0) {
      return {}; // Return empty object if no files to upload
    }

    try {
      const filedata = new FormData();
      const types = filesToUpload.map(doc => doc.documentType);
      
      filedata.append('type', types.join(','));
      filedata.append('folderId', '1WkdyWmBhKQAI6W_M4LNLbPylZoGZ7y6V'); // OSHC folder ID
      
      filesToUpload.forEach(doc => {
        if (doc.documentFile) {
          filedata.append('files', doc.documentFile);
        }
      });

      const response = await fetch('https://abroad-backend-gray.vercel.app/api/uploads/upload', {
        method: 'POST',
        body: filedata,
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return result.files || {};
      } else {
        throw new Error(result.message || 'File upload failed');
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields correctly',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // Upload files first
      const uploadedFiles = await uploadFiles();

      // Prepare form data
      const submitData = {
        ...formData,
        documents: documents.map((doc, index) => ({
          type: doc.documentType,
          filename: doc.fileName || doc.existingFile?.split('/').pop() || '',
          url: uploadedFiles[doc.documentType] || doc.existingFile || '',
        })).filter(doc => doc.type && (doc.url || doc.filename)),
      };

      const apiUrl = isEditMode 
        ? `https://abroad-backend-gray.vercel.app/api/oshc/admin/${id}`
        : 'https://abroad-backend-gray.vercel.app/api/oshc/admin';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: 'Success',
          description: isEditMode ? 'OSHC updated successfully!' : 'OSHC created successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        navigate('/admin/oshc');
      } else {
        throw new Error(result.message || `Failed to ${isEditMode ? 'update' : 'create'} OSHC`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEditMode ? 'update' : 'create'} OSHC`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Card sx={{ maxWidth: 1200, mx: 'auto' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
              {isEditMode ? 'Edit OSHC Entry' : 'New OSHC Entry'}
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Agent Selection (Admin only) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Assign to Agent"
                    value={formData.agentId}
                    onChange={(e) => handleInputChange('agentId', e.target.value)}
                    error={Boolean(errors.agentId)}
                    helperText={errors.agentId}
                    required
                  >
                    <MenuItem value="">Select Agent</MenuItem>
                    {agents.map((agent) => (
                      <MenuItem key={agent._id || agent.id} value={agent._id || agent.id}>
                        {agent.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Student Information */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Student Name"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    error={Boolean(errors.studentName)}
                    helperText={errors.studentName}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Mobile Number"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    error={Boolean(errors.mobile)}
                    helperText={errors.mobile}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Passport Number"
                    value={formData.passportNumber}
                    onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                    error={Boolean(errors.passportNumber)}
                    helperText={errors.passportNumber}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Student ID"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    error={Boolean(errors.studentId)}
                    helperText={errors.studentId}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Partner"
                    value={formData.partner}
                    onChange={(e) => handleInputChange('partner', e.target.value)}
                    error={Boolean(errors.partner)}
                    helperText={errors.partner}
                    required
                  >
                    <MenuItem value="Allianz">Allianz</MenuItem>
                    <MenuItem value="BUPA">BUPA</MenuItem>
                    <MenuItem value="Medibank">Medibank</MenuItem>
                    <MenuItem value="CBHS">CBHS</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Policy Start Date"
                    value={formData.policyStartDate}
                    onChange={(e) => handleInputChange('policyStartDate', e.target.value)}
                    error={Boolean(errors.policyStartDate)}
                    helperText={errors.policyStartDate}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    type="date"
                    label="Policy End Date"
                    value={formData.policyEndDate}
                    onChange={(e) => handleInputChange('policyEndDate', e.target.value)}
                    error={Boolean(errors.policyEndDate)}
                    helperText={errors.policyEndDate}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Premium Amount"
                    type="number"
                    value={formData.premium}
                    onChange={(e) => handleInputChange('premium', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Commission Amount"
                    type="number"
                    value={formData.commission}
                    onChange={(e) => handleInputChange('commission', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* Documents Section */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Documents
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addDocuments}
                  >
                    Add Document
                  </Button>
                </Box>

                {documents.map((document, index) => (
                  <Card key={index} sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <TextField
                          select
                          label="Document Type"
                          value={document.documentType}
                          onChange={(e) => handleDocumentChange(index, 'documentType', e.target.value)}
                          size="small"
                        >
                          {documentTypeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option === 'passport' ? 'Passport' : 'Offer Letter'}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Button
                            component="label"
                            variant="outlined"
                            size="small"
                            startIcon={<AttachFileIcon />}
                          >
                            {document.fileName || 'Choose File'}
                            <input
                              type="file"
                              hidden
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(index, e.target.files[0])}
                            />
                          </Button>
                          {(document.fileName || document.existingFile) && (
                            <DescriptionIcon sx={{ color: 'success.main' }} />
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <IconButton
                          onClick={() => removeDocument(index)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>

              {/* Submit Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/oshc')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Saving...' : isEditMode ? 'Update OSHC' : 'Create OSHC'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default AdminOshcForm;