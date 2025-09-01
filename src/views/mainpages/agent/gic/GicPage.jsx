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
  Chip,
  Stack,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import DataTable from 'components/DataTable';

// Define the columns
const allColumns = [
  { field: 'Agent', headerName: 'Agent Name', width: 140 },
  { field: 'type', headerName: 'Type', width: 100 },
  { field: 'accOpeningMonth', headerName: 'Acc Opening Month', width: 150 },
  { field: 'studentName', headerName: 'Student Name', width: 150 },
  { field: 'passportNo', headerName: 'Passport No.', width: 130 },
  { field: 'studentPhoneNo', headerName: 'Student Contact', width: 130 },
  { field: 'bankVendor', headerName: 'Bank Vendor', width: 150 },
  { field: 'accFundingMonth', headerName: 'Acc Funding Month', width: 160 },
  { field: 'commissionAmt', headerName: 'Commission Amt', width: 140 },
  { field: 'tds', headerName: 'TDS', width: 100 },
  { field: 'netPayable', headerName: 'Net Payable', width: 140 },
  { field: 'commissionStatus', headerName: 'Commission Status', width: 160 },
];

const Gic = () => {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((col) => col.field),
  );
  const { user } = useSelector((state) => state.Auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          'https://abroad-backend-gray.vercel.app/auth/viewAllGicForm',
        );
        if (response.data.success) {
          const userGicForms = response.data.gicForms.filter(
            (form) => form.agentRef._id === user._id,
          );
          setData(userGicForms);
          const gicForms = userGicForms.map((form, index) => ({
            id: form._id || index,
            type: form.type || 'N/A',
            Agent: form.agentRef.name.toUpperCase() || 'N/A',
            accOpeningMonth: form.accOpeningMonth || 'N/A',
            studentName: form.studentRef.name || 'N/A',
            passportNo: form.studentPassportNo || 'N/A',
            studentPhoneNo: form.studentPhoneNo || 'N/A',
            bankVendor: form.bankVendor || 'N/A',
            accFundingMonth: form.fundingMonth || 'N/A',
            commissionAmt: form.commissionAmt || 0,
            tds: form.tds || '0',
            netPayable: form.netPayable || 0,
            commissionStatus: form.commissionStatus || 'N/A',
          }));
          setRows(gicForms);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user._id]);

  const handleDownloadExcel = () => {
    // Clean and prepare data
    const cleanData = data.map((item) => {
      // Retain only relevant fields and rename keys to match column names
      const cleanedItem = {
        type: item.type || 'N/A',
        Agent: item.agentRef?.name?.toUpperCase() || 'N/A',
        accOpeningMonth: item.accOpeningMonth || 'N/A',
        studentName: item.studentRef.name || 'N/A',
        passportNo: item.studentPassportNo || 'N/A',
        studentPhoneNo: item.studentPhoneNo || 'N/A',
        bankVendor: item.bankVendor || 'N/A',
        accFundingMonth: item.fundingMonth || 'N/A',
        commissionAmt: item.commissionAmt || 0,
        tds: item.tds || '0',
        netPayable: item.netPayable || 0,
        commissionStatus: item.commissionStatus || 'N/A',
      };
      return cleanedItem;
    });

    // Filter data to include only selected columns
    const filteredData = cleanData.map((item) => {
      const filteredItem = {};
      selectedColumns.forEach(field => {
        // Get the header name for the field
        const column = allColumns.find(col => col.field === field);
        const headerName = column ? column.headerName : field;
        filteredItem[headerName] = item[field] || 'N/A';
      });
      return filteredItem;
    });

    // Generate Excel file
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gic Data');
    XLSX.writeFile(workbook, 'GicData.xlsx');
  };

  const handleColumnSelection = (field) => {
    setSelectedColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field]
    );
  };

  const memoizedColumns = useMemo(
    () => allColumns.filter((col) => selectedColumns.includes(col.field)),
    [selectedColumns]
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
              GIC Records
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
              
              <Button
                component={Link}
                to="/agent/gic/form"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ 
                  bgcolor: 'white', 
                  color: '#11047A',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.9)',
                  } 
                }}
              >
                Add New Record
              </Button>
            </Box>
          </Box>
          
          {selectedColumns.length < allColumns.length && (
            <Box sx={{ px: 3, pt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active filters:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {allColumns.map((col) => 
                  selectedColumns.includes(col.field) && (
                    <Chip 
                      key={col.field}
                      label={col.headerName} 
                      size="small"
                      onDelete={() => handleColumnSelection(col.field)}
                      sx={{ mb: 1 }}
                    />
                  )
                )}
              </Stack>
              <Divider sx={{ my: 2 }} />
            </Box>
          )}
          
          <Box sx={{ p: 3, pt: selectedColumns.length < allColumns.length ? 1 : 3 }}>
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
                  No GIC records found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start adding new GIC records by clicking the "Add New Record" button
                </Typography>
                <Button
                  component={Link}
                  to="/agent/gic/form"
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Add New Record
                </Button>
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
              onClick={() => setSelectedColumns([])}
              sx={{ textTransform: 'none' }}
              color="error"
            >
              Clear Filter
            </Button>
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

export default Gic;