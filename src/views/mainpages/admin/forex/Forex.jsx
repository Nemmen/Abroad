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
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import { 
  saveFiltersToStorage, 
  loadFiltersFromStorage, 
  clearFiltersFromStorage,
  FILTER_STORAGE_KEYS,
  DEFAULT_FILTERS 
} from 'utils/filterUtils';
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
  { field: 'aecommission', headerName: 'AE Commission', width: 150 },
  { field: 'tds', headerName: 'TDS', width: 100 },
  { field: 'netPayable', headerName: 'Net Payable', width: 150 },
  { field: 'remarks', headerName: 'Remarks', width: 200 },
  { 
    field: 'commissionStatus', 
    headerName: 'Commission Status', 
    width: 180,
    renderCell: (params) => {
      let displayText = params.value;
      
      // Replace "not received" with "non claimable" for display
      if (displayText?.toLowerCase().includes('not received')) {
        displayText = displayText.replace(/not received/gi, 'non claimable');
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
  const [tabValue, setTabValue] = useState("0");
  
  // Bulk operations states
  const [selectedRows, setSelectedRows] = useState([]);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState({
    commissionStatus: '',
    commissionPaymentDate: '',
  });
  
  // Filter states with persistent storage
  const [filters, setFilters] = useState(() => 
    loadFiltersFromStorage(FILTER_STORAGE_KEYS.ADMIN_FOREX, DEFAULT_FILTERS.ADMIN_FOREX)
  );
  
  // AE Commission summary states
  const [aeCommissionSummary, setAeCommissionSummary] = useState({
    total: 0,
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
            aecommission: item.aecommission || 0,
            tds: item.tds || 0,
            netPayable: item.netPayable || 0,
            remarks: item.remarks || 'N/A',
            commissionStatus: item.commissionStatus || 'N/A',
          }));
          
          // Sort by date (latest first)
          forexForms.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          setRows(forexForms);
          setData(response.data.forexForms);
        }
      } catch (error) {
        console.error('Error fetching forex forms:', error);
      }
    };

    fetchData();
  }, []);

  // Extract unique values for filter dropdowns
  const uniqueValues = useMemo(() => {
    return {
      commissionStatus: [...new Set(rows.map(item => item.commissionStatus).filter(val => val && val !== 'N/A'))],
      country: [...new Set(rows.map(item => item.country).filter(val => val && val !== 'N/A'))],
      docsStatus: [...new Set(rows.map(item => item.docsStatus).filter(val => val && val !== 'N/A'))],
      ttCopyStatus: [...new Set(rows.map(item => item.ttCopyStatus).filter(val => val && val !== 'N/A'))],
    };
  }, [rows]);

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
    if (filters.commissionStatus && filters.commissionStatus.length > 0) {
      processedData = processedData.filter(item => 
        filters.commissionStatus.includes(item.commissionStatus)
      );
    }

    if (filters.country && filters.country.length > 0) {
      processedData = processedData.filter(item => 
        filters.country.includes(item.country)
      );
    }

    if (filters.docsStatus && filters.docsStatus.length > 0) {
      processedData = processedData.filter(item => 
        filters.docsStatus.includes(item.docsStatus)
      );
    }

    if (filters.ttCopyStatus && filters.ttCopyStatus.length > 0) {
      processedData = processedData.filter(item => 
        filters.ttCopyStatus.includes(item.ttCopyStatus)
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

  // Filter handlers with persistent storage
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    saveFiltersToStorage(FILTER_STORAGE_KEYS.ADMIN_FOREX, newFilters);
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
    saveFiltersToStorage(FILTER_STORAGE_KEYS.ADMIN_FOREX, newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = DEFAULT_FILTERS.ADMIN_FOREX;
    setFilters(clearedFilters);
    saveFiltersToStorage(FILTER_STORAGE_KEYS.ADMIN_FOREX, clearedFilters);
  };

  const clearSpecificFilter = (filterType) => {
    const newFilters = {
      ...filters,
      [filterType]: Array.isArray(filters[filterType]) ? [] : ''
    };
    setFilters(newFilters);
    saveFiltersToStorage(FILTER_STORAGE_KEYS.ADMIN_FOREX, newFilters);
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

  // Calculate AE Commission summary
  const calculateAeCommissionSummary = () => {
    let dataToCalculate = data;
    
    // Apply date filter if provided
    if (aeCommissionSummary.dateFrom && aeCommissionSummary.dateTo) {
      dataToCalculate = data.filter(item => {
        const itemDate = new Date(item.date);
        const fromDate = new Date(aeCommissionSummary.dateFrom);
        const toDate = new Date(aeCommissionSummary.dateTo);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }
    
    const total = dataToCalculate.reduce((sum, item) => {
      // Clean the value: remove commas and convert to valid number
      const cleanValue = item.aecommission 
        ? String(item.aecommission).replace(/,/g, '').trim() 
        : '0';
      const numValue = parseFloat(cleanValue) || 0;
      return sum + numValue;
    }, 0);
    
    setAeCommissionSummary(prev => ({ ...prev, total }));
  };

  // Calculate summary when data or dates change
  useEffect(() => {
    calculateAeCommissionSummary();
  }, [data, aeCommissionSummary.dateFrom, aeCommissionSummary.dateTo]);

  const handleAeCommissionDateChange = (field, value) => {
    setAeCommissionSummary(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColumnSelection = (field) => {
    setSelectedColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field],
    );
  };

  // Bulk update handlers
  const handleRowSelection = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const handleBulkUpdate = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row to update.');
      return;
    }
    
    if (!bulkUpdateData.commissionStatus) {
      alert('Please select a commission status.');
      return;
    }

    try {
      const updatePromises = selectedRows.map(rowId => 
        axios.put(`https://abroad-backend-gray.vercel.app/auth/updateForexForm/${rowId}`, {
          commissionStatus: bulkUpdateData.commissionStatus,
          commissionPaymentDate: bulkUpdateData.commissionPaymentDate || undefined,
        })
      );

      await Promise.all(updatePromises);
      
      // Refresh data
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
          agentCommission: item.agentCommission || 'N/A',
          aecommission: item.aecommission || 'N/A',
          tds: item.tds || 'N/A',
          netPayable: item.netPayable || 'N/A',
          remarks: item.remarks || 'N/A',
          commissionStatus: item.commissionStatus || 'N/A',
        }));
        
        // Sort by date (latest first)
        forexForms.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setRows(forexForms);
        setData(response.data.forexForms);
      }
      
      // Reset states
      setSelectedRows([]);
      setBulkUpdateData({ commissionStatus: '', commissionPaymentDate: '' });
      setIsBulkUpdateModalOpen(false);
      
      alert(`Successfully updated ${selectedRows.length} records.`);
    } catch (error) {
      console.error('Error updating records:', error);
      alert('Error updating records. Please try again.');
    }
  };

  const handleBulkUpdateChange = (field, value) => {
    setBulkUpdateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const memoizedColumns = useMemo(
    () => allColumns.filter((col) => selectedColumns.includes(col.field)),
    [selectedColumns],
  );
  const memoizedRows = useMemo(() => filteredData.length > 0 ? filteredData : rows, [filteredData, rows]);

  const getRowClassName = (params) => {
    const status = params.row.commissionStatus?.toLowerCase();
    if (status?.includes('non claimable')) {
      return 'row-non-claimable';
    } else if (status?.includes('under processing')) {
      return 'row-under-processing';
    } else if (status?.includes('paid')) {
      return 'row-paid';
    }
    return '';
  };

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
        
        {/* AE Commission Summary - Full Width Card Design */}
        <Box 
          width={'100%'} 
          bg={'white'} 
          border={'1px solid'} 
          borderColor={'gray.200'} 
          borderRadius={'lg'} 
          p={6}
          mb={4}
          position={'relative'}
          boxShadow={'sm'}
        >
          {/* Green accent bar at top */}
          <Box 
            position={'absolute'}
            top={0}
            left={0}
            right={0}
            height={'4px'}
            bg={'green.400'}
            borderTopRadius={'lg'}
          />
          
          <HStack justify={'space-between'} align={'center'}>
            <VStack align={'start'} spacing={1}>
              <Text fontSize="sm" color="gray.500" fontWeight={'medium'}>
                AE Commission
              </Text>
              <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                ₹{aeCommissionSummary.total.toLocaleString('en-IN')}
              </Text>
              <Text fontSize="sm" color="gray.500">
                From forex transactions
              </Text>
            </VStack>
            
            <VStack align={'end'} spacing={3}>
              <HStack spacing={3}>
                <Input 
                  type="date"
                  size="sm"
                  placeholder="From Date"
                  value={aeCommissionSummary.dateFrom}
                  onChange={(e) => handleAeCommissionDateChange('dateFrom', e.target.value)}
                  width={'130px'}
                  borderColor={'gray.300'}
                />
                <Input 
                  type="date"
                  size="sm"
                  placeholder="To Date"
                  value={aeCommissionSummary.dateTo}
                  onChange={(e) => handleAeCommissionDateChange('dateTo', e.target.value)}
                  width={'130px'}
                  borderColor={'gray.300'}
                />
              </HStack>
              
              {/* Dollar icon in green circle */}
              <Box
                bg={'green.100'}
                borderRadius={'full'}
                width={'50px'}
                height={'50px'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Text fontSize={'24px'} color={'green.600'}>
                  $
                </Text>
              </Box>
            </VStack>
          </HStack>
        </Box>
        
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
          <Button
            onClick={() => setIsBulkUpdateModalOpen(true)}
            width={'200px'}
            variant="solid"
            colorScheme="orange"
            borderRadius={'none'}
            mr={4}
            mb={1}
            isDisabled={selectedRows.length === 0}
          >
            Bulk Update ({selectedRows.length})
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
        <DataTable 
          columns={memoizedColumns} 
          rows={memoizedRows} 
          checkboxSelection={true}
          onSelectionChange={handleRowSelection}
          getRowClassName={getRowClassName}
        />
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
              Deselect All
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
            <Tabs index={parseInt(tabValue)} onChange={(index) => setTabValue(index.toString())}>
              <TabList>
                <Tab>Sort by Date</Tab>
                <Tab>Filter by Date</Tab>
                <Tab>Filter by Name</Tab>
                <Tab>Status Filters</Tab>
                <Tab>Location & Docs</Tab>
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
                          onClick={() => clearSpecificFilter('dateSort')}
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
                      <HStack justify="space-between" align="center">
                        <FormLabel>Filter by Specific Date</FormLabel>
                        <Button 
                          size="xs" 
                          variant="ghost" 
                          colorScheme="red"
                          onClick={() => clearSpecificFilter('specificDate')}
                        >
                          Clear
                        </Button>
                      </HStack>
                      <Input
                        type="date"
                        value={filters.specificDate}
                        onChange={(e) => handleFilterChange('specificDate', e.target.value)}
                      />
                    </FormControl>
                    
                    <Divider />
                    
                    <FormControl>
                      <HStack justify="space-between" align="center">
                        <FormLabel>Filter by Date Range</FormLabel>
                        <Button 
                          size="xs" 
                          variant="ghost" 
                          colorScheme="red"
                          onClick={() => {
                            clearSpecificFilter('dateFrom');
                            clearSpecificFilter('dateTo');
                          }}
                        >
                          Clear Range
                        </Button>
                      </HStack>
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
                      <HStack justify="space-between" align="center">
                        <FormLabel>Filter by Agent Name</FormLabel>
                        <Button 
                          size="xs" 
                          variant="ghost" 
                          colorScheme="red"
                          onClick={() => clearSpecificFilter('agentName')}
                        >
                          Clear
                        </Button>
                      </HStack>
                      <Input
                        placeholder="Enter agent name to search..."
                        value={filters.agentName}
                        onChange={(e) => handleFilterChange('agentName', e.target.value)}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <HStack justify="space-between" align="center">
                        <FormLabel>Filter by Student Name</FormLabel>
                        <Button 
                          size="xs" 
                          variant="ghost" 
                          colorScheme="red"
                          onClick={() => clearSpecificFilter('studentName')}
                        >
                          Clear
                        </Button>
                      </HStack>
                      <Input
                        placeholder="Enter student name to search..."
                        value={filters.studentName}
                        onChange={(e) => handleFilterChange('studentName', e.target.value)}
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>

                {/* Status Filters Tab */}
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <FormControl>
                      <FormLabel>Commission Status</FormLabel>
                      <VStack align="start" spacing={2} maxH="200px" overflowY="auto">
                        {uniqueValues.commissionStatus.map((status) => (
                          <Checkbox
                            key={status}
                            isChecked={filters.commissionStatus?.includes(status) || false}
                            onChange={(e) => handleMultiSelectFilter('commissionStatus', status, e.target.checked)}
                          >
                            {status}
                          </Checkbox>
                        ))}
                      </VStack>
                    </FormControl>
                  </VStack>
                </TabPanel>

                {/* Location & Documents Tab */}
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <FormControl>
                      <FormLabel>Country</FormLabel>
                      <VStack align="start" spacing={2} maxH="150px" overflowY="auto">
                        {uniqueValues.country.map((country) => (
                          <Checkbox
                            key={country}
                            isChecked={filters.country?.includes(country) || false}
                            onChange={(e) => handleMultiSelectFilter('country', country, e.target.checked)}
                          >
                            {country}
                          </Checkbox>
                        ))}
                      </VStack>
                    </FormControl>

                    <Divider />

                    <FormControl>
                      <FormLabel>DOCs Status</FormLabel>
                      <VStack align="start" spacing={2} maxH="150px" overflowY="auto">
                        {uniqueValues.docsStatus.map((status) => (
                          <Checkbox
                            key={status}
                            isChecked={filters.docsStatus?.includes(status) || false}
                            onChange={(e) => handleMultiSelectFilter('docsStatus', status, e.target.checked)}
                          >
                            {status}
                          </Checkbox>
                        ))}
                      </VStack>
                    </FormControl>

                    <Divider />

                    <FormControl>
                      <FormLabel>TT Copy Status</FormLabel>
                      <VStack align="start" spacing={2} maxH="150px" overflowY="auto">
                        {uniqueValues.ttCopyStatus.map((status) => (
                          <Checkbox
                            key={status}
                            isChecked={filters.ttCopyStatus?.includes(status) || false}
                            onChange={(e) => handleMultiSelectFilter('ttCopyStatus', status, e.target.checked)}
                          >
                            {status}
                          </Checkbox>
                        ))}
                      </VStack>
                    </FormControl>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          
          <ModalFooter>
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.600">
                Filters persist when switching tabs
              </Text>
              <Button 
                colorScheme="red" 
                variant="outline" 
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={() => setIsFilterModalOpen(false)}
              >
                Apply Filters
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Update Modal */}
      <Modal isOpen={isBulkUpdateModalOpen} onClose={() => setIsBulkUpdateModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bulk Update Commission Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>Selected Records: {selectedRows.length}</Text>
              
              <FormControl isRequired>
                <FormLabel>Commission Status</FormLabel>
                <Select 
                  placeholder="Select status"
                  value={bulkUpdateData.commissionStatus}
                  onChange={(e) => handleBulkUpdateChange('commissionStatus', e.target.value)}
                >
                  <option value="Non Claimable">Non Claimable</option>
                  <option value="Under Processing">Under Processing</option>
                  <option value="Paid">Paid</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Commission Payment Date (Optional)</FormLabel>
                <Input 
                  type="date"
                  value={bulkUpdateData.commissionPaymentDate}
                  onChange={(e) => handleBulkUpdateChange('commissionPaymentDate', e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="gray" 
              mr={3} 
              onClick={() => setIsBulkUpdateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleBulkUpdate}
              isDisabled={!bulkUpdateData.commissionStatus}
            >
              Update Records
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Forex;
