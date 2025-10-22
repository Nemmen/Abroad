import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Divider,
  Text,
  VStack,
  HStack,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
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
  Spinner,
  Badge,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import DataTable from 'components/DataTable';
import { 
  saveFiltersToStorage, 
  loadFiltersFromStorage, 
  clearFiltersFromStorage,
  FILTER_STORAGE_KEYS,
  DEFAULT_FILTERS 
} from 'utils/filterUtils';
import axios from 'axios';
import * as XLSX from 'xlsx';

const getStatusColor = (status) => {
  const colors = {
    'New': 'blue',
    'In Progress': 'yellow',
    'Contacted': 'purple',
    'Resolved': 'green',
    'Closed': 'gray'
  };
  return colors[status] || 'gray';
};

const getPriorityColor = (priority) => {
  const colors = {
    'Low': 'green',
    'Medium': 'yellow',
    'High': 'orange',
    'Urgent': 'red'
  };
  return colors[priority] || 'gray';
};

const allColumns = [
  { field: 'name', headerName: 'Full Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'phone', headerName: 'Phone Number', width: 150 },
  { field: 'subject', headerName: 'Subject/Message', width: 300 },
  { field: 'message', headerName: 'Additional Comments', width: 250 },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 120,
    renderCell: (params) => (
      <Badge colorScheme={getStatusColor(params.value)}>
        {params.value}
      </Badge>
    )
  },
  { field: 'createdAt', headerName: 'Submitted On', width: 180 },
  { field: 'followUpDate', headerName: 'Follow-up Date', width: 150 },
  { field: 'assignedTo', headerName: 'Assigned Agent', width: 150 },
  { 
    field: 'priority', 
    headerName: 'Priority', 
    width: 120,
    renderCell: (params) => (
      <Badge colorScheme={getPriorityColor(params.value)}>
        {params.value}
      </Badge>
    )
  },
];

const statusOptions = ['All', 'New', 'In Progress', 'Contacted', 'Resolved', 'Closed'];
const priorityOptions = ['All', 'Low', 'Medium', 'High', 'Urgent'];

