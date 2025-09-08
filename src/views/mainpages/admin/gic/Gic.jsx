import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Divider,
  Text,
  Checkbox,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  Skeleton,
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
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Define the columns
const allColumns = [
  { field: 'Agent', headerName: 'Agent Name', width: 140 },
  { field: 'type' , headerName: 'Type', width: 100 },
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
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((col) => col.field),
  );
  
  // Filter states
  const [filters, setFilters] = useState({
    dateSort: '', // 'asc', 'desc', ''
    specificDate: '',
    agentName: '',
    studentName: '',
    dateFrom: '',
    dateTo: '',
  });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isFilterOpen, 
    onOpen: onFilterOpen, 
    onClose: onFilterClose 
  } = useDisclosure();
  const toast = useToast();

  // Safely access localStorage with error handling
  const getAuthToken = useCallback(() => {
    try {
      return localStorage.getItem('token_auth');
    } catch (err) {
      console.error("LocalStorage access error:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();

        const response = await axios.get(
          'https://abroad-backend-gray.vercel.app/auth/viewAllGicForm',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : ''
            },
            withCredentials: true
          }
        );
        
        if (response.data.success) {
          setData(response.data.gicForms);
          
          const gicForms = response.data.gicForms.map((form, index) => ({
            id: form._id || `row-${index}`,
            type: form.type || 'N/A',
            Agent: form.agentRef?.name?.toUpperCase() || 'N/A',
            accOpeningMonth: form.accOpeningMonth || 'N/A',
            studentName: form.studentRef?.name || 'N/A',
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
        toast({
          title: 'Error fetching data',
          description: error.message || 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getAuthToken, toast]);

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
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      dateSort: '',
      specificDate: '',
      agentName: '',
      studentName: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleDownloadExcel = useCallback(() => {
    // Clean and prepare data
    const cleanData = data.map((item) => {
      // Retain only relevant fields and rename keys to match column names
      return {
        type: item.type || 'N/A',
        Agent: item.agentRef?.name?.toUpperCase() || 'N/A',
        accOpeningMonth: item.accOpeningMonth || 'N/A',
        studentName: item.studentRef?.name || 'N/A',
        passportNo: item.studentPassportNo || 'N/A',
        studentPhoneNo: item.studentPhoneNo || 'N/A',
        bankVendor: item.bankVendor || 'N/A',
        accFundingMonth: item.fundingMonth || 'N/A',
        commissionAmt: item.commissionAmt || 0,
        tds: item.tds || '0',
        netPayable: item.netPayable || 0,
        commissionStatus: item.commissionStatus || 'N/A',
      };
    });
  
    // Filter columns based on selection
    const filteredData = cleanData.map((item) =>
      selectedColumns.reduce((acc, field) => {
        acc[field] = item[field] || 'N/A'; 
        return acc;
      }, {}),
    );
  
    try {
      // Generate Excel file
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Gic Data');
      XLSX.writeFile(workbook, 'GicData.xlsx');

      toast({
        title: 'Excel file downloaded',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Excel generation error:', error);
      toast({
        title: 'Export failed',
        description: 'Unable to generate Excel file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [data, selectedColumns, toast]);
  
  const handleColumnSelection = useCallback((field) => {
    setSelectedColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field],
    );
  }, []);

  // Memoize the filtered columns
  const memoizedColumns = useMemo(
    () => allColumns.filter((col) => selectedColumns.includes(col.field)),
    [selectedColumns],
  );
  
  // Memoize rows to prevent re-rendering the table unnecessarily
  const memoizedRows = useMemo(() => filteredData.length > 0 ? filteredData : rows, [filteredData, rows]);

  return (
    <Box width="full">
      <Box
        display="flex"
        padding={7}
        paddingBottom={3}
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box className="mb-6 lg:mb-0">
          <Text fontSize="34px">GIC / Blocked Account Registrations</Text>
        </Box>
        <Box>
          <Button
            onClick={onOpen}
            width="200px"
            variant="solid"
            colorScheme="teal"
            borderRadius="none"
            mr={4}
            mb={1}
          >
            Filter Columns
          </Button>
          <Button
            onClick={onFilterOpen}
            width="200px"
            variant="solid"
            colorScheme="purple"
            borderRadius="none"
            mr={4}
            mb={1}
          >
            Filter & Sort Data
          </Button>
          <Button
            onClick={handleDownloadExcel}
            width="200px"
            variant="solid"
            colorScheme="green"
            borderRadius="none"
            mr={4}
            mb={1}
            isDisabled={isLoading || data.length === 0}
          >
            Download Excel
          </Button>
          <Link to="/admin/gic/form">
            <Button
              width="200px"
              variant="outline"
              colorScheme="blue"
              borderRadius="none"
              mb={1}
            >
              Add New
            </Button>
          </Link>
        </Box>
      </Box>
      <Divider
        width="96%"
        mx="auto"
        mb="20px"
        bgColor="blackAlpha.400"
        height="0.5px"
      />
      
      <Box maxHeight="1200px" overflowY="auto" px={4}>
        {isLoading ? (
          <Box py={4}>
            <Skeleton height="60px" mb={4} />
            <Skeleton height="500px" />
          </Box>
        ) : (
          <DataTable columns={memoizedColumns} rows={memoizedRows} />
        )}
      </Box>

      {/* Modal for Column Filtering */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Columns</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={2}>
              {allColumns.map((col) => (
                <Checkbox
                  key={col.field}
                  isChecked={selectedColumns.includes(col.field)}
                  onChange={() => handleColumnSelection(col.field)}
                  colorScheme="blue"
                >
                  {col.headerName}
                </Checkbox>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="red" 
              variant="outline" 
              onClick={() => setSelectedColumns([])}
              mr={2}
            >
              Clear Filter
            </Button>
            <Button 
              colorScheme="gray" 
              variant="outline" 
              onClick={() => setSelectedColumns(allColumns.map(col => col.field))}
              mr={2}
            >
              Select All
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Data Filter and Sort Modal */}
      <Modal isOpen={isFilterOpen} onClose={onFilterClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter & Sort Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>Sort by Date</Tab>
                <Tab>Filter by Date</Tab>
                <Tab>Filter by Name</Tab>
              </TabList>

              <TabPanels>
                {/* Date Sorting Tab */}
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <FormControl>
                      <FormLabel>Sort by Account Opening Date</FormLabel>
                      <HStack spacing={4}>
                        <Button
                          size="sm"
                          colorScheme={filters.dateSort === 'asc' ? 'blue' : 'gray'}
                          variant={filters.dateSort === 'asc' ? 'solid' : 'outline'}
                          leftIcon={<ChevronUpIcon />}
                          onClick={() => handleFilterChange('dateSort', 'asc')}
                        >
                          Ascending (Old → New)
                        </Button>
                        <Button
                          size="sm"
                          colorScheme={filters.dateSort === 'desc' ? 'blue' : 'gray'}
                          variant={filters.dateSort === 'desc' ? 'solid' : 'outline'}
                          leftIcon={<ChevronDownIcon />}
                          onClick={() => handleFilterChange('dateSort', 'desc')}
                        >
                          Descending (New → Old)
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleFilterChange('dateSort', '')}
                        >
                          Clear
                        </Button>
                      </HStack>
                    </FormControl>
                  </VStack>
                </TabPanel>

                {/* Date Filtering Tab */}
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <FormControl>
                      <FormLabel>Filter by Specific Date</FormLabel>
                      <Input
                        type="date"
                        value={filters.specificDate}
                        onChange={(e) => handleFilterChange('specificDate', e.target.value)}
                      />
                    </FormControl>
                    
                    <Divider />
                    
                    <FormControl>
                      <FormLabel>Filter by Date Range</FormLabel>
                      <HStack spacing={4}>
                        <Box>
                          <Text fontSize="sm" mb={1}>From Date</Text>
                          <Input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                          />
                        </Box>
                        <Box>
                          <Text fontSize="sm" mb={1}>To Date</Text>
                          <Input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                          />
                        </Box>
                      </HStack>
                    </FormControl>
                  </VStack>
                </TabPanel>

                {/* Name Filtering Tab */}
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <FormControl>
                      <FormLabel>Filter by Agent Name</FormLabel>
                      <Input
                        placeholder="Enter agent name to search..."
                        value={filters.agentName}
                        onChange={(e) => handleFilterChange('agentName', e.target.value)}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Filter by Student Name</FormLabel>
                      <Input
                        placeholder="Enter student name to search..."
                        value={filters.studentName}
                        onChange={(e) => handleFilterChange('studentName', e.target.value)}
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          
          <ModalFooter>
            <Button 
              colorScheme="red" 
              variant="outline" 
              onClick={clearAllFilters}
              mr={2}
            >
              Clear All Filters
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={onFilterClose}
            >
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Gic;