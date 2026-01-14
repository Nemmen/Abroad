import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
  CircularProgress,
  Link as MuiLink,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  FileText as FileTextIcon,
  User as UserIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  DollarSign as DollarIcon,
  Briefcase as BriefcaseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  X as CancelIcon,
  ExternalLink as ExternalLinkIcon,
  Upload as UploadIcon,
  Trash2 as Trash2Icon,
} from 'react-feather';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import { deleteGicForm } from '../../services/ApiEndpoint';

const formatGICData = (data) => {
  // Function to format the date to a readable format (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  const data1 = {
    AgentName: data.agentRef?.name || '',
    studentName: data.studentRef?.name || '',
    ...data,
    accOpeningDate: formatDate(data.accOpeningDate),
  };

  const { agentRef, studentRef, ...rest } = data1;
  return rest;
};

const fieldIcons = {
  sNo: FileTextIcon,
  studentName: UserIcon,
  studentPassportNo: FileTextIcon,
  studentEmail: MailIcon,
  studentPhoneNo: PhoneIcon,
  bankVendor: BriefcaseIcon,
  accFundingMonth: DollarIcon,
  commissionAmt: DollarIcon,
  amount: DollarIcon,
  tds: DollarIcon,
  netPayable: DollarIcon,
  commissionStatus: BriefcaseIcon,
};

