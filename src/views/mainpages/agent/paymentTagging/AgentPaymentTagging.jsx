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
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Paper,
  Stack,
  IconButton,
} from '@mui/material';
import DataTable from 'components/DataTable';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import {
  saveFiltersToStorage,
  loadFiltersFromStorage,
  clearFiltersFromStorage,
  FILTER_STORAGE_KEYS,
  DEFAULT_FILTERS,
} from 'utils/filterUtils';

const allColumns = [
  { field: 'studentRef', headerName: 'Student Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'mobile', headerName: 'Mobile', width: 150 },
  { field: 'institutionName', headerName: 'Institution', width: 200 },
  { field: 'paymentReferenceNumber', headerName: 'Payment Ref', width: 150 },
  { field: 'letterType', headerName: 'Letter Type', width: 120 },
  { field: 'dateOfLetterGeneration', headerName: 'Letter Date', width: 150 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'createdAt', headerName: 'Created At', width: 150 },
];

const AgentPaymentTagging = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((col) => col.field)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.Auth);
  const { colorMode } = useColorMode();

  // Filter states with persistent storage
  const [filters, setFilters] = useState(() =>
    loadFiltersFromStorage(
      FILTER_STORAGE_KEYS.AGENT_PAYMENT_TAGGING,
      DEFAULT_FILTERS.AGENT_PAYMENT_TAGGING || {
        letterType: 'all',
        status: 'all',
        searchTerm: '',
      }
    )
  );

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
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

  // Handle row click to navigate to view page
  const handleRowClick = (params) => {
    navigate(`/agent/payment-tagging/view/${params.id}`);
  };

  // Fetch Payment Tagging Data
  useEffect(() => {
    const fetchPaymentTagging = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          agentRef: user?._id || '',
          page: pagination.page,
          limit: pagination.limit,
        });

        if (filters.letterType && filters.letterType !== 'all') {
          queryParams.append('letterType', filters.letterType);
        }
        if (filters.status && filters.status !== 'all') {
          queryParams.append('status', filters.status);
        }

        const response = await axios.get(
          `https://abroad-backend-gray.vercel.app/api/payment-tagging/agent/get?${queryParams}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setData(response.data.data);
          setPagination((prev) => ({
            ...prev,
            total: response.data.pagination.totalRecords,
            pages: response.data.pagination.totalPages,
          }));
        }
      } catch (error) {
        console.error('Error fetching payment tagging:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchPaymentTagging();
    }
  }, [user, pagination.page, pagination.limit, filters]);

  // Apply filters
  useEffect(() => {
    let result = [...data];

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.studentName?.toLowerCase().includes(searchLower) ||
          item.email?.toLowerCase().includes(searchLower) ||
          item.paymentReferenceNumber?.toLowerCase().includes(searchLower) ||
          item.institutionName?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredData(result);
  }, [data, filters]);

  // Transform data for DataTable
  useEffect(() => {
    const transformedRows = filteredData.map((item) => ({
      id: item._id,
      studentRef: item.studentRef?.name || item.studentName || 'N/A',
      email: item.email || 'N/A',
      mobile: item.mobile || 'N/A',
      institutionName: item.institutionName || 'N/A',
      paymentReferenceNumber: item.paymentReferenceNumber || 'N/A',
      letterType: item.letterType || 'N/A',
      dateOfLetterGeneration: item.dateOfLetterGeneration
        ? new Date(item.dateOfLetterGeneration).toLocaleDateString()
        : 'N/A',
      status: item.status || 'N/A',
      createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : 'N/A',
    }));
    setRows(transformedRows);
  }, [filteredData]);

  // Save filters to storage whenever they change
  useEffect(() => {
    saveFiltersToStorage(FILTER_STORAGE_KEYS.AGENT_PAYMENT_TAGGING, filters);
  }, [filters]);

  const handleColumnToggle = (field) => {
    setSelectedColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field]
    );
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      letterType: 'all',
      status: 'all',
      searchTerm: '',
    };
    setFilters(defaultFilters);
    clearFiltersFromStorage(FILTER_STORAGE_KEYS.AGENT_PAYMENT_TAGGING);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const visibleColumns = allColumns.filter((col) =>
    selectedColumns.includes(col.field)
  );

  // Export to Excel
  const handleExportToExcel = () => {
    const exportData = filteredData.map((item) => ({
      'Student Name': item.studentRef?.name || item.studentName || 'N/A',
      Email: item.email || 'N/A',
      Mobile: item.mobile || 'N/A',
      Institution: item.institutionName || 'N/A',
      'Payment Reference': item.paymentReferenceNumber || 'N/A',
      'Letter Type': item.letterType || 'N/A',
      'Letter Date': item.dateOfLetterGeneration
        ? new Date(item.dateOfLetterGeneration).toLocaleDateString()
        : 'N/A',
      Status: item.status || 'N/A',
      'Created At': item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : 'N/A',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payment Tagging');
    XLSX.writeFile(wb, 'payment_tagging_records.xlsx');
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prev) => ({ ...prev, limit: newPageSize, page: 1 }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="bold">
              Payment Tagging Records
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<FilterAltIcon />}
                onClick={() => setIsFilterModalOpen(true)}
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={() => setIsModalOpen(true)}
              >
                Columns
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportToExcel}
              >
                Export
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/agent/payment-tagging/form"
              >
                + Add New
              </Button>
            </Stack>
          </Stack>
        </Card>

        {/* Data Table */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Card>
            <DataTable
              columns={visibleColumns}
              rows={rows}
              loading={loading}
              onRowClick={handleRowClick}
              pagination={{
                page: pagination.page,
                pageSize: pagination.limit,
                total: pagination.total,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange,
              }}
            />
          </Card>
        )}

        {/* Column Selector Modal */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="column-selector-modal"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Select Columns</Typography>
              <IconButton onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <FormGroup>
              {allColumns.map((col) => (
                <FormControlLabel
                  key={col.field}
                  control={
                    <Checkbox
                      checked={selectedColumns.includes(col.field)}
                      onChange={() => handleColumnToggle(col.field)}
                    />
                  }
                  label={col.headerName}
                />
              ))}
            </FormGroup>
          </Box>
        </Modal>

        {/* Filter Modal */}
        <Modal
          open={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          aria-labelledby="filter-modal"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h6">Filter Options</Typography>
              <IconButton onClick={() => setIsFilterModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search"
                  placeholder="Search by student, email, reference..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange('searchTerm', e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Letter Type</InputLabel>
                  <Select
                    value={filters.letterType}
                    label="Letter Type"
                    onChange={(e) =>
                      handleFilterChange('letterType', e.target.value)
                    }
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="Flywire">Flywire</MenuItem>
                    <MenuItem value="Convera">Convera</MenuItem>
                    <MenuItem value="Cibc">Cibc</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) =>
                      handleFilterChange('status', e.target.value)
                    }
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setIsFilterModalOpen(false)}
                  >
                    Apply
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default AgentPaymentTagging;
