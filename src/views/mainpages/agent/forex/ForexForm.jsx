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
  Divider,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import countries from './csvjson.json';

const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');

function ForexForm() {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [formData, setFormData] = useState({
    agentRef: '',
    studentRef: '',
    country: '',
    currencyBooked: '',
    quotation: '',
    studentPaid: '',
    docsStatus: '',
    ttCopyStatus: '',
    agentCommission: '',
    tds: '',
    netPayable: '',
    commissionStatus: '',
  });
  const [passportFile, setPassportFile] = useState(null);
  const [offerLetterFile, setOfferLetterFile] = useState(null);

  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    agentRef: '',
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  
  const showToast = (message, severity) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };
  
  const [agents, setAgents] = useState([]);

  // Create MUI theme based on Chakra color mode
  const theme = createTheme({
    palette: {
      mode: colorMode,
      primary: {
        main: colorMode === 'light' ? '#3B82F6' : '#90CAF9',
      },
      secondary: {
        main: colorMode === 'light' ? '#10B981' : '#5CDB95',
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
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
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
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://abroad-backend-gray.vercel.app/auth/getStudent');
        const data = await response.json();
        if (response.ok) setStudents(data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [isModalOpen]);

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
      const response = await fetch('https://abroad-backend-gray.vercel.app/auth/studentCreate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      const result = await response.json();

      if (response.ok) {
        setStudents([...students, result.newStudent]);
        setFormData({ ...formData, studentRef: result.newStudent._id });
        showToast('New student has been added', 'success');
        closeModal();
      } else {
        throw new Error(result.message || 'Failed to create student.');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAgents = async () => {
      const apiUrl = 'https://abroad-backend-gray.vercel.app/auth/getAllusers';
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();
        if (response.ok) {
          const filterResult = result.data.filter((data)=> data.userStatus === 'active');
          setAgents(filterResult);
        } else {
          console.error('Server Error:', result);
        }
      } catch (error) {
        console.error('Network Error:', error);
      }
    };
    fetchAgents();
  }, []);

  const whoOptions = [
    'Self',
    'Brother',
    'Sister',
    'Husband',
    'Father',
    'Mother',
    'Grand Father',
    'Grand Mother',
  ];
  
  const documentOptions = [
    'Aadhar',
    'Pan',
    'Account statement',
    'Passbook Front',
    'Cheque Copy',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDocumentChange = (index, name, value) => {
    const updatedDocuments = documents.map((doc, i) =>
      i === index ? { ...doc, [name]: value } : doc,
    );
    setDocuments(updatedDocuments);
  };

  const handleFileChange = (index, fileType, file) => {
    const updatedDocuments = documents.map((doc, i) =>
      i === index ? { ...doc, [fileType]: file } : doc,
    );
    setDocuments(updatedDocuments);
  };

  const handleFileChangeoffpass = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const validateForm = () => {
    const {
      agentRef,
      studentRef,
      country,
      currencyBooked,
      quotation,
      studentPaid,
      docsStatus,
      ttCopyStatus,
      agentCommission,
      tds,
      netPayable,
      commissionStatus,
    } = formData;
    
    if (
      !agentRef ||
      !studentRef ||
      !country ||
      !currencyBooked ||
      !quotation ||
      !studentPaid ||
      !docsStatus ||
      !ttCopyStatus ||
      !agentCommission ||
      !tds ||
      !netPayable ||
      !commissionStatus
    ) {
      showToast('Please fill in all required fields', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      try {
        const fileUploadFormData = new FormData();
        fileUploadFormData.append(
          'folderId',
          '1f8tN2sgd_UBOdxpDwyQ1CMsyVvi1R96f',
        );
        fileUploadFormData.append('studentRef', formData.studentRef);
        fileUploadFormData.append('type', 'forex-documents');

        const files = [
          passportFile,
          offerLetterFile,
          ...documents.map((doc) => doc.documentFile),
        ].filter(Boolean);

        files.forEach((file) => {
          fileUploadFormData.append('files', file);
        });

        const uploadResponse = await fetch(
          'https://abroad-backend-gray.vercel.app/api/uploads/upload',
          {
            method: 'POST',
            body: fileUploadFormData,
            headers: {
              Accept: 'application/json',
            },
          },
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || 'File upload failed');
        }

        const formdata1 = {
          ...formData,
          passportFile: uploadResult.uploads[0].fileId,
          offerLetterFile: uploadResult.uploads[1].fileId,
        };

        const uploadedFiles = uploadResult.uploads
          .map((file, index) => {
            if (index > 1) {
              return {
                documentOf: documents[index - 2].documentOf,
                documentType: documents[index - 2].documentType,
                documentFile: file.fileId,
              };
            }
            return null;
          })
          .filter(Boolean);

        const finalFormData = {
          ...formdata1,
          documents: uploadedFiles,
        };

        const response = await fetch(
          'https://abroad-backend-gray.vercel.app/auth/addForexForm',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalFormData),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to submit the form');
        }

        showToast('Your form has been submitted successfully!', 'success');
        navigate(`/admin/forex/${result.data._id}`);
      } catch (error) {
        console.error('Error:', error.message);
        showToast(`Failed to submit the form: ${error.message}`, 'error');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const addDocumentField = () => {
    setDocuments([
      ...documents,
      { documentOf: '', documentType: '', documentFile: null },
    ]);
  };

  const removeDocumentField = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
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
              borderTopRightRadius: '12px'
            }}
          >
            <Typography variant="h5" fontWeight="600" color="white">
              Add New Forex Transaction
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="agent-label">Agent</InputLabel>
                    <Select
                      labelId="agent-label"
                      name="agentRef"
                      value={formData.agentRef}
                      onChange={handleChange}
                      label="Agent"
                    >
                      {agents.map((agent) => (
                        <MenuItem key={agent._id} value={agent._id}>
                          {agent.agentCode}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date"
                    type="text"
                    value={getCurrentDate()}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="student-label">Student Name</InputLabel>
                    <Select
                      labelId="student-label"
                      name="studentRef"
                      value={formData.studentRef}
                      onChange={(e) => {
                        if (e.target.value === 'create') {
                          openModal();
                        } else {
                          handleChange(e);
                        }
                      }}
                      label="Student Name"
                    >
                      {students.map((student) => (
                        <MenuItem key={student?._id} value={student?._id}>
                          {`${student?.studentCode} - ${student?.name} - ${student?.email}`}
                        </MenuItem>
                      ))}
                      <MenuItem value="create">Create New student</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                      labelId="country-label"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      label="Country"
                    >
                      {countries.map((country, index) => (
                        <MenuItem key={index} value={country.Name}>
                          {country.Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Currency Booked"
                    name="currencyBooked"
                    value={formData.currencyBooked}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Quotation"
                    name="quotation"
                    type="number"
                    value={formData.quotation}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Student Paid"
                    name="studentPaid"
                    type="number"
                    value={formData.studentPaid}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="docsStatus-label">DOCs Status</InputLabel>
                    <Select
                      labelId="docsStatus-label"
                      name="docsStatus"
                      value={formData.docsStatus}
                      onChange={handleChange}
                      label="DOCs Status"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Received">Received</MenuItem>
                      <MenuItem value="Verified">Verified</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="ttCopyStatus-label">TT Copy Status</InputLabel>
                    <Select
                      labelId="ttCopyStatus-label"
                      name="ttCopyStatus"
                      value={formData.ttCopyStatus}
                      onChange={handleChange}
                      label="TT Copy Status"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Received">Received</MenuItem>
                      <MenuItem value="Verified">Verified</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Agent Commission"
                    name="agentCommission"
                    type="number"
                    value={formData.agentCommission}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="TDS"
                    name="tds"
                    type="number"
                    value={formData.tds}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Net Payable"
                    name="netPayable"
                    type="number"
                    value={formData.netPayable}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="commissionStatus-label">Commission Status</InputLabel>
                    <Select
                      labelId="commissionStatus-label"
                      name="commissionStatus"
                      value={formData.commissionStatus}
                      onChange={handleChange}
                      label="Commission Status"
                    >
                      <MenuItem value="Not Received">Not Received</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                      <MenuItem value="Under Processing">Under Processing</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Passport</Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<AttachFileIcon />}
                      onClick={() => document.getElementById('passportFile').click()}
                    >
                      Choose File
                    </Button>
                    <Typography variant="body2">
                      {passportFile ? passportFile.name : 'No file chosen'}
                    </Typography>
                    <input
                      type="file"
                      id="passportFile"
                      onChange={(e) => handleFileChangeoffpass(e, setPassportFile)}
                      style={{ display: 'none' }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Offer Letter</Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<AttachFileIcon />}
                      onClick={() => document.getElementById('offerLetterFile').click()}
                    >
                      Choose File
                    </Button>
                    <Typography variant="body2">
                      {offerLetterFile ? offerLetterFile.name : 'No file chosen'}
                    </Typography>
                    <input
                      type="file"
                      id="offerLetterFile"
                      onChange={(e) => handleFileChangeoffpass(e, setOfferLetterFile)}
                      style={{ display: 'none' }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Additional Documents</Typography>
                  
                  {documents.map((doc, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 3, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth required sx={{ mb: 2 }}>
                            <InputLabel id={`documentOf-label-${index}`}>Document of</InputLabel>
                            <Select
                              labelId={`documentOf-label-${index}`}
                              value={doc.documentOf}
                              onChange={(e) =>
                                handleDocumentChange(index, 'documentOf', e.target.value)
                              }
                              label="Document of"
                            >
                              {whoOptions.map((option, i) => (
                                <MenuItem key={i} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth required sx={{ mb: 2 }}>
                            <InputLabel id={`documentType-label-${index}`}>Document Type</InputLabel>
                            <Select
                              labelId={`documentType-label-${index}`}
                              value={doc.documentType}
                              onChange={(e) =>
                                handleDocumentChange(index, 'documentType', e.target.value)
                              }
                              label="Document Type"
                            >
                              {documentOptions.map((option, i) => (
                                <MenuItem key={i} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>Upload Document</Typography>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Button
                              variant="contained"
                              startIcon={<AttachFileIcon />}
                              onClick={() => document.getElementById(`documentFile${index}`).click()}
                            >
                              Choose File
                            </Button>
                            <Typography variant="body2">
                              {doc.documentFile ? doc.documentFile.name : 'No file chosen'}
                            </Typography>
                            <input
                              type="file"
                              id={`documentFile${index}`}
                              onChange={(e) =>
                                handleFileChange(index, 'documentFile', e.target.files[0])
                              }
                              style={{ display: 'none' }}
                            />
                            
                            <IconButton 
                              color="error" 
                              onClick={() => removeDocumentField(index)}
                              sx={{ ml: 'auto' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<AddIcon />} 
                    onClick={addDocumentField}
                    sx={{ mt: 2 }}
                  >
                    Add Document
                  </Button>
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0D0362 0%, #3B169A 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
      
      {/* Create Student Modal */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="create-student-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
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
                <MenuItem key={agent._id} value={agent._id}>
                  {agent.agentCode}
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
              sx={{ 
                minWidth: '100px',
                background: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0D0362 0%, #3B169A 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToastOpen(false)} 
          severity={toastSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default ForexForm;