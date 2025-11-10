
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
  Modal,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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

  const documentTypeOptions = ['Offer Letter', 'Passport'];

  // Form state
  const [formData, setFormData] = useState({
    studentRef: '',
    agentRef: '',
    policyStartDate: '',
    policyEndDate: '',
    passportNumber: '',
    studentId: '',
    partner: '',
    status: 'Pending',
    notes: '',
    premium: '',
    commission: '',
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});
  const [agents, setAgents] = useState([]);
  const [students, setStudents] = useState([]);
  
  // New student modal state
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    agentRef: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewStudent({ name: '', email: '', agentRef: formData.agentRef || '' });
  };

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

  // Handle new student modal
  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleNewStudentSubmit = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.agentRef) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in Name, Email, and select an Agent',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://abroad-backend-gray.vercel.app/auth/studentCreate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
        body: JSON.stringify(newStudent),
      });
      const result = await response.json();

      if (response.ok && result.newStudent) {
        setStudents([...students, result.newStudent]);
        setFormData({ ...formData, studentRef: result.newStudent._id });
        toast({
          title: 'Success',
          description: 'New student has been added',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        closeModal();
      } else {
        throw new Error(result.message || 'Failed to create student.');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch agents for dropdown
  useEffect(() => {
    fetchAgents();
    fetchStudents();
  }, [isModalOpen]);

  // Load data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchOshcData(id);
    }
  }, [id, isEditMode]);

  const fetchAgents = async () => {
    try {
      const response = await fetch('https://abroad-backend-gray.vercel.app/auth/getAllusers?limit=1000', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.users) {
        const filterResult = result.users.filter(
          (user) => user.userStatus === 'active' && !user.isDeleted,
        );
        setAgents(filterResult);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('https://abroad-backend-gray.vercel.app/auth/getStudent?limit=1000', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.students) {
        setStudents(result.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Filtered students based on selected agent
  const filteredStudents = students.filter((student) => {
    if (!formData.agentRef) return false;
    // Check if student belongs to the selected agent
    return student.agentCode === formData.agentRef || student.agentRef?._id === formData.agentRef;
  });

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
          studentRef: oshcData.studentRef?._id || oshcData.studentRef || '',
          agentRef: oshcData.agentRef?._id || oshcData.agentRef || '',
          policyStartDate: oshcData.policyStartDate ? oshcData.policyStartDate.split('T')[0] : '',
          policyEndDate: oshcData.policyEndDate ? oshcData.policyEndDate.split('T')[0] : '',
          passportNumber: oshcData.passportNumber || '',
          studentId: oshcData.studentId || '',
          partner: oshcData.partner || '',
          status: oshcData.status || 'Pending',
          notes: oshcData.notes || '',
          premium: oshcData.premium || '',
          commission: oshcData.commission || '',
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
    
    if (!formData.agentRef) newErrors.agentRef = 'Agent selection is required';
    if (!formData.studentRef) newErrors.studentRef = 'Student selection is required';
    if (!formData.policyStartDate) newErrors.policyStartDate = 'Policy start date is required';
    if (!formData.policyEndDate) newErrors.policyEndDate = 'Policy end date is required';
    if (formData.policyStartDate && formData.policyEndDate && formData.policyStartDate >= formData.policyEndDate) {
      newErrors.policyEndDate = 'Policy end date must be after start date';
    }
    if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.partner) newErrors.partner = 'Partner selection is required';
    if (formData.premium && parseFloat(formData.premium) < 0) {
      newErrors.premium = 'Premium must be greater than or equal to 0';
    }
    if (formData.commission && parseFloat(formData.commission) < 0) {
      newErrors.commission = 'Commission must be greater than or equal to 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  
  //  if (documents.length > 0) {
  //         try {
  //           const response = await fetch(
  //             'https://abroad-backend-gray.vercel.app/api/uploads/upload',
  //             {
  //               method: 'POST',
  //               body: filedata,
  //               headers: {
  //                 Accept: 'application/json',
  //               },
  //             },
  //           );
  //           const result = await response.json();
  //           const respo = result.uploads; // Adjust based on your API response structure
  //           // console.log(respo);

  //           for (let i = 0; i < types.length; i++) {
  //             formDataToSend.studentDocuments[types[i]] = {
  //               fileId: respo[i].fileId,
  //               documentFile: respo[i].viewLink,
  //             };
  //           }
  //         } catch (error) {
  //           console.error('Error uploading files:', error);
  //           toast({
  //             title: 'File Upload Error',
  //             description: 'An error occurred while uploading the file.',
  //             status: 'error',
  //             duration: 3000,
  //             isClosable: true, 
  //           });
  //           setLoading(false);
  //           return; // Stop further execution if file upload fails
  //         }
  //       }

  
  
  const uploadFiles = async () => {
    const filesToUpload = documents.filter(doc => doc.documentFile);
    
    if (filesToUpload.length === 0) {
      return []; // Return empty array if no files to upload
    }

    try {
      const filedata = new FormData();
      const types = [...filesToUpload.map(doc => doc.documentType)]
      
      filedata.append('type', types);
      filedata.append('studentRef', formData.studentRef);
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

      if (response.ok && result.uploads) {
        // Transform the uploads array into document objects with type, filename, url
        return filesToUpload.map((doc, index) => ({
          type: doc.documentType,
          filename: result.uploads[index]?.fileId || doc.fileName,
          url: result.uploads[index]?.viewLink || ''
        })).filter(doc => doc.url);
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
      const uploadedDocuments = await uploadFiles();

      // Keep existing documents that weren't replaced
      const existingDocs = documents
        .filter(doc => !doc.documentFile && doc.existingFile)
        .map(doc => ({
          type: doc.documentType,
          filename: doc.fileName,
          url: doc.existingFile,
        }));

      // Combine existing and newly uploaded documents
      const allDocuments = [...existingDocs, ...uploadedDocuments];

      // Prepare form data according to API specification
      const submitData = {
        studentRef: formData.studentRef,
        agentRef: formData.agentRef, // Admin must specify agent
        passportNumber: formData.passportNumber.toUpperCase(), // API converts to uppercase
        studentId: formData.studentId,
        partner: formData.partner,
        policyStartDate: formData.policyStartDate,
        policyEndDate: formData.policyEndDate,
        status: formData.status || 'Pending',
        premium: formData.premium ? parseFloat(formData.premium) : 0,
        commission: formData.commission ? parseFloat(formData.commission) : 0,
        documents: allDocuments,
        notes: formData.notes || '',
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
        credentials: 'include', // Important: Include cookies for authentication
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: 'Success',
          description: result.message || (isEditMode ? 'OSHC updated successfully!' : 'OSHC created successfully!'),
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
                    value={formData.agentRef}
                    onChange={(e) => {
                      handleInputChange('agentRef', e.target.value);
                      // Reset student selection when agent changes
                      handleInputChange('studentRef', '');
                    }}
                    error={Boolean(errors.agentRef)}
                    helperText={errors.agentRef}
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

                {/* Student Selection */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Select Student"
                    value={formData.studentRef}
                    onChange={(e) => {
                      if (e.target.value === 'create') {
                        if (!formData.agentRef) {
                          toast({
                            title: 'Agent Required',
                            description: 'Please select an agent first',
                            status: 'warning',
                            duration: 3000,
                            isClosable: true,
                          });
                          return;
                        }
                        setNewStudent({ ...newStudent, agentRef: formData.agentRef });
                        openModal();
                      } else {
                        handleInputChange('studentRef', e.target.value);
                      }
                    }}
                    error={Boolean(errors.studentRef)}
                    helperText={errors.studentRef || 'Please select an agent first'}
                    disabled={!formData.agentRef}
                    required
                  >
                    <MenuItem value="">Select Student</MenuItem>
                    {filteredStudents.map((student) => (
                      <MenuItem key={student._id} value={student._id}>
                        {student.name} ({student.email})
                      </MenuItem>
                    ))}
                    <MenuItem value="create" disabled={!formData.agentRef}>
                      + Create New Student
                    </MenuItem>
                  </TextField>
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
                    <MenuItem value="">Select Partner</MenuItem>
                    <MenuItem value="AHM">AHM</MenuItem>
                    <MenuItem value="NIB">NIB</MenuItem>
                    <MenuItem value="Allianz">Allianz</MenuItem>
                    <MenuItem value="Medibank">Medibank</MenuItem>
                    <MenuItem value="Bupa">Bupa</MenuItem>
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
                    inputProps={{ min: 0, step: 0.01 }}
                    helperText="Enter the premium amount"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Commission Amount"
                    type="number"
                    value={formData.commission}
                    onChange={(e) => handleInputChange('commission', e.target.value)}
                    inputProps={{ min: 0, step: 0.01 }}
                    helperText="Enter the commission amount"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 1000 }}
                    helperText={`${formData.notes?.length || 0}/1000 characters`}
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
                          <MenuItem value="">Select Type</MenuItem>
                          {documentTypeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
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

        {/* Create New Student Modal */}
        <Modal
          open={isModalOpen}
          onClose={closeModal}
          aria-labelledby="modal-title"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: 'none'
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2" fontWeight={600}>
                Create New Student
              </Typography>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <FormControl fullWidth required sx={{ mb: 3 }}>
              <InputLabel id="modal-agent-label">Agent</InputLabel>
              <Select
                labelId="modal-agent-label"
                name="agentRef"
                value={newStudent.agentRef}
                onChange={handleNewStudentChange}
                label="Agent"
              >
                {agents.map((agent) => (
                  <MenuItem key={agent._id || agent.id} value={agent._id || agent.id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Name"
              name="name"
              value={newStudent.name}
              onChange={handleNewStudentChange}
              fullWidth
              required
              margin="normal"
            />
            
            <TextField
              label="Email"
              name="email"
              value={newStudent.email}
              onChange={handleNewStudentChange}
              fullWidth
              required
              margin="normal"
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button onClick={closeModal} variant="outlined">
                Cancel
              </Button>
              <Button 
                onClick={handleNewStudentSubmit}
                variant="contained"
                disabled={loading}
                sx={{ minWidth: '100px' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default AdminOshcForm;