const ENQUIRY_FILTERS_KEY = 'enquiry_filters';

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    dateFrom: '',
    dateTo: '',
    searchText: '',
    assignedTo: 'All'
  });
  const [agents, setAgents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [modalAction, setModalAction] = useState('');
  
  const toast = useToast();

  // Load filters from storage on component mount
  useEffect(() => {
    const savedFilters = loadFiltersFromStorage(ENQUIRY_FILTERS_KEY);
    if (savedFilters) {
      setFilters(savedFilters);
    }
  }, []);

  // Save filters to storage when they change
  useEffect(() => {
    saveFiltersToStorage(ENQUIRY_FILTERS_KEY, filters);
  }, [filters]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://abroad-backend-gray.vercel.app/admin/enquiries' , {
          withCredentials: true
        }
      );
      if (response.data.success) {
        setEnquiries(response.data.enquiries);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch enquiries',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axios.get(
        'https://abroad-backend-gray.vercel.app/admin/agents',{
          withCredentials: true
        }
      );
      if (response.data.success) {
        setAgents(response.data.agents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    fetchAgents();
  }, []);

  const  filteredEnquiries = useMemo(() => {
    return enquiries.filter((enquiry) => {
      const statusMatch = filters.status === 'All' || enquiry.status === filters.status;
      const priorityMatch = filters.priority === 'All' || enquiry.priority === filters.priority;
      const assignedMatch = filters.assignedTo === 'All' || enquiry.assignedTo === filters.assignedTo;
      
      const textMatch = filters.searchText === '' || 
        enquiry.name.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        enquiry.email.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        enquiry.subject.toLowerCase().includes(filters.searchText.toLowerCase());

      let dateMatch = true;
      if (filters.dateFrom && filters.dateTo) {
        const enquiryDate = new Date(enquiry.createdAt);
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        dateMatch = enquiryDate >= fromDate && enquiryDate <= toDate;
      }

      return statusMatch && priorityMatch && assignedMatch && textMatch && dateMatch;
    });
  }, [enquiries, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      status: 'All',
      priority: 'All',
      dateFrom: '',
      dateTo: '',
      searchText: '',
      assignedTo: 'All'
    };
    setFilters(defaultFilters);
    clearFiltersFromStorage(ENQUIRY_FILTERS_KEY);
    toast({
      title: 'Filters Cleared',
      description: 'All filters have been reset',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleRowSelection = (selectedRows) => {
    setSelectedEnquiries(selectedRows);
  };

  const openModal = (action, enquiry = null) => {
    setModalAction(action);
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnquiry(null);
    setModalAction('');
  };

  const handleUpdateStatus = async (enquiryId, newStatus) => {
    try {
      const response = await axios.put(
        `https://abroad-backend-gray.vercel.app/admin/enquiries/${enquiryId}/status`,
        { status: newStatus},{
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        await fetchEnquiries();
        toast({
          title: 'Success',
          description: 'Enquiry status updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update enquiry status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAssignAgent = async (enquiryId, agentId) => {
    try {
      const response = await axios.put(
        `https://abroad-backend-gray.vercel.app/admin/enquiries/${enquiryId}/assign`,
        { assignedTo: agentId } ,{
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        await fetchEnquiries();
        toast({
          title: 'Success',
          description: 'Agent assigned successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error assigning agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign agent',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const exportToExcel = () => {
    const exportData = filteredEnquiries.map(enquiry => ({
      'Full Name': enquiry.name,
      'Email': enquiry.email,
      'Phone Number': enquiry.phone,
      'Subject': enquiry.subject,
      'Message': enquiry.message,
      'Status': enquiry.status,
      'Priority': enquiry.priority,
      'Submitted On': new Date(enquiry.createdAt).toLocaleDateString(),
      'Assigned To': enquiry.assignedTo || 'Unassigned',
      'Follow-up Date': enquiry.followUpDate ? new Date(enquiry.followUpDate).toLocaleDateString() : 'Not Set'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Enquiries');
    XLSX.writeFile(wb, `enquiries_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const formatEnquiryData = (enquiries) => {
    return enquiries.map((enquiry) => ({
      ...enquiry,
      id: enquiry._id,
      createdAt: new Date(enquiry.createdAt).toLocaleDateString(),
      followUpDate: enquiry.followUpDate ? new Date(enquiry.followUpDate).toLocaleDateString() : 'Not Set',
      status: enquiry.status || 'New',
      priority: enquiry.priority || 'Medium',
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Loading enquiries...</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Header */}
      <VStack spacing={4} align="stretch" mb={6}>
        <HStack justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="bold">
            Website Enquiries Management
          </Text>
          <HStack>
            <Button colorScheme="green" onClick={exportToExcel}>
              Export to Excel
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={showFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </HStack>
        </HStack>

        {/* Filters Section */}
        {showFilters && (
          <Box p={4} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
            <VStack spacing={4}>
              <HStack wrap="wrap" spacing={4} w="full">
                <FormControl minW="150px">
                  <FormLabel fontSize="sm">Status</FormLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    size="sm"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl minW="150px">
                  <FormLabel fontSize="sm">Priority</FormLabel>
                  <Select
                    value={filters.priority}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                    size="sm"
                  >
                    {priorityOptions.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl minW="150px">
                  <FormLabel fontSize="sm">Assigned To</FormLabel>
                  <Select
                    value={filters.assignedTo}
                    onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                    size="sm"
                  >
                    <option value="All">All Agents</option>
                    <option value="">Unassigned</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>{agent.name}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl minW="120px">
                  <FormLabel fontSize="sm">From Date</FormLabel>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    size="sm"
                  />
                </FormControl>

                <FormControl minW="120px">
                  <FormLabel fontSize="sm">To Date</FormLabel>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    size="sm"
                  />
                </FormControl>
              </HStack>

              <HStack w="full">
                <FormControl>
                  <FormLabel fontSize="sm">Search</FormLabel>
                  <Input
                    placeholder="Search by name, email, or subject..."
                    value={filters.searchText}
                    onChange={(e) => handleFilterChange('searchText', e.target.value)}
                    size="sm"
                  />
                </FormControl>
                <Button size="sm" colorScheme="red" onClick={clearAllFilters} mt="25px">
                  Clear All Filters
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Stats */}
        <HStack spacing={6}>
          <Box>
            <Text fontSize="sm" color="gray.600">Total Enquiries</Text>
            <Text fontSize="xl" fontWeight="bold">{enquiries.length}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">Filtered Results</Text>
            <Text fontSize="xl" fontWeight="bold">{filteredEnquiries.length}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">New Enquiries</Text>
            <Text fontSize="xl" fontWeight="bold" color="blue.500">
              {enquiries.filter((e) => e.status === 'New').length}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">In Progress</Text>
            <Text fontSize="xl" fontWeight="bold" color="yellow.500">
              {enquiries.filter((e) => e.status === 'In Progress').length}
            </Text>
          </Box>
        </HStack>
      </VStack>

      <Divider mb={6} />

      {/* Data Table */}
      <DataTable
        columns={allColumns}
        rows={formatEnquiryData(filteredEnquiries)}
        onRowSelection={handleRowSelection}
        selectedRows={selectedEnquiries}
        pageSize={25}
        checkboxSelection={true}
        onRowClick={(params) => openModal('view', params.row)}
      />

      {/* Actions for selected enquiries */}
      {selectedEnquiries.length > 0 && (
        <Box mt={4} p={4} bg="blue.50" borderRadius="md">
          <HStack>
            <Text fontWeight="bold">{selectedEnquiries.length} enquiries selected</Text>
            <Button size="sm" colorScheme="green" onClick={() => openModal('bulkAssign')}>
              Bulk Assign Agent
            </Button>
            <Button size="sm" colorScheme="blue" onClick={() => openModal('bulkStatus')}>
              Bulk Update Status
            </Button>
          </HStack>
        </Box>
      )}

      {/* Modal for enquiry actions */}
      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalAction === 'view' && 'Enquiry Details'}
            {modalAction === 'bulkAssign' && 'Assign Agent to Selected Enquiries'}
            {modalAction === 'bulkStatus' && 'Update Status for Selected Enquiries'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalAction === 'view' && selectedEnquiry && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{selectedEnquiry.name}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{selectedEnquiry.email}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Phone:</Text>
                  <Text>{selectedEnquiry.phone}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Subject:</Text>
                  <Text>{selectedEnquiry.subject}</Text>
                </Box>
                {selectedEnquiry.message && (
                  <Box>
                    <Text fontWeight="bold">Message:</Text>
                    <Text>{selectedEnquiry.message}</Text>
                  </Box>
                )}
                <HStack>
                  <Box>
                    <Text fontWeight="bold">Status:</Text>
                    <Badge colorScheme={getStatusColor(selectedEnquiry.status)}>
                      {selectedEnquiry.status}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Priority:</Text>
                    <Badge colorScheme={getPriorityColor(selectedEnquiry.priority)}>
                      {selectedEnquiry.priority}
                    </Badge>
                  </Box>
                </HStack>
                <Box>
                  <Text fontWeight="bold">Submitted:</Text>
                  <Text>{new Date(selectedEnquiry.createdAt).toLocaleString()}</Text>
                </Box>
                
                <Divider />
                
                <HStack>
                  <FormControl>
                    <FormLabel>Update Status</FormLabel>
                    <Select
                      placeholder="Select new status"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleUpdateStatus(selectedEnquiry._id, e.target.value);
                        }
                      }}
                    >
                      {statusOptions.filter(s => s !== 'All' && s !== selectedEnquiry.status).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Assign Agent</FormLabel>
                    <Select
                      placeholder="Select agent"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignAgent(selectedEnquiry._id, e.target.value);
                        }
                      }}
                    >
                      {agents.map(agent => (
                        <option key={agent._id} value={agent._id}>{agent.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>
              </VStack>
            )}
            
            {/* Add bulk action forms here if needed */}
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Enquiry;