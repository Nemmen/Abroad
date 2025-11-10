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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useColorMode } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';

function StudentFundingForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useSelector((state) => state.Auth);
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { colorMode } = useColorMode();

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

  const paymentTenureOptions = ['Less than 3 Months', '6 Months', 'More than 6 Months'];

  // Form state
  const [formData, setFormData] = useState({
    amountRequired: '',
    countryAppliedFor: '',
    studentRef: '',
    studentId: '',
    institutionName: '',
    courseName: '',
    courseTenure: '',
    paymentRequirementTenure: '',
    agentRef: user?._id || '',
  });

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});
  const [students, setStudents] = useState([]);
  
  // New student modal state
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    passportNumber: '',
    agentCode: user?._id || '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewStudent({ 
      name: '', 
      email: '', 
      phone: '', 
      passportNumber: '', 
      agentCode: user?._id || '' 
    });
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        'https://abroad-backend-gray.vercel.app/auth/getStudent?limit=1000',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
          },
          withCredentials: true
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const loggedInAgentId = user?._id;
        
        // Filter students by agentCode field
        const filteredStudents = response.data.filter(student => {
          const studentAgentId = typeof student.agentCode === 'object' 
            ? student.agentCode?._id 
            : student.agentCode;
          const studentAgentRef = typeof student.agentRef === 'object' 
            ? student.agentRef?._id 
            : student.agentRef;
          return studentAgentId === loggedInAgentId || studentAgentRef === loggedInAgentId;
        });

        setStudents(filteredStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch students',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchStudents();
    }
  }, [user]);

  // Fetch data if edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchFundingData();
    }
  }, [id, isEditMode]);

  const fetchFundingData = async () => {
    setLoading(true);
    try {
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
          setFormData({
            amountRequired: fundingRequest.amountRequired || '',
            countryAppliedFor: fundingRequest.countryAppliedFor || '',
            studentRef: fundingRequest.offerLetterDetails?.studentRef?._id || fundingRequest.offerLetterDetails?.studentRef || '',
            studentId: fundingRequest.offerLetterDetails?.studentId || '',
            institutionName: fundingRequest.offerLetterDetails?.institutionName || '',
            courseName: fundingRequest.offerLetterDetails?.courseName || '',
            courseTenure: fundingRequest.offerLetterDetails?.courseTenure || '',
            paymentRequirementTenure: fundingRequest.paymentRequirementTenure || '',
            agentRef: user?._id || '',
          });

          if (fundingRequest.documents && fundingRequest.documents.length > 0) {
            setDocuments(fundingRequest.documents.map(doc => ({
              documentType: doc.type || '',
              documentFile: doc.fileId || '',
              fileName: doc.type || '',
            })));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching funding data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch funding data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addDocuments = () => {
    setDocuments([
      ...documents,
      {
        documentType: '',
        documentFile: null,
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
        handleDocumentChange(index, 'documentFile', response.data.fileId);
        handleDocumentChange(index, 'fileName', file.name);
        
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amountRequired) newErrors.amountRequired = 'Amount is required';
    if (!formData.countryAppliedFor) newErrors.countryAppliedFor = 'Country is required';
    if (!formData.studentRef) newErrors.studentRef = 'Student is required';
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.institutionName) newErrors.institutionName = 'Institution name is required';
    if (!formData.courseName) newErrors.courseName = 'Course name is required';
    if (!formData.courseTenure) newErrors.courseTenure = 'Course tenure is required';
    if (!formData.paymentRequirementTenure) newErrors.paymentRequirementTenure = 'Payment tenure is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        amountRequired: parseFloat(formData.amountRequired),
        countryAppliedFor: formData.countryAppliedFor,
        offerLetterDetails: {
          studentRef: formData.studentRef,
          studentId: formData.studentId,
          institutionName: formData.institutionName,
          courseName: formData.courseName,
          courseTenure: formData.courseTenure,
        },
        paymentRequirementTenure: formData.paymentRequirementTenure,
        documents: documents
          .filter(doc => doc.documentType && doc.documentFile)
          .map(doc => ({
            type: doc.documentType,
            fileId: doc.documentFile,
          })),
        agentRef: user._id,
      };

      let response;
      if (isEditMode) {
        response = await axios.put(
          `https://abroad-backend-gray.vercel.app/api/student-funding/agent/update/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
            },
            withCredentials: true
          }
        );
      } else {
        response = await axios.post(
          'https://abroad-backend-gray.vercel.app/api/student-funding/agent/add',
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
            },
            withCredentials: true
          }
        );
      }

      if (response.data.success) {
        toast({
          title: 'Success',
          description: `Student funding request ${isEditMode ? 'updated' : 'created'} successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/agent/student-funding');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle new student creation
  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateStudent = async () => {
    if (!newStudent.name || !newStudent.email) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        'https://abroad-backend-gray.vercel.app/auth/studentCreate',
        newStudent,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
          },
          withCredentials: true
        }
      );

      if (response.data) {
        toast({
          title: 'Success',
          description: 'Student created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        await fetchStudents();
        setFormData(prev => ({ ...prev, studentRef: response.data._id }));
        closeModal();
      }
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create student',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading && isEditMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            {isEditMode ? 'Edit Student Funding Request' : 'Add New Student Funding Request'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
            {isEditMode ? 'Update the funding request details' : 'Fill in the details for a new funding request'}
          </Typography>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount Required *"
                  name="amountRequired"
                  type="number"
                  value={formData.amountRequired}
                  onChange={handleChange}
                  error={Boolean(errors.amountRequired)}
                  helperText={errors.amountRequired}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country Applied For *"
                  name="countryAppliedFor"
                  value={formData.countryAppliedFor}
                  onChange={handleChange}
                  error={Boolean(errors.countryAppliedFor)}
                  helperText={errors.countryAppliedFor}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={Boolean(errors.paymentRequirementTenure)}>
                  <InputLabel>Payment Requirement Tenure *</InputLabel>
                  <Select
                    name="paymentRequirementTenure"
                    value={formData.paymentRequirementTenure}
                    onChange={handleChange}
                    label="Payment Requirement Tenure *"
                  >
                    {paymentTenureOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                  {errors.paymentRequirementTenure && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.paymentRequirementTenure}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FormControl fullWidth error={Boolean(errors.studentRef)}>
                    <InputLabel>Select Student *</InputLabel>
                    <Select
                      name="studentRef"
                      value={formData.studentRef}
                      onChange={handleChange}
                      label="Select Student *"
                    >
                      {students.map(student => (
                        <MenuItem key={student._id} value={student._id}>
                          {student.name} ({student.email})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.studentRef && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {errors.studentRef}
                      </Typography>
                    )}
                  </FormControl>
                  <IconButton
                    onClick={openModal}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </Card>

          {/* Offer Letter Details */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
              Offer Letter Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Student ID *"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  error={Boolean(errors.studentId)}
                  helperText={errors.studentId}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Institution Name *"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  error={Boolean(errors.institutionName)}
                  helperText={errors.institutionName}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Course Name *"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  error={Boolean(errors.courseName)}
                  helperText={errors.courseName}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Course Tenure *"
                  name="courseTenure"
                  value={formData.courseTenure}
                  onChange={handleChange}
                  error={Boolean(errors.courseTenure)}
                  helperText={errors.courseTenure}
                  placeholder="e.g., 2 Years"
                />
              </Grid>
            </Grid>
          </Card>

          {/* Documents */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Documents
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addDocuments}
                size="small"
              >
                Add Document
              </Button>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {documents.length === 0 ? (
              <Alert severity="info">
                No documents added yet. Click "Add Document" to upload documents.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {documents.map((doc, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Document Type"
                            value={doc.documentType}
                            onChange={(e) => handleDocumentChange(index, 'documentType', e.target.value)}
                            placeholder="e.g., Student Passport, Offer Letter"
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
                            {doc.fileName || 'Upload File'}
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
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>

          {/* Action Buttons */}
          <Card sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate('/agent/student-funding')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Submit'}
              </Button>
            </Stack>
          </Card>
        </form>

        {/* Create New Student Modal */}
        <Modal open={isModalOpen} onClose={closeModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 500,
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Create New Student</Typography>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Student Name *"
                  name="name"
                  value={newStudent.name}
                  onChange={handleNewStudentChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={newStudent.email}
                  onChange={handleNewStudentChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={newStudent.phone}
                  onChange={handleNewStudentChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Passport Number"
                  name="passportNumber"
                  value={newStudent.passportNumber}
                  onChange={handleNewStudentChange}
                />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button variant="outlined" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateStudent}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                Create Student
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default StudentFundingForm;
