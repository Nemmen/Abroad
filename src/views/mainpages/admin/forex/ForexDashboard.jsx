import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
  useToast,
  Badge,
  Tooltip,
  Heading,
  Grid,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import ForexCalculator from './ForexCalculator';

// Constants
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://abroad-backend-gray.vercel.app/api';
const REQUESTS_PER_PAGE = 10;

// Auth config utility for cookies
const getAuthConfig = () => {
  return {
    withCredentials: true
  };
};

// Forward declaration for handler function
let handleOpenStatusModal;

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
          color = 'teal';
          break;
        case 'completed':
          color = 'green';
          break;
        case 'rejected':
          color = 'red';
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
];

const ForexDashboard = () => {
  const toast = useToast();
  const { isOpen: isStatusModalOpen, onOpen: onStatusModalOpen, onClose: onStatusModalClose } = useDisclosure();
  
  // State variables
  const [activeTab, setActiveTab] = useState(0);
  const [forexRequests, setForexRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: REQUESTS_PER_PAGE,
    total: 0,
  });
  
  // Status update modal state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  
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
        getAuthConfig()
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
  }, [pagination.page, pagination.limit, filters, toast, isAuthenticated]);
  
  // Fetch data on initial load and when dependencies change
  useEffect(() => {
    fetchForexRequests();
  }, [fetchForexRequests]);
  
  // Memoized data for the table
  const memoizedForexRequests = useMemo(() => forexRequests, [forexRequests]);

  // Handle opening status update modal
  handleOpenStatusModal = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    onStatusModalOpen();
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!selectedRequest || !newStatus) return;
    
    setStatusUpdating(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/forex/request/${selectedRequest._id}/status`,
        { status: newStatus },
        getAuthConfig()
      );
      
      if (response.data && response.data.success) {
        toast({
          title: 'Status Updated',
          description: `Request status updated to ${newStatus}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Refresh the requests list
        fetchForexRequests();
        onStatusModalClose();
      } else {
        toast({
          title: 'Error',
          description: response.data?.message || 'Failed to update status',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setStatusUpdating(false);
    }
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
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
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
                getRowId={(row) => row._id}
                onRowClick={(params) => handleOpenStatusModal(params.row)}
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

      {/* Status Update Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={onStatusModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Request Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRequest && (
              <VStack align="stretch" spacing={4}>
                <Box p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" color="gray.600">Agent</Text>
                  <Text fontWeight="medium">{selectedRequest.agent?.name || 'N/A'}</Text>
                  <Text fontSize="sm" color="gray.500">{selectedRequest.agent?.agentCode}</Text>
                </Box>
                
                <Box p={3} bg="gray.50" borderRadius="md">
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.600">Currency</Text>
                      <Text fontWeight="medium">{selectedRequest.currencyType}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Amount</Text>
                      <Text fontWeight="medium">{selectedRequest.foreignAmount?.toLocaleString()}</Text>
                    </Box>
                  </HStack>
                </Box>

                <Box p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" color="gray.600" mb={1}>Current Status</Text>
                  <Badge colorScheme={
                    selectedRequest.status === 'pending' ? 'orange' :
                    selectedRequest.status === 'completed' ? 'green' :
                    selectedRequest.status === 'rejected' ? 'red' : 'gray'
                  }>
                    {selectedRequest.status?.toUpperCase()}
                  </Badge>
                </Box>

                <FormControl>
                  <FormLabel fontWeight="medium">Select New Status</FormLabel>
                  <RadioGroup value={newStatus} onChange={setNewStatus}>
                    <Stack spacing={3}>
                      <Radio value="pending" colorScheme="orange">
                        <HStack>
                          <Badge colorScheme="orange">PENDING</Badge>
                          <Text fontSize="sm" color="gray.600">- Request is awaiting action</Text>
                        </HStack>
                      </Radio>
                      <Radio value="completed" colorScheme="green">
                        <HStack>
                          <Badge colorScheme="green">COMPLETED</Badge>
                          <Text fontSize="sm" color="gray.600">- Request has been fulfilled</Text>
                        </HStack>
                      </Radio>
                      <Radio value="rejected" colorScheme="red">
                        <HStack>
                          <Badge colorScheme="red">REJECTED</Badge>
                          <Text fontSize="sm" color="gray.600">- Request has been declined</Text>
                        </HStack>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onStatusModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleUpdateStatus}
              isLoading={statusUpdating}
              isDisabled={!newStatus || newStatus === selectedRequest?.status}
            >
              Update Status
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ForexDashboard;