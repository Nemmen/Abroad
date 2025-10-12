import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  Select,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  useToast,
  Badge,
  Tooltip,
  Flex,
  Heading,
  Grid,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
  WarningTwoIcon,
  PhoneIcon,
  EmailIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import DataTable from 'components/DataTable';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
import ForexCalculator from './ForexCalculator';

// Constants
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000/api';
const REQUESTS_PER_PAGE = 10;

// Auth headers utility
const getAuthHeaders = () => {
  const token = localStorage.getItem('token_auth');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Forward declarations of handler functions
let handleViewRequest;
let handleOpenCalculatePage;
let handleMarkAsContacted;

// Define columns for request table
const allColumns = [
  { 
    field: 'agent', 
    headerName: 'Agent', 
    width: 180, 
    renderCell: (params) => (
      <Tooltip label={`${params.value?.name} (${params.value?.email})\n${params.value?.phoneNumber || 'No Phone'}`}>
        <VStack align="start" spacing={0}>
          <Text fontWeight="medium">{params.value?.name || 'N/A'}</Text>
          <Text fontSize="xs" color="gray.600">{params.value?.agentCode || ''}</Text>
        </VStack>
      </Tooltip>
    ),
  },
  { 
    field: 'createdAt', 
    headerName: 'Request Date', 
    width: 130,
    renderCell: (params) => (
      <span>
        {format(new Date(params.value), 'dd/MM/yyyy')}
      </span>
    ),
  },
  { 
    field: 'currencyType', 
    headerName: 'Currency', 
    width: 100,
    renderCell: (params) => (
      <Badge colorScheme="blue">{params.value}</Badge>
    ),
  },
  { 
    field: 'foreignAmount', 
    headerName: 'Amount', 
    width: 120,
    renderCell: (params) => (
      <span>
        {params.row.currencyType} {params.value.toLocaleString()}
      </span>
    ),
  },
  { 
    field: 'agentMargin', 
    headerName: 'Margin', 
    width: 100,
    renderCell: (params) => (
      <span>
        {params.value.toFixed(2)}
      </span>
    ),
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 140,
    renderCell: (params) => {
      let color;
      switch (params.value) {
        case 'pending':
          color = 'orange';
          break;
        case 'calculated':
          color = 'blue';
          break;
        case 'contacted':
          color = 'green';
          break;
        default:
          color = 'gray';
      }
      return (
        <Badge colorScheme={color}>
          {params.value.toUpperCase()}
        </Badge>
      );
    },
  },
  { 
    field: 'actions', 
    headerName: 'Actions', 
    width: 220,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Flex 
        justify="center" 
        align="center" 
        width="100%" 
        height={30}
        onClick={(e) => {
          // Stop propagation to prevent row click
          e.stopPropagation();
        }}
      >
        <HStack spacing={5} >
          <Tooltip label="View Details" placement="top">
            <IconButton 
              icon={<ViewIcon />} 
              size="md" 
              colorScheme="blue" 
              variant="solid"
              borderRadius="full"
              boxShadow="md"
              onClick={(e) => {
                e.stopPropagation();
                handleViewRequest(params.row._id);
              }}
            />
          </Tooltip>
          
          {params.row.status === 'pending' && (
            <Tooltip label="Calculate" placement="top">
              <IconButton 
                icon={<EditIcon />} 
                size="md" 
                colorScheme="green" 
                variant="solid"
                borderRadius="full"
                boxShadow="md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenCalculatePage(params.row);
                }}
              />
            </Tooltip>
          )}
          
          {params.row.status === 'calculated' && (
            <Tooltip label="Mark as Contacted" placement="top">
              <IconButton 
                icon={<PhoneIcon />} 
                size="md" 
                colorScheme="purple" 
                variant="solid"
                borderRadius="full"
                boxShadow="md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsContacted(params.row._id);
                }}
              />
            </Tooltip>
          )}
        </HStack>
      </Flex>
    ),
  },
];

const ForexDashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  
  // State variables
  const [activeTab, setActiveTab] = useState(0);
  const [forexRequests, setForexRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: REQUESTS_PER_PAGE,
    total: 0,
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    currencyType: '',
    dateFrom: '',
    dateTo: '',
    agentId: '',
  });
  
  // State for auth check
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Forward declarations for handler functions
  let handleViewRequest, handleOpenCalculatePage, handleMarkAsContacted;
  
  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token_auth');
    const userRole = localStorage.getItem('user_role');
    
    if (!token || userRole !== 'admin') {
      setIsAuthenticated(false);
      toast({
        title: "Authentication Error",
        description: "You must be logged in as admin to access this page",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Fetch forex requests with pagination and filters
  const fetchForexRequests = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    
    try {
      // Build query params
      const queryParams = new URLSearchParams({
        page: pagination.page + 1, // API pagination starts at 1
        limit: pagination.limit,
      });
      
      // Add filters if they exist
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      const response = await axios.get(
        `${API_BASE_URL}/forex/requests?${queryParams.toString()}`,
        getAuthHeaders()
      );
      
      if (response.data && response.data.success) {
        setForexRequests(response.data.requests);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
        }));
      } else {
        toast({
          title: 'Error fetching requests',
          description: 'Could not load forex requests',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching forex requests:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch forex requests',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, toast]);
  
  // Fetch data on initial load and when dependencies change
  useEffect(() => {
    fetchForexRequests();
  }, [fetchForexRequests]);
  
  // Memoized data for the table
  const memoizedForexRequests = useMemo(() => forexRequests, [forexRequests]);
  
  // Assign the handler functions to the forward declared variables
  handleViewRequest = (requestId) => {
    if (!isAuthenticated) return;
    
    try {
      // If requestId is actually a row ID (agentCode), find the corresponding request
      let actualRequestId = requestId;
      if (typeof requestId === 'string' && requestId.startsWith('AGT')) {
        const matchingRequest = forexRequests.find(r => r.agent?.agentCode === requestId);
        if (matchingRequest) {
          actualRequestId = matchingRequest._id;
        }
      }
      
      // Navigate to the detail page
      navigate(`/admin/forex/request/${actualRequestId}`);
      
    } catch (error) {
      console.error('Error navigating to request details:', error);
      toast({
        title: 'Error',
        description: 'Failed to navigate to request details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Handle opening calculate page
  handleOpenCalculatePage = (request) => {
    navigate(`/admin/forex/calculate/${request._id}`);
  };
  
  // Handle marking request as contacted (redirect to details page to perform the action)
  handleMarkAsContacted = (requestId) => {
    if (!isAuthenticated) return;
    navigate(`/admin/forex/request/${requestId}`);
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage,
    }));
  };
  
  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({
      ...prev,
      limit: newPageSize,
      page: 0, // Reset to first page when changing page size
    }));
  };
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      page: 0,
    }));
  };
  
  // No longer needed
  
  // Export to Excel
  const handleExport = () => {
    // Create worksheet from json data
    const worksheet = XLSX.utils.json_to_sheet(
      forexRequests.map(request => ({
        'Agent Name': request.agent?.name || 'N/A',
        'Agent Email': request.agent?.email || 'N/A',
        'Request Date': format(new Date(request.createdAt), 'dd/MM/yyyy'),
        'Currency': request.currencyType,
        'Amount': request.foreignAmount,
        'Agent Margin': request.agentMargin.toFixed(2),
        'Status': request.status.toUpperCase(),
        'Notes': request.notes || ''
      }))
    );
    
    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Forex Requests');
    
    // Generate file name with date
    const fileName = `forex_requests_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    
    // Write and download
    XLSX.writeFile(workbook, fileName);
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      status: '',
      currencyType: '',
      dateFrom: '',
      dateTo: '',
      agentId: '',
    });
  };
  
  // Format currency
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <Box px={4} py={6}>
      <Heading size="lg" mb={6}>Forex Management Dashboard</Heading>
      
      {!isAuthenticated && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          You must be logged in as an admin to access this page. Please check your authentication.
        </Alert>
      )}
      
      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab fontWeight="semibold">Forex Requests</Tab>
          <Tab fontWeight="semibold">Calculator</Tab>
        </TabList>
        
        <TabPanels>
          {/* Forex Requests Tab */}
          <TabPanel p={0} pt={4}>
            <Box bgColor="white" p={4} borderRadius="md" boxShadow="sm" mb={4}>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <HStack>
                    <Button colorScheme="blue" size="sm" onClick={handleExport}>
                      Export to Excel
                    </Button>
                  </HStack>
                  <Text fontSize="sm">
                    Total Requests: <strong>{pagination.total}</strong>
                  </Text>
                </HStack>
                
                {/* Filter Section */}
                <Box borderWidth="1px" borderRadius="md" p={4}>
                  <Text fontWeight="semibold" mb={3}>Filters</Text>
                  <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
                    <FormControl>
                      <FormLabel fontSize="sm">Status</FormLabel>
                      <Select 
                        size="sm"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="calculated">Calculated</option>
                        <option value="contacted">Contacted</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontSize="sm">Currency</FormLabel>
                      <Select 
                        size="sm"
                        value={filters.currencyType}
                        onChange={(e) => handleFilterChange('currencyType', e.target.value)}
                      >
                        <option value="">All Currencies</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="AUD">AUD</option>
                        <option value="CAD">CAD</option>
                        <option value="AED">AED</option>
                        <option value="MYR">MYR</option>
                      </Select>
                    </FormControl>
                    
                    <HStack>
                      <FormControl>
                        <FormLabel fontSize="sm">From Date</FormLabel>
                        <Input 
                          type="date" 
                          size="sm"
                          value={filters.dateFrom}
                          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm">To Date</FormLabel>
                        <Input 
                          type="date" 
                          size="sm"
                          value={filters.dateTo}
                          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        />
                      </FormControl>
                    </HStack>
                  </Grid>
                  
                  <HStack justify="flex-end" mt={4}>
                    <Button size="sm" variant="outline" onClick={handleResetFilters}>
                      Reset Filters
                    </Button>
                  </HStack>
                </Box>
              </VStack>
            </Box>
            
            {/* Data Table */}
            <Box maxHeight="600px" overflowY="auto" bgColor="white" borderRadius="md" boxShadow="sm">
              <DataTable 
                columns={allColumns} 
                rows={memoizedForexRequests} 
                loading={loading}
                getRowId={(row) => row.agent?.agentCode || row._id}
                onRowClick={(params) => handleViewRequest(params.id)}
                pagination={{
                  page: pagination.page,
                  pageSize: pagination.limit,
                  total: pagination.total,
                  pageSizeOptions: [10, 25, 50],
                  onPageChange: handlePageChange,
                  onPageSizeChange: handlePageSizeChange,
                }}
                disableColumnMenu
                getRowClassName={(params) => {
                  switch (params.row.status) {
                    case 'pending': return 'row-pending';
                    case 'calculated': return 'row-calculated';
                    case 'contacted': return 'row-contacted';
                    default: return '';
                  }
                }}
              />
            </Box>
            

          </TabPanel>
          
          {/* Calculator Tab */}
          <TabPanel>
            <ForexCalculator />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ForexDashboard;