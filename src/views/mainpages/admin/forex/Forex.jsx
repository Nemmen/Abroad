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
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

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
  { field: 'commissionStatus', headerName: 'Commission Status', width: 180 },
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
  
  // Filter states
  const [filters, setFilters] = useState({
    dateSort: '', // 'asc', 'desc', ''
    specificDate: '',
    agentName: '',
    studentName: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://abroad-backend-gray.vercel.app/auth/viewAllForexForms',
        );
        if (response.data.forexForms) {
          const forexForms = response.data.forexForms.map((item) => ({
            id: item._id,
            agentRef: item.agentRef?.name.toUpperCase() || 'N/A',
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
          setRows(forexForms);
          setData(response.data.forexForms);
        }
      } catch (error) {
        console.error('Error fetching forex forms:', error);
      }
    };

    fetchData();
  }, []);

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

  const memoizedColumns = useMemo(
    () => allColumns.filter((col) => selectedColumns.includes(col.field)),
    [selectedColumns],
  );
  const memoizedRows = useMemo(() => filteredData.length > 0 ? filteredData : rows, [filteredData, rows]);

  return (
    <Box width={'full'}>
      <Box
        display={'flex'}
        padding={7}
        paddingBottom={3}
        justifyContent={'space-between'}
        alignItems={'center'}
        flexWrap={'wrap'}
      >
        <Text fontSize="34px" className='mb-6 lg:mb-0'>FOREX Registrations</Text>
        <div>
          <Button
            onClick={() => setIsModalOpen(true)}
            width={'200px'}
            variant="solid"
            colorScheme="teal"
            borderRadius={'none'}
            mr={4}
            mb={1}
          >
            Filter Columns
          </Button>
          <Button
            onClick={() => setIsFilterModalOpen(true)}
            width={'200px'}
            variant="solid"
            colorScheme="purple"
            borderRadius={'none'}
            mr={4}
            mb={1}
          >
            Filter & Sort Data
          </Button>
          <Button
            onClick={handleDownloadExcel}
            width={'200px'}
            variant="solid"
            colorScheme="green"
            borderRadius={'none'}
            mr={4}
            mb={1}
          >
            Download Excel
          </Button>
          <Link to={'/admin/forex/form'}>
            <Button
              width={'200px'}
              variant="outline"
              colorScheme="blue"
              borderRadius={'none'}
              mb={1}
            >
              Add New
            </Button>
          </Link>
        </div>
      </Box>
      <Divider
        width={'96%'}
        mx={'auto'}
        mb={'20px'}
        bgColor={'black'}
        height={'0.5px'}
      />
      <Box maxHeight="1200px" overflowY="auto">
        <DataTable columns={memoizedColumns} rows={memoizedRows} />
      </Box>

      {/* Modal for Column Filtering */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Columns</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start">
              {allColumns.map((col) => (
                <Checkbox
                  key={col.field}
                  isChecked={selectedColumns.includes(col.field)}
                  onChange={() => handleColumnSelection(col.field)}
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
            <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Data Filter and Sort Modal */}
      <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} size="xl">
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
                      <FormLabel>Sort by Transaction Date</FormLabel>
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
              onClick={() => setIsFilterModalOpen(false)}
            >
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Forex;
