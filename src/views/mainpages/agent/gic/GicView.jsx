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
} from 'react-feather';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';

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
  const [formData, setFormData] = useState({});
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();
  
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
          setFormData(formatGICData(formData1));
          setEditableData({
            studentPhoneNo: formData1?.studentPhoneNo,
            studentPassportNo: formData1?.studentPassportNo,
            bankVendor: formData1?.bankVendor,
            fundingMonth: formData1?.fundingMonth,
            commissionAmt: formData1?.commissionAmt,
            tds: formData1?.tds,
            netPayable: formData1?.netPayable,
            commissionStatus: formData1?.commissionStatus || 'Not Received',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://abroad-backend-gray.vercel.app/auth/updateGicForm/${id}`,
        editableData,
      );
      if (response.data.success) {
        setFormData((prev) => ({ ...prev, ...editableData }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating GIC form:', error);
    }
  };

  // List of fields that can be edited
  const editableFields = [
    'studentPhoneNo',
    'studentPassportNo',
    'bankVendor',
    'fundingMonth',
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
                  Save
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
            )}
          </Box>
          
          <CardContent sx={{ p: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={6}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {/* Main student information */}
                {Object.entries(formData).map(([label, value], index) => {
                  if (
                    label === '__v' ||
                    label === '_id' ||
                    label === 'studentDocuments'
                  ) {
                    return null;
                  }

                  const isEditable = editableFields.includes(label);
                  const IconComponent = fieldIcons[label] || FileTextIcon;
                  
                  return (
                    <Grid item xs={12} md={label === 'commissionStatus' ? 12 : 6} key={index}>
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
                              {getIcon(label)}
                            </Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              {formatFieldLabel(label)}
                            </Typography>
                          </Box>
                          
                          {isEditing && isEditable ? (
                            label === 'commissionStatus' ? (
                              <TextField
                                select
                                fullWidth
                                value={editableData[label] || ''}
                                onChange={(e) => handleChange(label, e.target.value)}
                                variant="outlined"
                                size="small"
                              >
                                <MenuItem value="Not Received">Not Received</MenuItem>
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Under Processing">Under Processing</MenuItem>
                              </TextField>
                            ) : (
                              <TextField
                                fullWidth
                                value={editableData[label] || ''}
                                onChange={(e) => handleChange(label, e.target.value)}
                                variant="outlined"
                                size="small"
                              />
                            )
                          ) : (
                            <Typography variant="h6" fontWeight="medium" sx={{ mt: 1 }}>
                              {typeof value === 'object' ? JSON.stringify(value) : 
                                label === 'commissionStatus' ? (
                                  <Chip 
                                    label={value} 
                                    color={
                                      value === 'Paid' ? 'success' : 
                                      value === 'Under Processing' ? 'warning' : 'default'
                                    }
                                    variant="outlined"
                                  />
                                ) : value
                              }
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
                
                {/* Document section */}
                {formData.studentDocuments && (
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="600" sx={{ mt: 2, mb: 3 }}>
                      Student Documents
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(formData.studentDocuments).map(([docLabel, doc]) => (
                        <Grid item xs={12} sm={6} md={3} key={docLabel}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              height: '100%',
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                              }
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <FileTextIcon size={18} style={{ marginRight: 8 }} color="#3B82F6" />
                                <Typography variant="subtitle2" color="text.secondary">
                                  {docLabel === 'ol' ? 'OFFER LETTER' : docLabel.toUpperCase()}
                                </Typography>
                              </Box>
                              {doc.documentFile ? (
                                <Button
                                  variant="text"
                                  component="a"
                                  href={doc.documentFile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  startIcon={<ExternalLinkIcon size={16} />}
                                  sx={{ mt: 1 }}
                                >
                                  View Document
                                </Button>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Not Provided
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default GicView;