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

function OshcForm() {
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

  const documentTypeOptions = ['Policy Document', 'Receipt', 'Application Form', 'Other'];

  // Form state
  const [formData, setFormData] = useState({
    studentRef: '',
    policyStartDate: '',
    policyEndDate: '',
    passportNumber: '',
    studentId: '',
    partner: '',
    notes: '',
    premium: '',
    commission: '',
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});
  const [students, setStudents] = useState([]);
  
  // New student modal state
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    agentRef: user?._id || '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewStudent({ name: '', email: '', agentRef: user?._id || '' });
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
    if (!newStudent.name || !newStudent.email) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in both Name and Email',
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

  // Load data for edit mode
  useEffect(() => {
    fetchStudents();
    
    if (isEditMode && id) {
      fetchOshcData(id);
    }
  }, [id, isEditMode, isModalOpen]);

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
        // Get the logged-in agent's ID from Redux
        const loggedInAgentId = user?._id;
       
        if (!loggedInAgentId) {
          console.error('No logged-in agent ID found');
          setStudents([]);
          return;
        }

        // Filter to show only students belonging to the logged-in agent
        // Students have agentCode field (not agentRef)
        const agentStudents = result.students.filter((student) => {
          // Check agentCode field - it can be an object with _id or a direct ID string
          const studentAgentId = typeof student.agentCode === 'object' 
            ? student.agentCode?._id 
            : student.agentCode;
          
          // Also check agentRef as fallback (in case some students use this field)
          const studentAgentRef = typeof student.agentRef === 'object' 
            ? student.agentRef?._id 
            : student.agentRef;
          
          return studentAgentId === loggedInAgentId || studentAgentRef === loggedInAgentId;
        });
        
        setStudents(agentStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchOshcData = async (oshcId) => {
    try {
      setLoading(true);
      
      const response = await fetch(`https://abroad-backend-gray.vercel.app/api/oshc/${oshcId}`, {
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
          policyStartDate: oshcData.policyStartDate ? oshcData.policyStartDate.split('T')[0] : '',
          policyEndDate: oshcData.policyEndDate ? oshcData.policyEndDate.split('T')[0] : '',
          passportNumber: oshcData.passportNumber || '',
          studentId: oshcData.studentId || '',
          partner: oshcData.partner || '',
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

  const uploadFiles = async () => {
    const filesToUpload = documents.filter(doc => doc.documentFile);
    
    if (filesToUpload.length === 0) {
      return []; // Return empty array if no files to upload
    }

    try {
      const filedata = new FormData();
      const types = filesToUpload.map(doc => doc.documentType);
      
      filedata.append('type', types.join(','));
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
          filename: result.uploads[index]?.fileName || doc.fileName,
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
        passportNumber: formData.passportNumber.toUpperCase(), // API converts to uppercase
        studentId: formData.studentId,
        partner: formData.partner,
        policyStartDate: formData.policyStartDate,
        policyEndDate: formData.policyEndDate,
        premium: formData.premium ? parseFloat(formData.premium) : 0,
        commission: formData.commission ? parseFloat(formData.commission) : 0,
        documents: allDocuments,
        notes: formData.notes || '',
      };

      const apiUrl = isEditMode 
        ? `https://abroad-backend-gray.vercel.app/api/oshc/${id}`
        : 'https://abroad-backend-gray.vercel.app/api/oshc';
      
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
        
        navigate('/agent/oshc');
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
                {/* Student Information */}
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Select Student"
                    value={formData.studentRef}
                    onChange={(e) => {
                      if (e.target.value === 'create') {
                        openModal();
                      } else {
                        handleInputChange('studentRef', e.target.value);
                      }
                    }}
                    error={Boolean(errors.studentRef)}
                    helperText={errors.studentRef}
                    required
                  >
                    <MenuItem value="">Select Student</MenuItem>
                    {students.map((student) => (
                      <MenuItem key={student._id} value={student._id}>
                        {student.name} ({student.email})
                      </MenuItem>
                    ))}
                    <MenuItem value="create">+ Create New Student</MenuItem>
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
                  onClick={() => navigate('/agent/oshc')}
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

export default OshcForm;