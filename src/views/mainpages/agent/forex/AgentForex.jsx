import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Divider,
  Modal,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';

const allColumns = [
  { field: 'agentRef', headerName: 'Agent', width: 120 },
  { field: 'date', headerName: 'Date', width: 150 },
  { field: 'studentRef', headerName: 'Student Name', width: 200 },
  { field: 'country', headerName: 'Country', width: 150 },
  { field: 'currencyBooked', headerName: 'Currency Booked', width: 150 },
  { field: 'quotation', headerName: 'Quotation', width: 150 },
  { field: 'studentPaid', headerName: 'Student Paid', width: 150 },
  { field: 'docsStatus', headerName: 'DOCs Status', width: 150 },
  { field: 'ttCopyStatus', headerName: 'TT Copy Status', width: 150 },
  { field: 'agentCommission', headerName: 'Agent Commission', width: 150 },
  { field: 'tds', headerName: 'TDS', width: 100 },
  { field: 'netPayable', headerName: 'Net Payable', width: 150 },
  { field: 'commissionStatus', headerName: 'Commission Status', width: 180 },
];

const Forex = () => {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((col) => col.field),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.Auth);
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://abroad-backend-gray.vercel.app/auth/viewAllForexForms',
        );
        if (response.data.forexForms) {
          const userForexForms = response.data.forexForms.filter(
            (form) => form.agentRef._id === user._id,
          );

          const forexForms = userForexForms.map((item) => ({
            id: item._id,
            agentRef: item.agentRef?.name.toUpperCase() || 'N/A',
            studentRef: item?.studentName || 'N/A',
            date: new Date(item.date).toLocaleDateString('en-US'),
            country: item.country || 'N/A',
            currencyBooked: item.currencyBooked || 'N/A',
            quotation: item.quotation || 'N/A',
            studentPaid: item.studentPaid || 'N/A',
            docsStatus: item.docsStatus || 'N/A',
            ttCopyStatus: item.ttCopyStatus || 'N/A',
            agentCommission: item.agentCommission || 0,
            tds: item.tds || 0,
            netPayable: item.netPayable || 0,
            commissionStatus: item.commissionStatus || 'N/A',
          }));
          setRows(forexForms);
          setData(userForexForms);
        }
      } catch (error) {
        console.error('Error fetching forex forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user._id]);

  const handleDownloadExcel = () => {
    const cleanData = data.map((item) => {
      return {
        agentRef: item.agentRef?.name || 'N/A',
        studentRef: item?.studentName || 'N/A',
        date: new Date(item.date).toLocaleDateString('en-US'),
        country: item.country || 'N/A',
        currencyBooked: item.currencyBooked || 'N/A',
        quotation: item.quotation || 'N/A',
        studentPaid: item.studentPaid || 'N/A',
        docsStatus: item.docsStatus || 'N/A',
        ttCopyStatus: item.ttCopyStatus || 'N/A',
        agentCommission: item.agentCommission || 0,
        tds: item.tds || 0,
        netPayable: item.netPayable || 0,
        commissionStatus: item.commissionStatus || 'N/A',
      };
    });

    const filteredData = cleanData.map((item) =>
      selectedColumns.reduce((acc, field) => {
        acc[field] = item[field] || 'N/A';
        return acc;
      }, {}),
    );

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Forex Data');
    XLSX.writeFile(workbook, 'ForexData.xlsx');
  };

  const handleColumnSelection = (field) => {
    setSelectedColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field],
    );
  };

  const memoizedColumns = useMemo(
    () => allColumns.filter((col) => selectedColumns.includes(col.field)),
    [selectedColumns],
  );
  const memoizedRows = useMemo(() => rows, [rows]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, maxWidth: '1400px', mx: 'auto' }}>
        <Card elevation={1} sx={{ overflow: 'visible' }}>
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
              FOREX Registrations
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Tooltip title="Filter table columns">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="outlined"
                  startIcon={<FilterAltIcon />}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { 
                      borderColor: 'white', 
                      backgroundColor: 'rgba(255,255,255,0.1)' 
                    } 
                  }}
                >
                  Filter Columns
                </Button>
              </Tooltip>
              
              <Tooltip title="Download as Excel">
                <Button
                  onClick={handleDownloadExcel}
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { 
                      borderColor: 'white', 
                      backgroundColor: 'rgba(255,255,255,0.1)' 
                    } 
                  }}
                >
                  Export to Excel
                </Button>
              </Tooltip>
            </Box>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
              </Box>
            ) : memoizedRows.length === 0 ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 10,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Forex records found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your forex transactions will appear here when they are created
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                height: '100%', 
                width: '100%',
                '& .MuiDataGrid-root': {
                  border: 'none',
                  minHeight: '400px',
                }
              }}>
                <DataTable 
                  columns={memoizedColumns} 
                  rows={memoizedRows} 
                />
              </Box>
            )}
          </Box>
        </Card>
      </Box>

      {/* Column Filter Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="column-filter-modal"
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
              Select Table Columns
            </Typography>
            <IconButton onClick={() => setIsModalOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select which columns you want to display in the table.
          </Typography>
          
          <FormGroup sx={{ mb: 3 }}>
            <Grid container spacing={1}>
              {allColumns.map((col) => (
                <Grid item xs={6} key={col.field}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={selectedColumns.includes(col.field)}
                        onChange={() => handleColumnSelection(col.field)}
                        color="primary"
                      />
                    }
                    label={col.headerName}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              onClick={() => setSelectedColumns(allColumns.map(col => col.field))}
              sx={{ textTransform: 'none' }}
            >
              Select All
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setIsModalOpen(false)}
              sx={{ 
                minWidth: '100px',
                background: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0D0362 0%, #3B169A 100%)',
                },
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default Forex;