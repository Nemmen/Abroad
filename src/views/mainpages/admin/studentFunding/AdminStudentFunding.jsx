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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import DataTable from 'components/DataTable';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const allColumns = [
  { field: 'Agent', headerName: 'Agent Name', width: 140 },
  { field: 'studentName', headerName: 'Student Name', width: 150 },
  { field: 'amountRequired', headerName: 'Amount Required', width: 150 },
  { field: 'countryAppliedFor', headerName: 'Country', width: 130 },
  { field: 'institutionName', headerName: 'Institution', width: 200 },
  { field: 'courseName', headerName: 'Course', width: 200 },
  { field: 'paymentTenure', headerName: 'Payment Tenure', width: 160 },
  { field: 'status', headerName: 'Status', width: 120 },
];

const statusOptions = ['Pending', 'In Progress', 'Approved', 'Rejected', 'Completed'];
const paymentTenureOptions = ['Less than 3 Months', '6 Months', 'More than 6 Months'];

function AdminStudentFunding() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    Agent: '',
    studentName: '',
    countryAppliedFor: '',
    institutionName: '',
    status: '',
    paymentTenure: '',
    amountRange: { min: '', max: '' },
    showFilters: false
  });

  const [columnVisibility, setColumnVisibility] = useState(() => {
    const savedVisibility = localStorage.getItem('adminStudentFundingColumnVisibility');
    return savedVisibility ? JSON.parse(savedVisibility) : {
      Agent: true,
      studentName: true,
      amountRequired: true,
      countryAppliedFor: true,
      institutionName: true,
      courseName: true,
      paymentTenure: true,
      status: true,
    };
  });

  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    localStorage.setItem('adminStudentFundingColumnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://abroad-backend-gray.vercel.app/api/student-funding/admin/getall?limit=1000',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
          },
          withCredentials: true
        }
      );

      if (response.data.success && response.data.data) {
        const fundingRequests = response.data.data.map((item) => ({
          id: item._id,
          Agent: item.agentRef?.name?.toUpperCase() || 'N/A',
          studentName: item.offerLetterDetails?.studentName || 'N/A',
          amountRequired: item.amountRequired ? `$${item.amountRequired.toLocaleString()}` : 'N/A',
          countryAppliedFor: item.countryAppliedFor || 'N/A',
          institutionName: item.offerLetterDetails?.institutionName || 'N/A',
          courseName: item.offerLetterDetails?.courseName || 'N/A',
          paymentTenure: item.paymentRequirementTenure || 'N/A',
          status: item.status || 'Pending',
        }));

        setRows(fundingRequests);
        setData(response.data.data);
        
        if (response.data.analytics) {
          setAnalytics(response.data.analytics);
        }
      } else {
        setRows([]);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching student funding data:', error);
      setError('Failed to fetch student funding data');
      setRows([]);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...rows];

    if (filters.Agent) {
      filtered = filtered.filter(item =>
        item.Agent.toLowerCase().includes(filters.Agent.toLowerCase())
      );
    }

    if (filters.studentName) {
      filtered = filtered.filter(item =>
        item.studentName.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }

    if (filters.countryAppliedFor) {
      filtered = filtered.filter(item =>
        item.countryAppliedFor.toLowerCase().includes(filters.countryAppliedFor.toLowerCase())
      );
    }

    if (filters.institutionName) {
      filtered = filtered.filter(item =>
        item.institutionName.toLowerCase().includes(filters.institutionName.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.paymentTenure) {
      filtered = filtered.filter(item => item.paymentTenure === filters.paymentTenure);
    }

    if (filters.amountRange.min) {
      filtered = filtered.filter(item => {
        const amount = parseFloat(item.amountRequired.replace(/[$,]/g, ''));
        return amount >= parseFloat(filters.amountRange.min);
      });
    }

    if (filters.amountRange.max) {
      filtered = filtered.filter(item => {
        const amount = parseFloat(item.amountRequired.replace(/[$,]/g, ''));
        return amount <= parseFloat(filters.amountRange.max);
      });
    }

    setFilteredData(filtered);
  }, [filters, rows]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmountRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      amountRange: {
        ...prev.amountRange,
        [type]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      Agent: '',
      studentName: '',
      countryAppliedFor: '',
      institutionName: '',
      status: '',
      paymentTenure: '',
      amountRange: { min: '', max: '' },
      showFilters: filters.showFilters
    });
  };

  const exportToExcel = () => {
    const exportData = filteredData.map(item => ({
      'Agent Name': item.Agent,
      'Student Name': item.studentName,
      'Amount Required': item.amountRequired,
      'Country': item.countryAppliedFor,
      'Institution': item.institutionName,
      'Course': item.courseName,
      'Payment Tenure': item.paymentTenure,
      'Status': item.status,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student Funding');
    XLSX.writeFile(wb, `admin_student_funding_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleColumnVisibilityChange = (field) => {
    setColumnVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const visibleColumns = useMemo(() => {
    return allColumns.filter(col => columnVisibility[col.field]);
  }, [columnVisibility]);

  const theme = createTheme({
    palette: {
      mode: colorMode,
    },
  });

  const handleRowClick = (params) => {
    navigate(`/admin/student-funding/view/${params.row.id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AccountBalanceIcon sx={{ fontSize: 40, color: 'white' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
                Student Funding Management (Admin)
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Manage and review all student funding requests
              </Typography>
            </Box>
            <Chip
              label={`${filteredData.length} Requests`}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 2,
                py: 2.5
              }}
            />
          </Stack>
        </Card>

        {/* Analytics Cards */}
        {analytics && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ${analytics.totalAmount?.toLocaleString() || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Amount
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  ${analytics.averageAmount?.toLocaleString() || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Average Amount
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {analytics.totalRequests || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Requests
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {analytics.statusBreakdown?.Pending || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Pending Requests
                </Typography>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Action Buttons */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              to="/admin/student-funding/add"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
            >
              Add New Request
            </Button>

            <Button
              variant="outlined"
              startIcon={<FilterAltIcon />}
              onClick={() => setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
              sx={{ px: 3 }}
            >
              {filters.showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => setColumnSettingsOpen(true)}
              sx={{ px: 3 }}
            >
              Column Settings
            </Button>

            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={exportToExcel}
              disabled={filteredData.length === 0}
              sx={{ px: 3 }}
            >
              Export to Excel
            </Button>

            <Box sx={{ flex: 1 }} />

            <Typography variant="body2" color="text.secondary">
              Showing {filteredData.length} of {rows.length} requests
            </Typography>
          </Stack>
        </Card>

        {/* Filter Section */}
        {filters.showFilters && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Filters</Typography>
              <Button size="small" onClick={clearFilters} startIcon={<CloseIcon />}>
                Clear All
              </Button>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Agent Name"
                  value={filters.Agent}
                  onChange={(e) => handleFilterChange('Agent', e.target.value)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Student Name"
                  value={filters.studentName}
                  onChange={(e) => handleFilterChange('studentName', e.target.value)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Country"
                  value={filters.countryAppliedFor}
                  onChange={(e) => handleFilterChange('countryAppliedFor', e.target.value)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={filters.institutionName}
                  onChange={(e) => handleFilterChange('institutionName', e.target.value)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {statusOptions.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Tenure</InputLabel>
                  <Select
                    value={filters.paymentTenure}
                    label="Payment Tenure"
                    onChange={(e) => handleFilterChange('paymentTenure', e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {paymentTenureOptions.map(tenure => (
                      <MenuItem key={tenure} value={tenure}>{tenure}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Min Amount"
                  type="number"
                  value={filters.amountRange.min}
                  onChange={(e) => handleAmountRangeChange('min', e.target.value)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max Amount"
                  type="number"
                  value={filters.amountRange.max}
                  onChange={(e) => handleAmountRangeChange('max', e.target.value)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Data Table */}
        <Card sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <DataTable
              columns={visibleColumns}
              rows={filteredData}
              onRowClick={handleRowClick}
            />
          )}
        </Card>

        {/* Column Settings Modal */}
        <Modal
          open={columnSettingsOpen}
          onClose={() => setColumnSettingsOpen(false)}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 400,
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Column Visibility</Typography>
              <IconButton onClick={() => setColumnSettingsOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            <FormGroup>
              {allColumns.map(col => (
                <FormControlLabel
                  key={col.field}
                  control={
                    <Checkbox
                      checked={columnVisibility[col.field]}
                      onChange={() => handleColumnVisibilityChange(col.field)}
                    />
                  }
                  label={col.headerName}
                />
              ))}
            </FormGroup>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={() => setColumnSettingsOpen(false)}
              >
                Done
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}

export default AdminStudentFunding;
