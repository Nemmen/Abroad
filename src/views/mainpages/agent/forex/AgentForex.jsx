import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
  TextField,
  Tabs,
  Tab,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Alert,
  Paper,
  InputAdornment,
} from '@mui/material';
import AgentForexCalculator from './AgentForexCalculator';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { 
  saveFiltersToStorage, 
  loadFiltersFromStorage, 
  clearFiltersFromStorage,
  FILTER_STORAGE_KEYS,
  DEFAULT_FILTERS 
} from 'utils/filterUtils';
import TuneIcon from '@mui/icons-material/Tune';
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
  { 
    field: 'commissionStatus', 
    headerName: 'Commission Status', 
    width: 180,
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

const Forex = () => {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((col) => col.field),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.Auth);
  const { colorMode } = useColorMode();
  
  // Filter states with persistent storage
  const [filters, setFilters] = useState(() => 
    loadFiltersFromStorage(FILTER_STORAGE_KEYS.AGENT_FOREX, DEFAULT_FILTERS.AGENT_FOREX)
  );
  const [tabValue, setTabValue] = useState("0");
  const [calculatorTab, setCalculatorTab] = useState(0);
  
  // Forex Calculator states
  const [calculatorForm, setCalculatorForm] = useState({
    currencyType: '',
    foreignAmount: '',
    agentMargin: ''
  });
  const [formErrors, setFormErrors] = useState({
    currencyType: '',
    foreignAmount: '',
    agentMargin: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10, // Default page size
    total: 0,
    pages: 0
  });

  // Form validation and handling
  const validateForm = () => {
    let isValid = true;
    const errors = {
      currencyType: '',
      foreignAmount: '',
      agentMargin: ''
    };

    if (!calculatorForm.currencyType) {
      errors.currencyType = 'Please select a currency';
      isValid = false;
    }

    if (!calculatorForm.foreignAmount) {
      errors.foreignAmount = 'Please enter an amount';
      isValid = false;
    } else if (isNaN(calculatorForm.foreignAmount) || parseFloat(calculatorForm.foreignAmount) <= 0) {
      errors.foreignAmount = 'Please enter a valid amount greater than 0';
      isValid = false;
    }

    if (!calculatorForm.agentMargin) {
      errors.agentMargin = 'Please enter a margin value';
      isValid = false;
    } else if (isNaN(calculatorForm.agentMargin) || parseFloat(calculatorForm.agentMargin) < 0) {
      errors.agentMargin = 'Please enter a valid margin value (0 or greater)';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCalculatorChange = useCallback((e) => {
    const { name, value } = e.target;
    setCalculatorForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear the error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [formErrors]);
  
  // Declaration for fetchData - will be defined later but needs to be declared here
  // Handler for submitting the forex calculation request - memoized to prevent unnecessary re-renders
  const handleCalculatorSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the data for the API
      const requestData = {
        currencyType: calculatorForm.currencyType,
        foreignAmount: parseFloat(calculatorForm.foreignAmount),
        agentMargin: parseFloat(calculatorForm.agentMargin)
      };
      
      // Make the API call
      const response = await axios.post(
        'https://abroad-backend-gray.vercel.app/api/forex/request', 
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (response.data && response.data.success) {
        // Reset the form after successful submission
        setCalculatorForm({
          currencyType: '',
          foreignAmount: '',
          agentMargin: ''
        });
        
        // Show success modal
        setIsSuccessModalOpen(true);
        
        // Refresh the data to include the new request
        // Using setTimeout to ensure this happens after the current execution context
        setTimeout(() => {
          // This will call the fetchData function that will be defined later
          // without creating a dependency on it
          if (typeof window.updateForexData === 'function') {
            window.updateForexData();
          }
        }, 0);
      } else {
        console.error('Error submitting forex request:', response.data);
        alert('Failed to submit forex request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting forex request:', error);
      alert(`Failed to submit forex request: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [calculatorForm, validateForm]);

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

  // Fetch data with pagination
  const fetchData = async (page = pagination.page, limit = pagination.limit) => {
    // Assign to window object for reference without dependencies
    window.updateForexData = () => fetchData(pagination.page, pagination.limit);
    if (!user || !user._id) {
      console.log('Agent Forex - User not authenticated');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Use the new agent-specific endpoint
      const params = new URLSearchParams({
        page: page.toString(),
        limit:'1000',
        sortField: 'date',
        sortOrder: 'desc'
      });

      const response = await axios.get(
        `http://localhost:4000/agent/forex?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
          },
          withCredentials: true
        }
      );
      
      // Log the raw response structure to help diagnose issues
      console.log('Agent Forex - Raw API response structure:', {
        success: response.data?.success,
        dataType: typeof response.data,
        hasForexForms: !!response.data?.forexForms,
        dataType: Array.isArray(response.data?.forexForms) ? 'array' : typeof response.data?.forexForms,
        dataLength: response.data?.forexForms?.length || 0,
        hasPagination: !!response.data?.pagination,
        sample: response.data?.forexForms?.[0] ? { 
          _id: response.data.forexForms[0]._id,
          agentRef: response.data.forexForms[0].agentRef
        } : null
      });
      
      if (response.data && response.data.forexForms && Array.isArray(response.data.forexForms)) {
        // Process all forex forms using the new API response format
        const forexForms = response.data.forexForms.map((item) => ({
          id: item._id,
          agentRef: item.agentRef?.name?.toUpperCase() || 'N/A',
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
        
        console.log('Agent Forex - Processed forms:', {
          totalForexForms: response.data.forexForms.length,
          processedForms: forexForms.length,
          userId: user._id
        });
        
        setRows(forexForms);
        setData(response.data.forexForms);
        
        // Update pagination state directly from backend
        setPagination({
          page: page,
          limit: limit,
          total: response.data.pagination?.total || response.data.forexForms.length,
          pages: response.data.pagination?.pages || Math.ceil(response.data.forexForms.length / limit)
        });
      } else {
        console.log('Agent Forex - No data received or no matching records found in backend response:', response.data);
        setRows([]);
        setData([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          pages: 0
        }));
      }
    } catch (error) {
      console.error('Error fetching forex forms:', error);
      // Show a more helpful error message
      setRows([]);
      setData([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        pages: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      console.log('Agent Forex - Fetching data for user:', user._id);
      fetchData();
    } else {
      console.log('Agent Forex - User not available:', user);
    }
    
    // Cleanup function to remove window reference when component unmounts
    return () => {
      window.updateForexData = undefined;
    };
  }, [user, user?._id]);
  
  // Additional useEffect to refetch data after component mounts with multiple attempts
  useEffect(() => {
    if (!user || !user._id) return;
    
    // First attempt after 1 second
    const timer1 = setTimeout(() => {
      if (user && user._id) {
        console.log('Agent Forex - First refetch attempt after 1 second');
        fetchData();
      }
    }, 1000);
    
    // Second attempt after 3 seconds
    const timer2 = setTimeout(() => {
      if (user && user._id) {
        console.log('Agent Forex - Second refetch attempt after 3 seconds');
        fetchData();
      }
    }, 3000);
    
    // Final attempt after 5 seconds
    const timer3 = setTimeout(() => {
      if (user && user._id) {
        console.log('Agent Forex - Final refetch attempt after 5 seconds');
        fetchData();
      }
    }, 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [user, user?._id]);

  // Filter and sort data effect
  useEffect(() => {
    let processedData = [...rows];

    // Apply name filters
    if (filters.agentName) {
      processedData = processedData.filter(item => 
        item.agentRef.toLowerCase().includes(filters.agentName.toLowerCase())
      );
    }
    
    if (filters.studentName) {
      processedData = processedData.filter(item => 
        item.studentRef.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }

    // Apply multi-select filters
    if (filters.countries && filters.countries.length > 0) {
      processedData = processedData.filter(item => 
        filters.countries.includes(item.country)
      );
    }

    if (filters.currencies && filters.currencies.length > 0) {
      processedData = processedData.filter(item => 
        filters.currencies.includes(item.currencyBooked)
      );
    }

    if (filters.docsStatuses && filters.docsStatuses.length > 0) {
      processedData = processedData.filter(item => 
        filters.docsStatuses.includes(item.docsStatus)
      );
    }

    if (filters.ttCopyStatuses && filters.ttCopyStatuses.length > 0) {
      processedData = processedData.filter(item => 
        filters.ttCopyStatuses.includes(item.ttCopyStatus)
      );
    }

    if (filters.commissionStatuses && filters.commissionStatuses.length > 0) {
      processedData = processedData.filter(item => 
        filters.commissionStatuses.includes(item.commissionStatus)
      );
    }

    // Apply date filters
    if (filters.specificDate) {
      processedData = processedData.filter(item => {
        const itemDate = new Date(item.date);
        const filterDate = new Date(filters.specificDate);
        return itemDate.toDateString() === filterDate.toDateString();
      });
    }

    if (filters.dateFrom && filters.dateTo) {
      processedData = processedData.filter(item => {
        const itemDate = new Date(item.date);
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    // Apply date sorting
    if (filters.dateSort) {
      processedData.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        
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

  // Extract unique values for filters
  const getUniqueValues = (data, field) => {
    return [...new Set(data.map(item => item[field]).filter(Boolean))].sort();
  };

  const uniqueCountries = getUniqueValues(rows, 'country');
  const uniqueCurrencies = getUniqueValues(rows, 'currencyBooked');
  const uniqueDocsStatuses = getUniqueValues(rows, 'docsStatus');
  const uniqueTtCopyStatuses = getUniqueValues(rows, 'ttCopyStatus');
  const uniqueCommissionStatuses = getUniqueValues(rows, 'commissionStatus');

  // Filter handlers with persistent storage
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    saveFiltersToStorage(FILTER_STORAGE_KEYS.AGENT_FOREX, newFilters);
  };

  const handleMultiSelectFilter = (filterType, value, checked) => {
    const currentValues = filters[filterType] || [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(item => item !== value);
    }
    
    const newFilters = {
      ...filters,
      [filterType]: newValues
    };
    setFilters(newFilters);
    saveFiltersToStorage(FILTER_STORAGE_KEYS.AGENT_FOREX, newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = DEFAULT_FILTERS.AGENT_FOREX;
    setFilters(clearedFilters);
    saveFiltersToStorage(FILTER_STORAGE_KEYS.AGENT_FOREX, clearedFilters);
  };

  const clearSpecificFilter = (filterType) => {
    const newFilters = {
      ...filters,
      [filterType]: Array.isArray(filters[filterType]) ? [] : ''
    };
    setFilters(newFilters);
    saveFiltersToStorage(FILTER_STORAGE_KEYS.AGENT_FOREX, newFilters);
  };

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

  // Pagination handlers
  const handlePageChange = (newPage) => {
    fetchData(newPage, pagination.limit);
  };

  const handlePageSizeChange = (newPageSize) => {
    fetchData(1, newPageSize);
  };

  // Memoize the currency options to prevent unnecessary re-renders
  const currencyOptions = useMemo(() => [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
    { value: 'AED', label: 'UAE Dirham (AED)' },
    { value: 'MYR', label: 'Malaysian Ringgit (MYR)' },
  ], []);

  const memoizedColumns = useMemo(
    () => allColumns.filter((col) => selectedColumns.includes(col.field)),
    [selectedColumns],
  );
  const memoizedRows = useMemo(() => {
    console.log('Agent Forex - Memoized rows calculation:', {
      filteredDataLength: filteredData.length,
      rowsLength: rows.length,
      usingFiltered: filteredData.length > 0 || (filters && Object.values(filters).some(val => val !== '' && val?.length > 0)),
      result: (filteredData.length > 0 || (filters && Object.values(filters).some(val => val !== '' && val?.length > 0))) ? filteredData : rows
    });
    
    // If filters are applied (any non-empty values), use filteredData even if it's empty
    // Otherwise use rows data
    const hasActiveFilters = filters && Object.values(filters).some(val => val !== '' && val?.length > 0);
    return (hasActiveFilters) ? filteredData : rows;
  }, [filteredData, rows, filters]);

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
        {/* Forex Calculator - single compact calculator card (submit handled elsewhere) */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
          }}
        >
          <Typography variant="h5" fontWeight="600" color="#2E7D32" gutterBottom>
            Forex Calculator
          </Typography>
          <Typography variant="body2" color="#1B5E20" sx={{ mb: 2 }}>
            Quick conversion preview — use this to get an agent quote. To submit a request, use the "Submit Request" section below.
          </Typography>

          {/* Render the compact calculator component (keeps calculation and quote flow) */}
          <AgentForexCalculator />
        </Paper>
        
        {/* Success Modal */}
        <Modal
          open={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          aria-labelledby="success-modal-title"
          aria-describedby="success-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}>
            <Typography id="success-modal-title" variant="h6" component="h2" gutterBottom>
              Request Submitted Successfully!
            </Typography>
            <Typography id="success-modal-description" sx={{ mt: 2, mb: 3 }}>
              Thank you for your forex conversion request. Our admin team has been notified and will contact you soon with the best rates.
            </Typography>
            <Button 
              onClick={() => setIsSuccessModalOpen(false)} 
              variant="contained"
              fullWidth
              sx={{ 
                backgroundColor: '#2E7D32',
                '&:hover': {
                  backgroundColor: '#1B5E20'
                }
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
        
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your forex transactions will appear here when they are created
                </Typography>
                <Alert severity="info" sx={{ mt: 2, maxWidth: "500px" }}>
                  If you believe you should have records showing here, please refresh the page or try logging out and logging in again.
                </Alert>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={() => {
                    // Force a data refresh with a loading indicator
                    setLoading(true);
                    setTimeout(() => fetchData(), 500);
                  }}
                >
                  Refresh Data
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
                  loading={loading}
                  pagination={{
                    page: pagination.page,
                    pageSize: pagination.limit,
                    total: pagination.total,
                    pageSizeOptions: [10, 15, 25],
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                  }}
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
              Deselect All
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
                {/* <Tab label="Countries" value="3" />
                <Tab label="Currencies & Status" value="4" /> */}
              </Tabs>
            </Box>

            {/* Date Sorting Tab */}
            {tabValue === "0" && (
              <Box sx={{ p: 2 }}>
                <Stack spacing={3}>
                  <Typography variant="body2" color="text.secondary">
                    Sort records by Transaction Date
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
                      onClick={() => clearSpecificFilter('dateSort')}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Filter by Specific Date
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => clearSpecificFilter('specificDate')}
                        sx={{ textTransform: 'none', fontSize: '0.7rem' }}
                      >
                        Clear
                      </Button>
                    </Box>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Filter by Date Range
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => {
                          clearSpecificFilter('dateFrom');
                          clearSpecificFilter('dateTo');
                        }}
                        sx={{ textTransform: 'none', fontSize: '0.7rem' }}
                      >
                        Clear Range
                      </Button>
                    </Box>
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
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Filter by Agent Name
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => clearSpecificFilter('agentName')}
                        sx={{ textTransform: 'none', fontSize: '0.7rem' }}
                      >
                        Clear
                      </Button>
                    </Box>
                    <TextField
                      label="Filter by Agent Name"
                      fullWidth
                      size="small"
                      placeholder="Enter agent name to search..."
                      value={filters.agentName}
                      onChange={(e) => handleFilterChange('agentName', e.target.value)}
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Filter by Student Name
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => clearSpecificFilter('studentName')}
                        sx={{ textTransform: 'none', fontSize: '0.7rem' }}
                      >
                        Clear
                      </Button>
                    </Box>
                    <TextField
                      label="Filter by Student Name"
                      fullWidth
                      size="small"
                      placeholder="Enter student name to search..."
                      value={filters.studentName}
                      onChange={(e) => handleFilterChange('studentName', e.target.value)}
                    />
                  </Box>
                </Stack>
              </Box>
            )}

            {/* Countries Tab */}
            {/* {tabValue === "3" && (
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Select Countries ({filters.countries?.length || 0} selected)
                  </Typography>
                </Box>
                <FormGroup>
                  <Grid container spacing={1}>
                    {uniqueCountries.map((country) => (
                      <Grid item xs={6} key={country}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={filters.countries?.includes(country) || false}
                              onChange={(e) => handleMultiSelectFilter('countries', country, e.target.checked)}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                              {country}
                            </Typography>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>
            )} */}

            
            {/* {tabValue === "4" && (
              <Box sx={{ p: 2 }}>
                <Stack spacing={3}>
               
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Currencies ({filters.currencies?.length || 0} selected)
                      </Typography>
                    </Box>
                    <FormGroup>
                      <Grid container spacing={1}>
                        {uniqueCurrencies.map((currency) => (
                          <Grid item xs={6} key={currency}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={filters.currencies?.includes(currency) || false}
                                  onChange={(e) => handleMultiSelectFilter('currencies', currency, e.target.checked)}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {currency}
                                </Typography>
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </Box>

                  <Divider />

                
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Document Status ({filters.docsStatuses?.length || 0} selected)
                      </Typography>
                    </Box>
                    <FormGroup>
                      <Grid container spacing={1}>
                        {uniqueDocsStatuses.map((status) => (
                          <Grid item xs={6} key={status}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={filters.docsStatuses?.includes(status) || false}
                                  onChange={(e) => handleMultiSelectFilter('docsStatuses', status, e.target.checked)}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {status}
                                </Typography>
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </Box>

                  <Divider />

             
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        TT Copy Status ({filters.ttCopyStatuses?.length || 0} selected)
                      </Typography>
                    </Box>
                    <FormGroup>
                      <Grid container spacing={1}>
                        {uniqueTtCopyStatuses.map((status) => (
                          <Grid item xs={6} key={status}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={filters.ttCopyStatuses?.includes(status) || false}
                                  onChange={(e) => handleMultiSelectFilter('ttCopyStatuses', status, e.target.checked)}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {status}
                                </Typography>
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </Box>

                  <Divider />

               
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Commission Status ({filters.commissionStatuses?.length || 0} selected)
                      </Typography>
                    </Box>
                    <FormGroup>
                      <Grid container spacing={1}>
                        {uniqueCommissionStatuses.map((status) => (
                          <Grid item xs={6} key={status}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={filters.commissionStatuses?.includes(status) || false}
                                  onChange={(e) => handleMultiSelectFilter('commissionStatuses', status, e.target.checked)}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {status}
                                </Typography>
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </Box>
                </Stack>
              </Box>
            )} */}
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

export default Forex;