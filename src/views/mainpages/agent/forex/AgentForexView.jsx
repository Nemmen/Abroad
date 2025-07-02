import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Divider,
  CircularProgress,
  Link as MuiLink,
  Button,
} from '@mui/material';
import {
  FileText as FileTextIcon,
  User as UserIcon,
  Globe as GlobeIcon,
  DollarSign as DollarSignIcon,
  File as FileIcon,
  CheckSquare as CheckSquareIcon,
  Percent as PercentIcon,
  Folder as FolderIcon,
  ExternalLink as ExternalLinkIcon,
} from 'react-feather';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';

const fieldIcons = {
  sNo: FileTextIcon,
  date: FileTextIcon,
  studentName: UserIcon,
  country: GlobeIcon,
  currencyBooked: DollarSignIcon,
  quotation: DollarSignIcon,
  studentPaid: DollarSignIcon,
  docsStatus: CheckSquareIcon,
  ttCopyStatus: CheckSquareIcon,
  agentCommission: PercentIcon,
  tds: PercentIcon,
  netPayable: DollarSignIcon,
  commissionStatus: CheckSquareIcon,
  passportFile: FileIcon,
  offerLetterFile: FileIcon,
};

function ForexView() {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
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
    setLoading(true);
    axios
      .get(`https://abroad-backend-gray.vercel.app/auth/viewAllForexForms`)
      .then((response) => {
        if (response.data.success) {
          const formData1 = response.data.forexForms.find(
            (form) => form._id === id,
          );
          if (formData1) {
            setFormData(formData1);
          } else {
            console.error('Form data not found for ID:', id);
          }
        } else {
          console.error('Request was not successful:', response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [id]);

  // Function to format field labels for display
  const formatFieldLabel = (label) => {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

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
              borderTopRightRadius: '12px'
            }}
          >
            <Typography variant="h5" fontWeight="600" color="white">
              Forex Transaction Details
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={6}>
                <CircularProgress />
              </Box>
            ) : Object.keys(formData).length > 0 ? (
              <Grid container spacing={3}>
                {/* Agent Reference */}
                {formData.agentRef && (
                  <Grid item xs={12} md={6}>
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
                            <UserIcon size={18} />
                          </Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Agent Name
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight="medium">
                          {formData.agentRef.name.toUpperCase()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Student Reference */}
                {formData.studentName && (
                  <Grid item xs={12} md={6}>
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
                            <UserIcon size={18} />
                          </Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Student Name
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight="medium">
                          {formData.studentName}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Other form fields */}
                {Object.entries(formData).map(
                  ([label, value], index) =>
                    label !== '__v' &&
                    label !== '_id' &&
                    label !== 'documents' &&
                    label !== 'agentRef' &&
                    label !== 'aecommission' &&
                    label !== 'studentName' && (
                      <Grid item xs={12} md={6} key={index}>
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
                            
                            {label.endsWith('File') ? (
                              <Button
                                variant="text"
                                component="a"
                                href={value.documentFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<ExternalLinkIcon size={16} />}
                                sx={{ mt: 1 }}
                              >
                                View File
                              </Button>
                            ) : (
                              <Typography variant="h6" fontWeight="medium">
                                {label === 'date'
                                  ? new Date(value).toLocaleDateString('en-GB')
                                  : value}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                )}

                {/* Document Section */}
                {formData.documents && formData.documents.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="600" sx={{ mt: 2, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FolderIcon size={20} style={{ marginRight: 12 }} color={theme.palette.primary.main} />
                        Documents
                      </Box>
                    </Typography>
                    <Grid container spacing={2}>
                      {formData.documents.map((doc, index) => (
                        <Grid item xs={12} md={6} key={index}>
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
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                      <UserIcon size={16} style={{ marginRight: 8 }} />
                                      Document Of: <Box component="span" sx={{ ml: 1, fontWeight: 'bold' }}>{doc.documentOf}</Box>
                                    </Box>
                                  </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                      <FileTextIcon size={16} style={{ marginRight: 8 }} />
                                      Type: <Box component="span" sx={{ ml: 1, fontWeight: 'bold' }}>{doc.documentType}</Box>
                                    </Box>
                                  </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                  <Divider sx={{ my: 1 }} />
                                  <Button
                                    variant="text"
                                    component="a"
                                    href={doc.documentFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    startIcon={<ExternalLinkIcon size={16} />}
                                    fullWidth
                                    sx={{ mt: 1 }}
                                  >
                                    View Document
                                  </Button>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Box textAlign="center" p={4}>
                <Typography variant="h6" color="text.secondary">
                  No data found for this Forex transaction
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default ForexView;