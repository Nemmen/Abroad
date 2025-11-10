import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  IconButton,
  Paper,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { useSelector } from 'react-redux';

const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');

function PaymentTaggingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { colorMode } = useColorMode();
  const { user } = useSelector((state) => state.Auth);
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    studentRef: '',
    email: '',
    mobile: '',
    institutionName: '',
    paymentReferenceNumber: '',
    dateOfLetterGeneration: getCurrentDate(),
    letterType: '',
  });

  const [paymentInstructionLetter, setPaymentInstructionLetter] = useState(null);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    agentRef: user?._id || '',
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const showToast = (message, severity) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

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
      },
    },
    components: {
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

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          'https://abroad-backend-gray.vercel.app/auth/getStudent'
        );
        if (response.data.students) {
          setStudents(response.data.students);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [isModalOpen]);

  // Fetch existing data if edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchPaymentTagging = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://abroad-backend-gray.vercel.app/api/payment-tagging/admin/get/${id}`,
            { withCredentials: true }
          );
          if (response.data.success) {
            const data = response.data.data;
            setFormData({
              studentRef: data.studentRef._id,
              email: data.email,
              mobile: data.mobile,
              institutionName: data.institutionName,
              paymentReferenceNumber: data.paymentReferenceNumber,
              dateOfLetterGeneration: data.dateOfLetterGeneration
                ? format(new Date(data.dateOfLetterGeneration), 'yyyy-MM-dd')
                : getCurrentDate(),
              letterType: data.letterType,
            });
          }
        } catch (error) {
          console.error('Error fetching payment tagging:', error);
          showToast('Failed to fetch data', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchPaymentTagging();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleNewStudentSubmit = async () => {
    setLoading(true);
    if (!newStudent.name || !newStudent.email) {
      showToast('Please fill in both Name and Email', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://abroad-backend-gray.vercel.app/auth/studentCreate',
        { ...newStudent, agentRef: user._id }
      );
      if (response.data.newStudent) {
        setStudents([...students, response.data.newStudent]);
        setFormData({ ...formData, studentRef: response.data.newStudent._id });
        showToast('New student has been added', 'success');
        setIsModalOpen(false);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create student', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const {
      studentRef,
      email,
      mobile,
      institutionName,
      paymentReferenceNumber,
      dateOfLetterGeneration,
      letterType,
    } = formData;

    if (
      !studentRef ||
      !email ||
      !mobile ||
      !institutionName ||
      !paymentReferenceNumber ||
      !dateOfLetterGeneration ||
      !letterType
    ) {
      showToast('Please fill in all required fields', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let paymentLetterFileId = null;

      // Upload files if not in edit mode or if new files are added
      if (paymentInstructionLetter) {
        const fileUploadFormData = new FormData();
        fileUploadFormData.append('folderId', '1f8tN2sgd_UBOdxpDwyQ1CMsyVvi1R96f');
        fileUploadFormData.append('studentRef', formData.studentRef);
        fileUploadFormData.append('type', 'payment-tagging-documents');

        fileUploadFormData.append('files', paymentInstructionLetter);

        const uploadResponse = await axios.post(
          'https://abroad-backend-gray.vercel.app/api/uploads/upload',
          fileUploadFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (uploadResponse.data.uploads && uploadResponse.data.uploads.length > 0) {
          paymentLetterFileId = uploadResponse.data.uploads[0].fileId;
        }
      }

      const submitData = {
        ...formData,
        agentRef: user._id,
        ...(paymentLetterFileId && { paymentInstructionLetter: paymentLetterFileId }),
      };

      let response;
      if (isEditMode) {
        response = await axios.put(
          `https://abroad-backend-gray.vercel.app/api/payment-tagging/agent/update/${id}`,
          submitData,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          'https://abroad-backend-gray.vercel.app/api/payment-tagging/agent/add',
          submitData,
          { withCredentials: true }
        );
      }

      if (response.data.success) {
        showToast(
          isEditMode
            ? 'Payment tagging updated successfully!'
            : 'Payment tagging created successfully!',
          'success'
        );
        setTimeout(() => {
          navigate(`/agent/payment-tagging/view/${response.data.data._id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast(
        error.response?.data?.message || 'Failed to submit the form',
        'error'
      );
    } finally {
      setLoading(false);
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
            <Typography variant="h5" fontWeight="600" color="white">
              {isEditMode ? 'Edit Payment Tagging' : 'Add New Payment Tagging'}
            </Typography>
          </Box>

          {/* Instruction Banner */}
          <Paper
            sx={{
              m: 3,
              p: 2,
              backgroundColor: '#EFF6FF',
              border: '1px solid #3B82F6',
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <InfoIcon color="primary" />
              <Typography variant="body2" color="primary">
                <strong>Want to tag CIBC letter?</strong> Create the letter using code{' '}
                <strong>Abrocare</strong> & then submit the details on the portal.
              </Typography>
            </Stack>
          </Paper>

          <CardContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Student Selection */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Student</InputLabel>
                    <Select
                      name="studentRef"
                      value={formData.studentRef}
                      label="Student"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>Select Student</em>
                      </MenuItem>
                      {students.map((student) => (
                        <MenuItem key={student._id} value={student._id}>
                          {student.name} ({student.email})
                        </MenuItem>
                      ))}
                      <MenuItem
                        onClick={() => setIsModalOpen(true)}
                        sx={{ color: 'primary.main', fontWeight: 600 }}
                      >
                        <AddIcon fontSize="small" sx={{ mr: 1 }} />
                        Add New Student
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Mobile */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Mobile Number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Institution Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Institution Name"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Payment Reference Number */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Payment Reference Number"
                    name="paymentReferenceNumber"
                    value={formData.paymentReferenceNumber}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Date of Letter Generation */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Date of Letter Generation"
                    name="dateOfLetterGeneration"
                    type="date"
                    value={formData.dateOfLetterGeneration}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Letter Type */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Letter Type</InputLabel>
                    <Select
                      name="letterType"
                      value={formData.letterType}
                      label="Letter Type"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>Select Letter Type</em>
                      </MenuItem>
                      <MenuItem value="Flywire">Flywire</MenuItem>
                      <MenuItem value="Convera">Convera</MenuItem>
                      <MenuItem value="Cibc">Cibc</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Payment Instruction Letter Upload */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Payment Instruction Letter (Optional)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AttachFileIcon />}
                    fullWidth
                  >
                    {paymentInstructionLetter
                      ? paymentInstructionLetter.name
                      : 'Upload Payment Instruction Letter'}
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        setPaymentInstructionLetter(e.target.files[0])
                      }
                    />
                  </Button>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/agent/payment-tagging')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading && <CircularProgress size={20} />}
                    >
                      {loading ? 'Submitting...' : isEditMode ? 'Update' : 'Submit'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/* New Student Modal */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Add New Student</Typography>
              <IconButton onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Student Name"
                name="name"
                value={newStudent.name}
                onChange={handleNewStudentChange}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newStudent.email}
                onChange={handleNewStudentChange}
              />
              <Button
                variant="contained"
                onClick={handleNewStudentSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Student'}
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Toast Notification */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={4000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setToastOpen(false)}
            severity={toastSeverity}
            sx={{ width: '100%' }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default PaymentTaggingForm;