// Function to format field labels for display
const formatFieldLabel = (label) => {
  if (label === 'accOpeningDate') return 'Account Opening Date';
  return label
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function GicView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const { colorMode } = useColorMode();
  
  // Document management states
  const [documents, setDocuments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // DELETE functionality states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Document type options to match GicForm
  const documentTypeOptions = ['aadhar', 'pan', 'ol', 'passport'];
  
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
      divider: colorMode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
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
          'https://abroad-backend-gray.vercel.app/auth/viewAllGicForm',
        );
        if (response.data.success) {
          const formData1 = response.data.gicForms.find(
            (form) => form._id === id,
          );
          
          if (formData1) {
            setFormData(formatGICData(formData1));
            setEditableData({
              type: formData1?.type || '',
              Agents: formData1?.agentRef?._id || '',
              passportNo: formData1?.studentPassportNo || '',
              studentRef: formData1?.studentRef?.name || formData1?.studentName || '',
              email: formData1?.studentEmail || '',
              phoneNo: formData1?.studentPhoneNo || '',
              bankVendor: formData1?.bankVendor || '',
              accOpeningDate: formData1?.accOpeningDate || '',
              accOpeningMonth: formData1?.accOpeningMonth || '',
              accFundingMonth: formData1?.fundingMonth || '',
              commission: formData1?.commissionAmt || '',
              tds: formData1?.tds || '',
              netPayable: formData1?.netPayable || '',
              commissionStatus: formData1?.commissionStatus || 'Not Received',
            });
            
            // Initialize documents with proper null checks
            setDocuments(formData1?.studentDocuments && typeof formData1.studentDocuments === 'object' ? 
              Object.entries(formData1.studentDocuments).map(([type, data]) => ({
                documentType: type,
                documentFile: data?.documentFile || '',
                fileId: data?.fileId || ''
              })) : []
            );
          } else {
            // Handle case where GIC form is not found
            console.error('GIC form not found with ID:', id);
            setFormData({});
            setEditableData({
              type: '',
              Agents: '',
              passportNo: '',
              studentRef: '',
              email: '',
              phoneNo: '',
              bankVendor: '',
              accOpeningDate: '',
              accOpeningMonth: '',
              accFundingMonth: '',
              commission: '',
              tds: '',
              netPayable: '',
              commissionStatus: 'Not Received',
            });
            setDocuments([]);
          }
        } else {
          // Handle API error response
          console.error('API returned success: false');
          setFormData({});
          setEditableData({
            type: '',
            Agents: '',
            passportNo: '',
            studentRef: '',
            email: '',
            phoneNo: '',
            bankVendor: '',
            accOpeningDate: '',
            accOpeningMonth: '',
            accFundingMonth: '',
            commission: '',
            tds: '',
            netPayable: '',
            commissionStatus: 'Not Received',
          });
          setDocuments([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set safe default values to prevent null reference errors
        setFormData({});
        setEditableData({
          type: '',
          Agents: '',
          passportNo: '',
          studentRef: '',
          email: '',
          phoneNo: '',
          bankVendor: '',
          accOpeningDate: '',
          accOpeningMonth: '',
          accFundingMonth: '',
          commission: '',
          tds: '',
          netPayable: '',
          commissionStatus: 'Not Received',
        });
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  // Document management functions
  const addDocument = () => {
    if (documents.length < 4) {
      setDocuments([
        ...documents,
        { documentType: '', documentFile: null, fileId: '' }
      ]);
    }
  };

  const removeDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  // DELETE functionality - Handle delete confirmation
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteGicForm(id);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'GIC record deleted successfully',
          severity: 'success'
        });
        
        // Close dialog and navigate back to GIC list
        setTimeout(() => {
          setIsDeleteDialogOpen(false);
          navigate('/agent/gic');
        }, 1000);
      }
    } catch (error) {
      console.error('Error deleting GIC record:', error);
      
      // Handle different error scenarios
      let errorMessage = 'Failed to delete GIC record';
      
      if (error.response?.status === 404) {
        errorMessage = 'GIC record not found or already deleted';
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized - Please login again';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDocumentChange = (index, name, value) => {
    const updatedDocuments = documents.map((doc, i) =>
      i === index ? { ...doc, [name]: value } : doc
    );
    setDocuments(updatedDocuments);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // Handle document uploads if any new files are selected
      const studentDocuments = {};
      const filesToUpload = [];
      const types = [];
      
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        if (doc.documentType) {
          if (doc.documentFile && typeof doc.documentFile === 'object') {
            // New file to upload
            filesToUpload.push(doc.documentFile);
            types.push(doc.documentType);
          } else if (doc.documentFile && typeof doc.documentFile === 'string') {
            // Existing file URL
            studentDocuments[doc.documentType] = {
              fileId: doc.fileId || '',
              documentFile: doc.documentFile
            };
          }
        }
      }
      
      // Upload new files if any
      if (filesToUpload.length > 0) {
        try {
          const formDataForUpload = new FormData();
          filesToUpload.forEach((file, index) => {
            formDataForUpload.append('files', file);
          });
          
          const uploadResponse = await axios.post(
            'https://abroad-backend-gray.vercel.app/upload/upload-multiple',
            formDataForUpload,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          
          if (uploadResponse.data.success) {
            const uploads = uploadResponse.data.uploads;
            for (let i = 0; i < types.length; i++) {
              studentDocuments[types[i]] = {
                fileId: uploads[i].fileId,
                documentFile: uploads[i].viewLink
              };
            }
          }
        } catch (uploadError) {
          console.error('Error uploading files:', uploadError);
          setSnackbar({
            open: true,
            message: 'Error uploading files. Please try again.',
            severity: 'error'
          });
          setSaveLoading(false);
          return;
        }
      }
      
      // Map the form data to match the backend API exactly as provided
      const apiData = {
        studentPhoneNo: editableData.phoneNo,
        studentPassportNo: editableData.passportNo,
        bankVendor: editableData.bankVendor,
        fundingMonth: editableData.accFundingMonth,
        commissionAmt: editableData.commission,
        tds: editableData.tds,
        netPayable: editableData.netPayable,
        commissionStatus: editableData.commissionStatus,
      };
      
      // Add studentDocuments if any documents exist
      if (Object.keys(studentDocuments).length > 0) {
        apiData.studentDocuments = studentDocuments;
      }
      
      // Remove empty fields
      Object.keys(apiData).forEach(key => {
        if (apiData[key] === '' || apiData[key] === null || apiData[key] === undefined) {
          delete apiData[key];
        }
      });

      const response = await axios.put(
        `https://abroad-backend-gray.vercel.app/auth/updateGicForm/${id}`,
        apiData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      if (response.data.success) {
        // Use the updated data from the response
        const updatedGIC = response.data.updatedGIC || response.data.gicForm || response.data.data;
        if (updatedGIC) {
          const formattedData = formatGICData(updatedGIC);
          setFormData(formattedData);
          
          // Update documents state with the new data
          setDocuments(updatedGIC?.studentDocuments && typeof updatedGIC.studentDocuments === 'object' ? 
            Object.entries(updatedGIC.studentDocuments).map(([type, data]) => ({
              documentType: type,
              documentFile: data?.documentFile || '',
              fileId: data?.fileId || ''
            })) : []
          );
        }
        
        setIsEditing(false);
        setSnackbar({
          open: true,
          message: 'GIC form updated successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating GIC form:', error);
      setSnackbar({
        open: true,
        message: 'Error updating GIC form. Please try again.',
        severity: 'error'
      });
    }
    setSaveLoading(false);
  };

  // List of fields that can be edited
  const editableFields = [
    'type',
    'studentName',
    'studentEmail',
    'studentPhoneNo',
    'studentPassportNo',
    'accOpeningDate',
    'bankVendor',
    'accOpeningMonth',
    'fundingMonth',
    'amount',
    'commissionAmt',
    'tds',
    'netPayable',
    'commissionStatus',
  ];

  const getIcon = (label) => {
    const IconComponent = fieldIcons[label] || FileTextIcon;
    return <IconComponent size={18} />;
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Typography variant="h5" fontWeight="600" color="white">
              {formData?.type ? formData.type : 'GIC'} Details
            </Typography>
            
            {isEditing ? (
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saveLoading}
                  startIcon={<SaveIcon size={18} />}
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#10B981',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      color: '#059669',
                    } 
                  }}
                >
                  {saveLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                  startIcon={<CancelIcon size={18} />}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { 
                      borderColor: 'white', 
                      backgroundColor: 'rgba(255,255,255,0.1)' 
                    } 
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                  startIcon={<EditIcon size={18} />}
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#11047A',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.9)',
                    } 
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  startIcon={<Trash2Icon size={18} />}
                  disabled={isDeleting}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { 
                      borderColor: '#ef4444', 
                      backgroundColor: 'rgba(239,68,68,0.1)',
                      color: '#fca5a5'
                    } 
                  }}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>
          
          <CardContent sx={{ p: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={6}>
                <CircularProgress />
              </Box>
            ) : formData && Object.keys(formData).length > 0 ? (
              <>
                {!isEditing ? (
                  // View Mode - Display all data
                  <Grid container spacing={3}>
                    {[
                      { key: 'type', label: 'Service Type' },
                      { key: 'AgentName', label: 'Agent Name' },
                      { key: 'studentName', label: 'Student Name' },
                      { key: 'studentPassportNo', label: 'Passport No' },
                      { key: 'studentEmail', label: 'Email' },
                      { key: 'studentPhoneNo', label: 'Phone No' },
                      { key: 'bankVendor', label: 'Bank Vendor' },
                      { key: 'accOpeningDate', label: 'Account Opening Date' },
                      { key: 'accOpeningMonth', label: 'Account Opening Month' },
                      { key: 'fundingMonth', label: 'Funding Month' },
                      { key: 'commissionAmt', label: 'Commission Amount' },
                      { key: 'tds', label: 'TDS' },
                      { key: 'netPayable', label: 'Net Payable' },
                      { key: 'commissionStatus', label: 'Commission Status' },
                    ].map(({ key, label }) => (
                      formData[key] && (
                        <Grid item xs={12} md={6} key={key}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={2}>
                                {getIcon(key)}
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary" 
                                  fontWeight={500}
                                  ml={1}
                                >
                                  {label}
                                </Typography>
                              </Box>
                              <Typography 
                                variant="h6" 
                                component="div" 
                                fontWeight={600}
                              >
                                {key === 'accOpeningDate' && formData[key]
                                  ? new Date(formData[key]).toLocaleDateString('en-GB')
                                  : formData[key] || 'Not Set'}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                    ))}
                  </Grid>
                ) : (
                  // Edit Mode - Complete form matching GicForm.jsx
                  <Grid container spacing={3}>
                    {/* Service Type */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Type Of Service</InputLabel>
                        <Select
                          value={editableData.type || ''}
                          onChange={(e) => handleChange('type', e.target.value)}
                          label="Type Of Service"
                        >
                          <MenuItem value="">Select Type of Service</MenuItem>
                          <MenuItem value="GIC">GIC</MenuItem>
                          <MenuItem value="BLOCKED ACCOUNT">BLOCKED ACCOUNT</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Agent Name - Display only */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Agent Name"
                        value={formData.AgentName || ''}
                        InputProps={{ readOnly: true }}
                        variant="filled"
                      />
                    </Grid>

                    {/* Passport No */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Passport No."
                        value={editableData.passportNo || ''}
                        onChange={(e) => handleChange('passportNo', e.target.value)}
                        placeholder="Enter passport number"
                      />
                    </Grid>

                    {/* Student Name */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Student Name"
                        value={editableData.studentRef || ''}
                        onChange={(e) => handleChange('studentRef', e.target.value)}
                        placeholder="Enter student name"
                      />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        type="email"
                        label="Email"
                        value={editableData.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </Grid>

                    {/* Phone No */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        type="tel"
                        label="Phone No."
                        value={editableData.phoneNo || ''}
                        onChange={(e) => handleChange('phoneNo', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </Grid>

                    {/* Bank Vendor */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Bank Vendor</InputLabel>
                        <Select
                          value={editableData.bankVendor || ''}
                          onChange={(e) => handleChange('bankVendor', e.target.value)}
                          label="Bank Vendor"
                        >
                          <MenuItem value="">Select Bank Vendor</MenuItem>
                          <MenuItem value="ICICI">ICICI</MenuItem>
                          <MenuItem value="RBC">RBC</MenuItem>
                          <MenuItem value="CIBC">CIBC</MenuItem>
                          <MenuItem value="BOM">BOM</MenuItem>
                          <MenuItem value="Expatrio">Expatrio</MenuItem>
                          <MenuItem value="Fintiba">Fintiba</MenuItem>
                          <MenuItem value="TD">TD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Account Opening Date */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        type="date"
                        label="Account Opening Date"
                        value={editableData.accOpeningDate ? editableData.accOpeningDate.split('T')[0] : ''}
                        onChange={(e) => handleChange('accOpeningDate', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Account Opening Month */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Account Opening Month</InputLabel>
                        <Select
                          value={editableData.accOpeningMonth || ''}
                          onChange={(e) => handleChange('accOpeningMonth', e.target.value)}
                          label="Account Opening Month"
                        >
                          <MenuItem value="">Select Month</MenuItem>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                            return (
                              <MenuItem key={month} value={month}>
                                {month}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Account Funding Month */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Account Funding Month</InputLabel>
                        <Select
                          value={editableData.accFundingMonth || ''}
                          onChange={(e) => handleChange('accFundingMonth', e.target.value)}
                          label="Account Funding Month"
                        >
                          <MenuItem value="">Select Month</MenuItem>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                            return (
                              <MenuItem key={month} value={month}>
                                {month}
                              </MenuItem>
                            );
                          })}
                          <MenuItem value="Not Funded Yet">Not Funded Yet</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Commission */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Commission"
                        value={editableData.commission || ''}
                        onChange={(e) => handleChange('commission', e.target.value)}
                        placeholder="Enter commission amount"
                        inputProps={{ min: 0 }}
                      />
                    </Grid>

                    {/* TDS */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="TDS"
                        value={editableData.tds || ''}
                        onChange={(e) => handleChange('tds', e.target.value)}
                        placeholder="Enter TDS amount"
                        inputProps={{ min: 0 }}
                      />
                    </Grid>

                    {/* Net Payable */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Net Payable"
                        value={editableData.netPayable || ''}
                        onChange={(e) => handleChange('netPayable', e.target.value)}
                        placeholder="Enter net payable amount"
                        inputProps={{ min: 0 }}
                      />
                    </Grid>

                    {/* Commission Status */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Commission Status</InputLabel>
                        <Select
                          value={editableData.commissionStatus || ''}
                          onChange={(e) => handleChange('commissionStatus', e.target.value)}
                          label="Commission Status"
                        >
                          <MenuItem value="">Select Status</MenuItem>
                          <MenuItem value="Not Received">Not Received</MenuItem>
                          <MenuItem value="Paid">Paid</MenuItem>
                          <MenuItem value="Under Processing">Under Processing</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}

                {/* Documents Section */}
                <Box mt={4}>
                  <Typography variant="h6" fontWeight="600" mb={3}>
                    Documents
                  </Typography>
                  
                  {/* Add Document Button (Edit Mode Only) */}
                  {isEditing && (
                    <Button
                      variant="contained"
                      onClick={addDocument}
                      disabled={documents.length >= 4}
                      startIcon={<UploadIcon size={18} />}
                      sx={{ mb: 3 }}
                    >
                      Add Document ({documents.length}/4)
                    </Button>
                  )}

                  {/* Documents List */}
                  {documents.map((doc, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        {isEditing ? (
                          <Grid container spacing={2} alignItems="center">
                            {/* Document Type */}
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth required>
                                <InputLabel>Document Type</InputLabel>
                                <Select
                                  value={doc.documentType || ''}
                                  onChange={(e) => handleDocumentChange(index, 'documentType', e.target.value)}
                                  label="Document Type"
                                >
                                  <MenuItem value="">Select Document Type</MenuItem>
                                  {documentTypeOptions.map((type) => (
                                    <MenuItem key={type} value={type}>
                                      {type === 'ol' ? 'Offer Letter' : type.toUpperCase()}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>

                            {/* File Upload */}
                            <Grid item xs={12} sm={6}>
                              <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadIcon size={18} />}
                                fullWidth
                              >
                                {doc.documentFile && typeof doc.documentFile === 'object'
                                  ? doc.documentFile.name
                                  : doc.documentFile && typeof doc.documentFile === 'string'
                                  ? 'Replace File'
                                  : 'Choose File'}
                                <input
                                  type="file"
                                  hidden
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => handleDocumentChange(index, 'documentFile', e.target.files[0])}
                                />
                              </Button>
                            </Grid>

                            {/* Remove Button */}
                            <Grid item xs={12} sm={2}>
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => removeDocument(index)}
                                startIcon={<Trash2Icon size={18} />}
                                fullWidth
                              >
                                Remove
                              </Button>
                            </Grid>
                          </Grid>
                        ) : (
                          // View Mode
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                Document Type
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {doc.documentType === 'ol' ? 'Offer Letter' : doc.documentType?.toUpperCase() || 'N/A'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">
                                File
                              </Typography>
                              {doc.documentFile ? (
                                <Button
                                  component="a"
                                  href={doc.documentFile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  startIcon={<ExternalLinkIcon size={16} />}
                                  sx={{ p: 0, textTransform: 'none' }}
                                >
                                  View File
                                </Button>
                              ) : (
                                <Typography color="text.secondary">No file</Typography>
                              )}
                            </Grid>
                          </Grid>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {documents.length === 0 && (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="text.secondary" textAlign="center">
                          No documents uploaded yet.
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              </>
            ) : (
              <Box display="flex" justifyContent="center" p={6}>
                <Typography>No data available</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* DELETE Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Delete GIC Record
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this GIC record? This action cannot be undone.
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
              autoFocus
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default GicView;