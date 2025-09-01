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
  InputAdornment,
  CircularProgress,
  Divider,
  IconButton,
  Alert,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Gic } from 'views/mainpages/redux/GicSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import { useColorMode } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');
const getCurrentMonth = () => format(new Date(), 'MMMM');

function GicForm() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.Auth);
  const [documents, setDocuments] = useState([]);
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

  const documentTypeOptions = ['aadhar', 'pan', 'ol', 'passport'];

  const addDocuments = () => {
    setDocuments([
      ...documents,
      {
        documentType: '',
        documentFile: null,
      },
    ]);
  };

  const removeDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  const handleChangeDocument = (e, index) => {
    const { name, value, files } = e.target;
    const updatedDocuments = [...documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [name]: files ? files[0] : value,
    };
    setDocuments(updatedDocuments);
  };

  useEffect(() => {
    dispatch(Gic()); // Dispatch the async thunk to fetch data
  }, [dispatch]);

  const [formData, setFormData] = useState({
    type: '',
    Agents: user?._id,
    studentRef: '',
    passportNo: '',
    email: '',
    phoneNo: '',
    bankVendor: '',
    accFundingMonth: 'Not Funded Yet',
    commission: '',
    tds: '',
    netPayable: '',
    commissionStatus: 'Under Processing',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const { type, Agents, studentRef, passportNo, email, phoneNo, bankVendor } = formData;
    if (!type || !Agents || !studentRef || !passportNo || !email || !phoneNo || !bankVendor) {
      toast({
        title: 'Form Incomplete',
        description: 'Please fill in all required fields, including document upload.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      const newStudent = {
        name: formData.studentRef,
        email: formData.email,
        agentRef: formData.Agents,
      };

      try {
        const response = await fetch(
          'https://abroad-backend-gray.vercel.app/auth/studentCreate',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent),
          },
        );
        const result = await response.json();

        if (response.ok) {
          // Student created successfully
        } else {
          setLoading(false);
          throw new Error(result.message || 'Failed to create student.');
        }

        const formDataToSend = {
          type: formData.type,
          studentRef: result.newStudent._id,
          commissionAmt: formData.commission,
          fundingMonth: formData.accFundingMonth,
          tds: formData.tds,
          netPayable: formData.netPayable,
          commissionStatus: formData.commissionStatus,
          agentRef: formData.Agents,
          accOpeningMonth: getCurrentMonth(),
          accOpeningDate: getCurrentDate(),
          bankVendor: formData.bankVendor,
          studentEmail: formData.email,
          studentPhoneNo: formData.phoneNo,
          studentPassportNo: formData.passportNo,
          studentDocuments: {
            aadhar: {
              fileId: '',
              documentFile: '',
            },
            pan: {
              fileId: '',
              documentFile: '',
            },
            ol: {
              fileId: '',
              documentFile: '',
            },
            passport: {
              fileId: '',
              documentFile: '',
            },
          },
        };

        const types = [...documents.map((doc) => doc.documentType)];

        const filedata = new FormData();
        filedata.append('type', types);
        filedata.append('studentRef', result.newStudent._id);
        filedata.append('folderId', '1WkdyWmBhKQAI6W_M4LNLbPylZoGZ7y6V');
        const files = [...documents.map((doc) => doc.documentFile)].filter(
          Boolean,
        );
        files.forEach((file) => filedata.append('files', file));

        try {
          const response = await fetch(
            'https://abroad-backend-gray.vercel.app/api/uploads/upload',
            {
              method: 'POST',
              body: filedata,
              headers: {
                Accept: 'application/json',
              },
            },
          );
          const result = await response.json();
          const respo = result.uploads;

          for (let i = 0; i < types.length; i++) {
            formDataToSend.studentDocuments[types[i]] = {
              fileId: respo[i].fileId,
              documentFile: respo[i].viewLink,
            };
          }
        } catch (error) {
          console.error('Error uploading files:', error);
          toast({
            title: 'File Upload Error',
            description: 'An error occurred while uploading the file.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
          return;
        }

        const apiUrl = 'https://abroad-backend-gray.vercel.app/auth/addGicForm';

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataToSend),
          });

          const result = await response.json();

          if (response.ok) {
            toast({
              title: 'Form Submitted',
              description: 'GIC form has been submitted successfully.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            navigate(`/agent/gic/${result.newGIC._id}`);
            setLoading(false);
          } else {
            toast({
              title: 'Submission Failed',
              description:
                result.message || 'An error occurred during submission.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            console.error('Server Error:', result);
            setLoading(false);
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Unable to submit form. Please try again later.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          console.error('Network Error:', error);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          maxWidth: '1200px', 
          margin: '24px auto', 
          padding: { xs: 2, sm: 3 },
        }}
      >
        <Card elevation={1} sx={{ overflow: 'visible' }}>
          <CardContent sx={{ p: 0 }}>
            <Box 
              sx={{ 
                p: 3, 
                backgroundImage: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                mb: 4
              }}
            >
              <Typography variant="h5" fontWeight="600" color="white">
                GIC Application Form
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }} color="white">
                Please fill in the required details for student GIC application
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ px: 3, pb: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Service Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    name="type"
                    label="Type of Service *"
                    value={formData.type}
                    onChange={handleChange}
                    InputProps={{ sx: { height: '56px' } }}
                    required
                  >
                    <MenuItem value="">Select Type</MenuItem>
                    <MenuItem value="GIC">GIC</MenuItem>
                    <MenuItem value="BLOCKED ACCOUNT">BLOCKED ACCOUNT</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Agent Name"
                    value={user?.name?.toUpperCase() || ''}
                    InputProps={{
                      readOnly: true,
                      sx: { height: '56px' }
                    }}
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Student Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="studentRef"
                    label="Student Name *"
                    value={formData.studentRef}
                    onChange={handleChange}
                    InputProps={{ sx: { height: '56px' } }}
                    placeholder="Enter full name"
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="passportNo"
                    label="Passport No. *"
                    value={formData.passportNo}
                    onChange={handleChange}
                    InputProps={{ sx: { height: '56px' } }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="email"
                    label="Email Address *"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{ sx: { height: '56px' } }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    name="phoneNo"
                    label="Phone Number *"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    InputProps={{ sx: { height: '56px' } }}
                    required
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Bank Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    name="bankVendor"
                    label="Bank Vendor *"
                    value={formData.bankVendor}
                    onChange={handleChange}
                    InputProps={{ sx: { height: '56px' } }}
                    required
                  >
                    <MenuItem value="">Select Bank</MenuItem>
                    <MenuItem value="ICICI">ICICI</MenuItem>
                    <MenuItem value="RBC">RBC</MenuItem>
                    <MenuItem value="CIBC">CIBC</MenuItem>
                    <MenuItem value="BOM">BOM</MenuItem>
                    <MenuItem value="Expatrio">Expatrio</MenuItem>
                    <MenuItem value="Fintiba">Fintiba</MenuItem>
                    <MenuItem value="TD">TD</MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Account Opening Date"
                    value={getCurrentDate()}
                    InputProps={{
                      readOnly: true,
                      sx: { height: '56px' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Account Opening Month"
                    value={getCurrentMonth()}
                    InputProps={{
                      readOnly: true,
                      sx: { height: '56px' }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    name="accFundingMonth"
                    label="Account Funding Month"
                    value={formData.accFundingMonth}
                    onChange={handleChange}
                    InputProps={{ sx: { height: '56px' } }}
                    disabled
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem key={i} value={format(new Date(0, i), 'MMMM')}>
                        {format(new Date(0, i), 'MMMM')}
                      </MenuItem>
                    ))}
                    <MenuItem value="Not Funded Yet">Not Funded Yet</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Document Upload
              </Typography>
              
              {documents.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Please add at least one document to continue
                </Alert>
              ) : null}
              
              <Stack spacing={3} sx={{ mb: 3 }}>
                {documents.map((doc, index) => (
                  <Card 
                    key={index} 
                    variant="outlined" 
                    sx={{ 
                      p: 2,
                      position: 'relative',
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <TextField
                          select
                          name="documentType"
                          label="Document Type"
                          value={doc.documentType}
                          onChange={(e) => handleChangeDocument(e, index)}
                          required
                        >
                          <MenuItem value="">-- Select Type --</MenuItem>
                          {documentTypeOptions.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type === 'ol' ? 'Offer Letter' : type.toUpperCase()}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      
                      <Grid item xs={12} sm={5}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<AttachFileIcon />}
                          color={doc.documentFile ? "success" : "primary"}
                          fullWidth
                          sx={{ height: '56px' }}
                        >
                          {doc.documentFile ? doc.documentFile.name : 'Choose File'}
                          <input
                            type="file"
                            name="documentFile"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleChangeDocument(e, index)}
                            style={{ display: 'none' }}
                          />
                        </Button>
                      </Grid>
                      
                      <Grid item xs={12} sm={2}>
                        <IconButton 
                          color="error" 
                          onClick={() => removeDocument(index)}
                          sx={{ 
                            width: '56px', 
                            height: '56px',
                            border: '1px solid rgba(211, 47, 47, 0.5)',
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Stack>
              
              {documents.length < 4 && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addDocuments}
                  fullWidth
                  sx={{ mb: 3, height: '56px' }}
                >
                  Add Document
                </Button>
              )}
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ 
                  height: '56px',
                  background: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0D0362 0%, #3B169A 100%)',
                  },
                }}
                fullWidth
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Submit Application'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default GicForm;