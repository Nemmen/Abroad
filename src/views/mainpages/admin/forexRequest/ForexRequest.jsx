import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Collapse,
  Alert,
  CircularProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Search,
  FilterList,
  ExpandMore,
  ExpandLess,
  Visibility,
  CheckCircle,
  Cancel,
  AccessTime,
  Phone,
  Refresh,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Status chip color mapping
const statusColors = {
  pending: 'warning',
  contacted: 'info',
  completed: 'success',
  cancelled: 'error',
};

// Status icon mapping
const statusIcons = {
  pending: <AccessTime fontSize="small" />,
  contacted: <Phone fontSize="small" />,
  completed: <CheckCircle fontSize="small" />,
  cancelled: <Cancel fontSize="small" />,
};

const ForexRequest = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    currency: '',
    startDate: null,
    endDate: null,
    agentId: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  // Currency options
  const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  
  // Statistics
  const [stats, setStats] = useState({
    pending: 0,
    contacted: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });

  // Fetch forex requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page + 1); // API uses 1-based indexing
      queryParams.append('limit', rowsPerPage);
      queryParams.append('sortBy', filters.sortBy);
      queryParams.append('sortOrder', filters.sortOrder);
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.currency) queryParams.append('currency', filters.currency);
      if (filters.agentId) queryParams.append('agentId', filters.agentId);
      if (filters.minAmount) queryParams.append('minAmount', filters.minAmount);
      if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount);
      
      if (filters.startDate) {
        queryParams.append('startDate', moment(filters.startDate).format('YYYY-MM-DD'));
      }
      
      if (filters.endDate) {
        queryParams.append('endDate', moment(filters.endDate).format('YYYY-MM-DD'));
      }
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/api/forex/all-requests?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("API Response:", response.data); // For debugging
      
      if (response.data?.data?.requests) {
        setRequests(response.data.data.requests);
        setTotalRequests(response.data.data.totalCount || 0);
        
        // Update statistics
        setStats({
          pending: response.data.data.statusCounts?.pending || 0,
          contacted: response.data.data.statusCounts?.contacted || 0,
          completed: response.data.data.statusCounts?.completed || 0,
          cancelled: response.data.data.statusCounts?.cancelled || 0,
          total: response.data.data.totalCount || 0,
        });
      } else {
        setRequests([]);
        setTotalRequests(0);
        setStats({
          pending: 0,
          contacted: 0,
          completed: 0,
          cancelled: 0,
          total: 0,
        });
        setError('Invalid response format from API');
      }
      
    } catch (err) {
      console.error('Error fetching forex requests:', err);
      setRequests([]);
      setTotalRequests(0);
      setStats({
        pending: 0,
        contacted: 0,
        completed: 0,
        cancelled: 0,
        total: 0,
      });
      setError(err.response?.data?.message || 'Failed to load forex requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, rowsPerPage, filters.sortBy, filters.sortOrder]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setPage(0); // Reset page when applying new filters
    fetchRequests();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      currency: '',
      startDate: null,
      endDate: null,
      agentId: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPage(0);
  };

  // Handle sort change
  const handleSort = (field) => {
    if (filters.sortBy === field) {
      // Toggle sort order if already sorting by this field
      handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to descending
      handleFilterChange('sortBy', field);
      handleFilterChange('sortOrder', 'desc');
    }
  };

  // Format currency with 2 decimal places
  const formatCurrency = (amount, currency = '') => {
    return `${currency} ${parseFloat(amount).toFixed(2)}`;
  };

  // Get human-readable date
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM DD, YYYY');
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };

  return (
    <Box p={isMobile ? 2 : 3}>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            Forex Requests
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchRequests()}
            startIcon={<Refresh />}
            sx={{ mr: 1, mb: { xs: 1, md: 0 } }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setFiltersOpen(!filtersOpen)}
            startIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
            sx={{ mb: { xs: 1, md: 0 } }}
          >
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" color="warning.main" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" color="info.main" gutterBottom>
                Contacted
              </Typography>
              <Typography variant="h4">{stats.contacted}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" color="success.main" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4">{stats.completed}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="h6" color="error.main" gutterBottom>
                Cancelled
              </Typography>
              <Typography variant="h4">{stats.cancelled}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Collapse in={filtersOpen}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="currency-filter-label">Currency</InputLabel>
                <Select
                  labelId="currency-filter-label"
                  value={filters.currency}
                  label="Currency"
                  onChange={(e) => handleFilterChange('currency', e.target.value)}
                >
                  <MenuItem value="">All Currencies</MenuItem>
                  {currencyOptions.map((curr) => (
                    <MenuItem key={curr} value={curr}>{curr}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(newValue) => handleFilterChange('startDate', newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(newValue) => handleFilterChange('endDate', newValue)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Agent ID"
                value={filters.agentId}
                onChange={(e) => handleFilterChange('agentId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Min Amount"
                type="number"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Max Amount"
                type="number"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={resetFilters}>
                  Reset
                </Button>
                <Button variant="contained" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Request Table */}
      <Paper>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableCell
                    component="div"
                    sx={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 'bold',
                      p: 0
                    }}
                    onClick={() => handleSort('createdAt')}
                  >
                    Date {getSortIcon('createdAt')}
                  </TableCell>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 'bold'
                    }}
                    onClick={() => handleSort('agent.name')}
                  >
                    Agent {getSortIcon('agent.name')}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 'bold'
                    }}
                    onClick={() => handleSort('requestDetails.sourceCurrency')}
                  >
                    Currency {getSortIcon('requestDetails.sourceCurrency')}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 'bold',
                      justifyContent: 'flex-end'
                    }}
                    onClick={() => handleSort('requestDetails.foreignCurrencyAmount')}
                  >
                    Amount {getSortIcon('requestDetails.foreignCurrencyAmount')}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 'bold',
                      justifyContent: 'flex-end'
                    }}
                    onClick={() => handleSort('requestDetails.convertedAmountInINR')}
                  >
                    INR Value {getSortIcon('requestDetails.convertedAmountInINR')}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 'bold'
                    }}
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </Box>
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No forex requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request._id} hover>
                    <TableCell>
                      {formatDate(request.createdAt)}
                    </TableCell>
                    <TableCell>
                      {request.agent ? (
                        <div>
                          <Typography variant="body2">{request.agent.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {request.agent.email}
                          </Typography>
                        </div>
                      ) : 'Unknown Agent'}
                    </TableCell>
                    <TableCell>
                      {request.requestDetails?.sourceCurrency || 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      {request.requestDetails ? 
                        formatCurrency(request.requestDetails.foreignCurrencyAmount, request.requestDetails.sourceCurrency) : 
                        'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      {request.requestDetails ? 
                        formatCurrency(request.requestDetails.convertedAmountInINR, 'INR') : 
                        'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={request.status ? statusIcons[request.status] : <AccessTime fontSize="small" />}
                        label={request.status ? 
                          (request.status.charAt(0).toUpperCase() + request.status.slice(1)) : 
                          'Unknown'}
                        color={request.status ? statusColors[request.status] : 'default'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/admin/forex-requests/${request._id}`)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalRequests}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ForexRequest;