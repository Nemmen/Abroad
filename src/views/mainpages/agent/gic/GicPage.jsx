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
  TextField,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import { 
  saveFiltersToStorage, 
  loadFiltersFromStorage, 
  clearFiltersFromStorage,
  FILTER_STORAGE_KEYS,
  DEFAULT_FILTERS 
} from 'utils/filterUtils';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TuneIcon from '@mui/icons-material/Tune';
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
  { field: 'agentCommission', headerName: 'Agent Commission', width: 150 },
  { field: 'tds', headerName: 'TDS', width: 100 },
  { field: 'netPayable', headerName: 'Net Payable', width: 140 },
  { 
    field: 'commissionStatus', 
    headerName: 'Commission Status', 
    width: 160,
    renderCell: (params) => {
      let displayText = params.value;
      
      // Replace "not received" with "non claimable" and "received" with "paid"
      if (displayText?.toLowerCase().includes('not received')) {
        displayText = displayText.replace(/not received/gi, 'non claimable');
      } else if (displayText?.toLowerCase().includes('received')) {
        displayText = displayText.replace(/received/gi, 'paid');
      }
      
      return (
        <span style={{ fontWeight: '600' }}>
          {displayText}
        </span>
      );
    }
  },
];

const Gic = () => {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((col) => col.field),
  );
  const { user } = useSelector((state) => state.Auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();
  
  // Filter states with persistent storage
  const [filters, setFilters] = useState(() => 
    loadFiltersFromStorage(FILTER_STORAGE_KEYS.AGENT_GIC, DEFAULT_FILTERS.AGENT_GIC)
  );
  const [tabValue, setTabValue] = useState("0");

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
            agentCommission: form.commissionAmt || 0,
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

  // Filter and sort data effect
  useEffect(() => {
    let processedData = [...rows];

    // Apply name filters
    if (filters.agentName) {
      processedData = processedData.filter(item => 
        item.Agent.toLowerCase().includes(filters.agentName.toLowerCase())
      );
    }
    
    if (filters.studentName) {
      processedData = processedData.filter(item => 
        item.studentName.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }

    // Apply date filters
    if (filters.specificDate) {
      processedData = processedData.filter(item => {
        const itemDate = new Date(item.accOpeningMonth);
        const filterDate = new Date(filters.specificDate);
        return itemDate.toDateString() === filterDate.toDateString();
      });
    }

    if (filters.dateFrom && filters.dateTo) {
      processedData = processedData.filter(item => {
        const itemDate = new Date(item.accOpeningMonth);
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    // Apply multi-select filters
    if (filters.commissionStatus && filters.commissionStatus.length > 0) {
      processedData = processedData.filter(item => 
        filters.commissionStatus.includes(item.commissionStatus)
      );
    }

    if (filters.accountType && filters.accountType.length > 0) {
      processedData = processedData.filter(item => 
        filters.accountType.includes(item.type)
      );
    }

    if (filters.bankName && filters.bankName.length > 0) {
      processedData = processedData.filter(item => 
        filters.bankName.includes(item.bankVendor)
      );
    }

    // Apply date sorting
    if (filters.dateSort) {
      processedData.sort((a, b) => {
        const dateA = new Date(a.accOpeningMonth || 0);
        const dateB = new Date(b.accOpeningMonth || 0);
        
        if (filters.dateSort === 'asc') {
          return dateA - dateB;
        } else if (filters.dateSort === 'desc') {
          return dateB - dateA;
        }
        return 0;
      });
    }

    setFilteredData(processedData);
  }, [rows, filters]);

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    saveFiltersToStorage(FILTER_STORAGE_KEYS.AGENT_GIC, newFilters);
  };

  const clearAllFilters = () => {
    const defaultFilters = DEFAULT_FILTERS.AGENT_GIC;
    setFilters(defaultFilters);
    saveFiltersToStorage(FILTER_STORAGE_KEYS.AGENT_GIC, defaultFilters);
  };

  // Multi-select filter handlers
  const handleMultiSelectChange = (filterType, value, checked) => {
    const newValues = checked 
      ? [...(filters[filterType] || []), value]
      : (filters[filterType] || []).filter(item => item !== value);
    
    handleFilterChange(filterType, newValues);
  };

  const clearMultiSelectFilter = (filterType) => {
    handleFilterChange(filterType, []);
  };

  // Get unique values for multi-select filters
  const getUniqueValues = (field) => {
    const values = rows.map(row => row[field]).filter(Boolean);
    return [...new Set(values)].sort();
  };

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
        agentCommission: item.commissionAmt || 0,
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
  
  const memoizedRows = useMemo(() => filteredData.length > 0 ? filteredData : rows, [filteredData, rows]);

  const getRowClassName = (params) => {
    const status = params.row.commissionStatus?.toLowerCase();
    if (status?.includes('non claimable') || status?.includes('not received')) {
      return 'row-non-claimable';
    } else if (status?.includes('under processing')) {
      return 'row-under-processing';
    } else if (status?.includes('paid') || status?.includes('received')) {
      return 'row-paid';
    }
    return '';
  };

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
              
              <Tooltip title="Filter and sort data">
                <Button
                  onClick={() => setIsFilterModalOpen(true)}
                  variant="outlined"
                  startIcon={<TuneIcon />}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { 
                      borderColor: 'white', 
                      backgroundColor: 'rgba(255,255,255,0.1)' 
                    } 
                  }}
                >
                  Filter & Sort Data
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
                  getRowClassName={getRowClassName}
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

      {/* Data Filter and Sort Modal */}
      <Modal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        aria-labelledby="filter-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '600px' },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: 'none',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2" fontWeight={600}>
              Filter & Sort Data
            </Typography>
            <IconButton onClick={() => setIsFilterModalOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, newValue) => setTabValue(newValue)}
                variant="fullWidth"
              >
                <Tab label="Sort by Date" value="0" />
                <Tab label="Filter by Date" value="1" />
                <Tab label="Filter by Name" value="2" />
              </Tabs>
            </Box>

            {/* Date Sorting Tab */}
            {tabValue === "0" && (
              <Box sx={{ p: 2 }}>
                <Stack spacing={3}>
                  <Typography variant="body2" color="text.secondary">
                    Sort records by Account Opening Date
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                      size="small"
                      variant={filters.dateSort === 'asc' ? 'contained' : 'outlined'}
                      startIcon={<KeyboardArrowUp />}
                      onClick={() => handleFilterChange('dateSort', 'asc')}
                    >
                      Ascending (Old → New)
                    </Button>
                    <Button
                      size="small"
                      variant={filters.dateSort === 'desc' ? 'contained' : 'outlined'}
                      startIcon={<KeyboardArrowDown />}
                      onClick={() => handleFilterChange('dateSort', 'desc')}
                    >
                      Descending (New → Old)
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => handleFilterChange('dateSort', '')}
                    >
                      Clear Sort
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            )}

            {/* Date Filtering Tab */}
            {tabValue === "1" && (
              <Box sx={{ p: 2 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Filter by Specific Date
                    </Typography>
                    <TextField
                      type="date"
                      fullWidth
                      size="small"
                      value={filters.specificDate}
                      onChange={(e) => handleFilterChange('specificDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Filter by Date Range
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="From Date"
                          type="date"
                          fullWidth
                          size="small"
                          value={filters.dateFrom}
                          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="To Date"
                          type="date"
                          fullWidth
                          size="small"
                          value={filters.dateTo}
                          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Name Filtering Tab */}
            {tabValue === "2" && (
              <Box sx={{ p: 2 }}>
                <Stack spacing={3}>
                  <TextField
                    label="Filter by Agent Name"
                    fullWidth
                    size="small"
                    placeholder="Enter agent name to search..."
                    value={filters.agentName}
                    onChange={(e) => handleFilterChange('agentName', e.target.value)}
                  />
                  
                  <TextField
                    label="Filter by Student Name"
                    fullWidth
                    size="small"
                    placeholder="Enter student name to search..."
                    value={filters.studentName}
                    onChange={(e) => handleFilterChange('studentName', e.target.value)}
                  />
                </Stack>
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button 
              onClick={clearAllFilters}
              color="error"
              sx={{ textTransform: 'none' }}
            >
              Clear All Filters
            </Button>
            <Button 
              variant="contained" 
              onClick={() => setIsFilterModalOpen(false)}
              sx={{ 
                minWidth: '100px',
                background: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0D0362 0%, #3B169A 100%)',
                },
                textTransform: 'none'
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default Gic;