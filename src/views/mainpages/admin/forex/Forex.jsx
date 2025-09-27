import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Divider,
  Text,
  VStack,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Grid,
  GridItem,
  HStack,
  Spinner,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
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
  const [loading, setLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((col) => col.field),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [pagination, setPagination] = useState({
    page: 0, // MUI DataGrid uses 0-based pages
    pageSize: 10,
    total: 0,
    pages: 1
  });
  
  const [sortModel, setSortModel] = useState([
    {
      field: 'date',
      sort: 'desc',
    },
  ]);
  
  const [filterModel, setFilterModel] = useState({
    agentName: '',
    studentName: '',
    country: '',
    commissionStatus: '',
    docsStatus: '',
    ttCopyStatus: '',
    startDate: '',
    endDate: '',
  });

  const fetchData = async (page = 0, pageSize = 10, sortField = 'date', sortOrder = 'desc', filters = {}) => {
    setLoading(true);
    try {
      // Convert MUI's 0-based page to backend's 1-based page
      const backendPage = page + 1;
      
      // Build query parameters
      const params = new URLSearchParams({
        page: backendPage,
        limit: pageSize,
        sortField,
        sortOrder
      });
      
      // Add any filter parameters that have values
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      const response = await axios.get(
        `https://abroad-backend-gray.vercel.app/auth/viewAllForexForms?${params.toString()}`
      );
      
      if (response.data.forexForms) {
        setData(response.data.forexForms);
        
        // Update pagination state
        if (response.data.pagination) {
          setPagination({
            page, // Keep 0-based for MUI
            pageSize,
            total: response.data.pagination.total,
            pages: response.data.pagination.pages
          });
        }
        
        // Map data for the DataGrid
        const forexForms = response.data.forexForms.map((item) => ({
          id: item._id,
          agentRef: item.agentRef?.name?.toUpperCase() || 'N/A',
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
      }
    } catch (error) {
      console.error('Error fetching forex forms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchData(newPage, pagination.pageSize, sortModel[0]?.field, sortModel[0]?.sort, filterModel);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    fetchData(0, newPageSize, sortModel[0]?.field, sortModel[0]?.sort, filterModel);
  };

  // Handle sorting change
  const handleSortModelChange = (newSortModel) => {
    if (newSortModel.length) {
      setSortModel(newSortModel);
    } else {
      // If sort is cleared, reset to default sort
      setSortModel([{ field: 'date', sort: 'desc' }]);
    }
  };

  useEffect(() => {
    fetchData(
      pagination.page, 
      pagination.pageSize, 
      sortModel[0]?.field || 'date', 
      sortModel[0]?.sort || 'desc',
      filterModel
    );
  }, [pagination.page, pagination.pageSize, sortModel]);

  const handleDownloadExcel = async () => {
    setLoading(true);
    try {
      // Fetch all data for export (no pagination)
      const response = await axios.get(
        'https://abroad-backend-gray.vercel.app/auth/viewAllForexForms',
        {
          params: {
            limit: 1000, // Get a large number of records for export
            // Maintain any current filters
            ...Object.fromEntries(
              Object.entries(filterModel).filter(([_, value]) => value)
            )
          }
        }
      );

      if (!response.data.forexForms || response.data.forexForms.length === 0) {
        console.error("No data available for export");
        return;
      }

      const exportData = response.data.forexForms;
      
      const cleanData = exportData.map((item) => {
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
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
    } finally {
      setLoading(false);
    }
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
  const memoizedRows = useMemo(() => rows, [rows]);

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
            onClick={handleDownloadExcel}
            width={'200px'}
            variant="solid"
            colorScheme="green"
            borderRadius={'none'}
            mr={4}
            mb={1}
            isLoading={loading}
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
      
      {/* Filter Section */}
      <Box p={4} bg="white" borderRadius="md" shadow="md" mb={4} mx={7}>
        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
          <GridItem>
            <FormControl>
              <FormLabel fontSize="sm">Agent Name</FormLabel>
              <Input 
                placeholder="Search by agent name" 
                size="sm"
                value={filterModel.agentName || ''}
                onChange={(e) => setFilterModel({...filterModel, agentName: e.target.value})}
              />
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel fontSize="sm">Student Name</FormLabel>
              <Input 
                placeholder="Search by student name" 
                size="sm" 
                value={filterModel.studentName || ''}
                onChange={(e) => setFilterModel({...filterModel, studentName: e.target.value})}
              />
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel fontSize="sm">Country</FormLabel>
              <Input 
                placeholder="Search by country" 
                size="sm" 
                value={filterModel.country || ''}
                onChange={(e) => setFilterModel({...filterModel, country: e.target.value})}
              />
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel fontSize="sm">Commission Status</FormLabel>
              <Select 
                placeholder="All statuses" 
                size="sm"
                value={filterModel.commissionStatus || ''}
                onChange={(e) => setFilterModel({...filterModel, commissionStatus: e.target.value})}
              >
                <option value="Not Received">Not Received</option>
                <option value="Paid">Paid</option>
                <option value="Under Processing">Under Processing</option>
              </Select>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel fontSize="sm">Docs Status</FormLabel>
              <Select 
                placeholder="All statuses" 
                size="sm"
                value={filterModel.docsStatus || ''}
                onChange={(e) => setFilterModel({...filterModel, docsStatus: e.target.value})}
              >
                <option value="Received">Received</option>
                <option value="Not Received">Not Received</option>
                <option value="Pending">Pending</option>
              </Select>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel fontSize="sm">TT Copy Status</FormLabel>
              <Select 
                placeholder="All statuses" 
                size="sm"
                value={filterModel.ttCopyStatus || ''}
                onChange={(e) => setFilterModel({...filterModel, ttCopyStatus: e.target.value})}
              >
                <option value="Received">Received</option>
                <option value="Not Received">Not Received</option>
                <option value="Pending">Pending</option>
              </Select>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel fontSize="sm">Start Date</FormLabel>
              <Input 
                type="date" 
                size="sm"
                value={filterModel.startDate || ''}
                onChange={(e) => setFilterModel({...filterModel, startDate: e.target.value})}
              />
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel fontSize="sm">End Date</FormLabel>
              <Input 
                type="date" 
                size="sm"
                value={filterModel.endDate || ''}
                onChange={(e) => setFilterModel({...filterModel, endDate: e.target.value})}
              />
            </FormControl>
          </GridItem>
          
          <GridItem display="flex" alignItems="flex-end">
            <HStack spacing={2}>
              <Button 
                leftIcon={<SearchIcon />} 
                colorScheme="blue" 
                size="sm"
                onClick={() => fetchData(0, pagination.pageSize, sortModel[0]?.field, sortModel[0]?.sort, filterModel)}
                isLoading={loading}
              >
                Search
              </Button>
              <Button 
                leftIcon={<CloseIcon />} 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const resetFilters = {
                    agentName: '',
                    studentName: '',
                    country: '',
                    commissionStatus: '',
                    docsStatus: '',
                    ttCopyStatus: '',
                    startDate: '',
                    endDate: '',
                  };
                  setFilterModel(resetFilters);
                  fetchData(0, pagination.pageSize, sortModel[0]?.field, sortModel[0]?.sort, resetFilters);
                }}
              >
                Reset
              </Button>
            </HStack>
          </GridItem>
        </Grid>
      </Box>
      
      <Box maxHeight="1200px" overflowY="auto">
        <DataTable 
          columns={memoizedColumns} 
          rows={memoizedRows}
          loading={loading}
          paginationModel={{
            page: pagination.page,
            pageSize: pagination.pageSize,
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          pagination
          paginationMode="server"
          sortingMode="server"
          rowCount={pagination.total}
          onPaginationModelChange={(model) => {
            if (model.page !== pagination.page) {
              handlePageChange(model.page);
            }
            if (model.pageSize !== pagination.pageSize) {
              handlePageSizeChange(model.pageSize);
            }
          }}
          onSortModelChange={handleSortModelChange}
          sortModel={sortModel}
          sx={{ minHeight: 400 }}
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
            <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Forex;
