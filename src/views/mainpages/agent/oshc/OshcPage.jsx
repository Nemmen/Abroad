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
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { get } from 'views/mainpages/services/ApiEndpoint';
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
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Partner logos (using placeholder URLs - replace with actual logos)
const partnerLogos = [
  { name: 'AHM', logo: '/assets/partners/ahm-logo.png', alt: 'AHM Logo' },
  { name: 'NIB', logo: '/assets/partners/nib-logo.png', alt: 'NIB Logo' },
  { name: 'Allianz', logo: '/assets/partners/allianz-logo.png', alt: 'Allianz Logo' },
  { name: 'Medibank', logo: '/assets/partners/medibank-logo.png', alt: 'Medibank Logo' },
  { name: 'Bupa', logo: '/assets/partners/bupa-logo.png', alt: 'Bupa Logo' },
];

// Define the columns
const allColumns = [
  { field: 'Agent', headerName: 'Agent Name', width: 140 },
  { field: 'studentName', headerName: 'Student Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'mobile', headerName: 'Mobile Number', width: 140 },
  { field: 'partner', headerName: 'Partner', width: 120 },
  { field: 'policyStartDate', headerName: 'Policy Start', width: 130 },
  { field: 'policyEndDate', headerName: 'Policy End', width: 130 },
  { field: 'passportNumber', headerName: 'Passport No.', width: 130 },
  { field: 'studentId', headerName: 'Student ID', width: 120 },
  { field: 'status', headerName: 'Status', width: 120 },
];

const statusOptions = ['Pending', 'Approved', 'Rejected', 'Processing'];
const partnerOptions = ['AHM', 'NIB', 'Allianz', 'Medibank', 'Bupa'];

function OshcPage() {
  const { user } = useSelector((state) => state.Auth);
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState(DEFAULT_FILTERS.OSHC || {
    studentName: '',
    email: '',
    mobile: '',
    partner: '',
    status: '',
    passportNumber: '',
    studentId: '',
    dateRange: { start: '', end: '' },
    showFilters: false
  });

  const [columnVisibility, setColumnVisibility] = useState(() => {
    const savedVisibility = localStorage.getItem('oshcColumnVisibility');
    return savedVisibility ? JSON.parse(savedVisibility) : {
      Agent: true,
      studentName: true,
      email: true,
      mobile: true,
      partner: true,
      policyStartDate: true,
      policyEndDate: true,
      passportNumber: false,
      studentId: false,
      status: true,
    };
  });

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
    },
  });

  // Fetch OSHC data
  const fetchOshcData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://abroad-backend-gray.vercel.app/api/oshc', {
        method: 'GET',
        credentials: 'include', // For cookie-based auth
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}. Please check your authentication or try again later.`);
      }

      const result = await response.json();

      if (response.ok && result.success) {
        const oshcData = result.data || [];
        
        // Normalize the data structure - API returns populated studentRef and agentRef
        const normalized = oshcData.map((item) => ({
          id: item._id || item.id,
          Agent: item.agentRef?.name || user?.name || 'N/A',
          studentName: item.studentRef?.name || 'N/A',
          email: item.studentRef?.email || 'N/A',
          mobile: item.studentRef?.phoneNumber || item.studentRef?.mobile || 'N/A',
          partner: item.partner || 'N/A',
          policyStartDate: item.policyStartDate ? new Date(item.policyStartDate).toLocaleDateString() : 'N/A',
          policyEndDate: item.policyEndDate ? new Date(item.policyEndDate).toLocaleDateString() : 'N/A',
          passportNumber: item.passportNumber || 'N/A',
          studentId: item.studentId || 'N/A',
          status: item.status || 'N/A',
          premium: item.premium || 0,
          commission: item.commission || 0,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        setData(normalized);
        setFilteredData(normalized);
      } else {
        throw new Error(result.message || 'Failed to fetch OSHC data');
      }
      
    } catch (error) {
      console.error('Error fetching OSHC data:', error);
      setError(error.message || 'Failed to fetch OSHC data. Please try again.');
      // Ensure data is always an array
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOshcData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...data];

    if (filters.studentName) {
      filtered = filtered.filter(item => 
        item.studentName.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }

    if (filters.email) {
      filtered = filtered.filter(item => 
        item.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.mobile) {
      filtered = filtered.filter(item => 
        item.mobile.includes(filters.mobile)
      );
    }

    if (filters.partner) {
      filtered = filtered.filter(item => 
        item.partner === filters.partner
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => 
        item.status === filters.status
      );
    }

    if (filters.passportNumber) {
      filtered = filtered.filter(item => 
        item.passportNumber.toLowerCase().includes(filters.passportNumber.toLowerCase())
      );
    }

    if (filters.studentId) {
      filtered = filtered.filter(item => 
        item.studentId.toLowerCase().includes(filters.studentId.toLowerCase())
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(item => {
        const createdDate = new Date(item.createdAt);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return createdDate >= startDate && createdDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [filters, data]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    saveFiltersToStorage(FILTER_STORAGE_KEYS.OSHC, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { ...DEFAULT_FILTERS.OSHC, showFilters: filters.showFilters };
    setFilters(clearedFilters);
    clearFiltersFromStorage(FILTER_STORAGE_KEYS.OSHC);
  };

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = filteredData.map(item => ({
      'Agent Name': item.Agent,
      'Student Name': item.studentName,
      'Email': item.email,
      'Mobile Number': item.mobile,
      'Partner': item.partner,
      'Policy Start Date': item.policyStartDate,
      'Policy End Date': item.policyEndDate,
      'Passport Number': item.passportNumber,
      'Student ID': item.studentId,
      'Status': item.status,
      'Created Date': item.createdAt,
      'Last Updated': item.updatedAt,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OSHC Data');
    XLSX.writeFile(wb, `oshc_data_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Handle column visibility
  const handleColumnVisibilityChange = (field) => {
    const newVisibility = { ...columnVisibility, [field]: !columnVisibility[field] };
    setColumnVisibility(newVisibility);
    localStorage.setItem('oshcColumnVisibility', JSON.stringify(newVisibility));
  };

  const visibleColumns = useMemo(() => 
    allColumns.filter(col => columnVisibility[col.field]),
    [columnVisibility]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
        {/* Header */}
        <Card sx={{ p: 3, mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            <LocalHospitalIcon sx={{ mr: 2, fontSize: 'inherit' }} />
            OSHC Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
            Manage health insurance policies for Australian study visas
          </Typography>

          <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
              Our Partners:
            </Typography>
            <Grid container spacing={2} alignItems="center">
              {partnerLogos.map((partner, index) => (
                <Grid item key={index}>
                  <Box
                    sx={{
                      p: 1.5,
                      border: 1,
                      borderColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      minWidth: 80,
                      minHeight: 40,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {partner.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>

        {/* Action Bar */}
        <Card sx={{ p: 2, mb: 3, backgroundColor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/agent/oshc/add"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                Add New OSHC
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<FilterAltIcon />}
                onClick={() => handleFilterChange('showFilters', !filters.showFilters)}
                sx={{ color: 'text.primary', borderColor: 'divider' }}
              >
                {filters.showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={() => setFilters(prev => ({ ...prev, showColumnSettings: !prev.showColumnSettings }))}
                sx={{ color: 'text.primary', borderColor: 'divider' }}
              >
                Columns
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total: {filteredData.length} entries
              </Typography>
              
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={exportToExcel}
                sx={{
                  backgroundColor: '#10B981',
                  '&:hover': { backgroundColor: '#059669' },
                }}
              >
                Export Excel
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Filters Panel */}
        {filters.showFilters && (
          <Card sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Filters
              </Typography>
              <Button onClick={clearFilters} size="small" variant="text">
                Clear All
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Student Name"
                  value={filters.studentName}
                  onChange={(e) => handleFilterChange('studentName', e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Mobile Number"
                  value={filters.mobile}
                  onChange={(e) => handleFilterChange('mobile', e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Partner</InputLabel>
                  <Select
                    value={filters.partner}
                    onChange={(e) => handleFilterChange('partner', e.target.value)}
                    label="Partner"
                  >
                    <MenuItem value="">All Partners</MenuItem>
                    {partnerOptions.map(partner => (
                      <MenuItem key={partner} value={partner}>{partner}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All Status</MenuItem>
                    {statusOptions.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Passport Number"
                  value={filters.passportNumber}
                  onChange={(e) => handleFilterChange('passportNumber', e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Student ID"
                  value={filters.studentId}
                  onChange={(e) => handleFilterChange('studentId', e.target.value)}
                  size="small"
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="date"
                  label="Start Date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="date"
                  label="End Date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Column Settings Modal */}
        <Modal
          open={filters.showColumnSettings}
          onClose={() => setFilters(prev => ({ ...prev, showColumnSettings: false }))}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
              Column Visibility
            </Typography>
            <FormGroup>
              {allColumns.map(column => (
                <FormControlLabel
                  key={column.field}
                  control={
                    <Checkbox
                      checked={columnVisibility[column.field]}
                      onChange={() => handleColumnVisibilityChange(column.field)}
                    />
                  }
                  label={column.headerName}
                />
              ))}
            </FormGroup>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setFilters(prev => ({ ...prev, showColumnSettings: false }))}
                variant="contained"
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Data Table */}
        <Card sx={{ backgroundColor: 'background.paper' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="error" variant="h6" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <Button variant="contained" onClick={fetchOshcData}>
                Retry
              </Button>
            </Box>
          ) : (
            <DataTable
              rows={Array.isArray(filteredData) ? filteredData : []}
              columns={visibleColumns}
              pageSize={25}
              loading={loading}
              onRowClick={(params) => {
                navigate(`/agent/oshc/view/${params.row.id}`);
              }}
            />
          )}
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default OshcPage;