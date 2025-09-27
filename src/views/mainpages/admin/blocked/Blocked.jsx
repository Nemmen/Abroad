import React, { useEffect, useState, useMemo } from 'react';
import { 
  Box, 
  Button, 
  Divider, 
  Text, 
  FormControl, 
  FormLabel, 
  Input, 
  Select, 
  HStack, 
  VStack, 
  Grid, 
  GridItem,
  IconButton
} from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

// Define the columns
const columns = [
  { field: 'Agent', headerName: 'Agent', width: 140 },
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

const Blocked = () => {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0, // MUI DataGrid uses 0-based pages
    pageSize: 10,
    total: 0,
    pages: 1
  });
  const [sortModel, setSortModel] = useState([
    {
      field: 'studentName',
      sort: 'asc',
    },
  ]);
  const [filterModel, setFilterModel] = useState({
    agent: '',
    studentName: '',
    passportNo: '',
    commissionStatus: '',
    bankVendor: ''
  });

  const fetchData = async (page = 0, pageSize = 10, sortField = 'studentName', sortOrder = 'asc', filters = {}) => {
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
        `https://abroad-backend-gray.vercel.app/auth/getAllBlockedData?${params.toString()}`
      );
      
      if (response.data.gicForms) {
        setData(response.data.gicForms);
        
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
        const gicForms = response.data.gicForms.map((form, index) => ({
          id: form._id || index, // Ensure each row has a unique id
          Agent: form.agentRef?.agentCode || 'N/A',
          accOpeningMonth: form.accOpeningMonth || 'N/A',
          studentName: form.studentName || 'N/A',
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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(
      pagination.page, 
      pagination.pageSize, 
      sortModel[0]?.field || 'studentName', 
      sortModel[0]?.sort || 'asc',
      filterModel
    );
  }, [pagination.page, pagination.pageSize, sortModel, filterModel]);

  const handleDownloadExcel = async () => {
    setLoading(true);
    try {
      // Fetch all data for export (no pagination)
      const response = await axios.get(
        'https://abroad-backend-gray.vercel.app/auth/getAllBlockedData',
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

      if (!response.data.gicForms || response.data.gicForms.length === 0) {
        console.error("No data available for export");
        return;
      }

      const exportData = response.data.gicForms;

      const cleanData = exportData.map((item) => {
        // Remove _id, __v, id, and agentRef fields from root level
        const { _id, __v, id, agentRef, ...cleanedItem } = item;
    
        // Add agent code from the nested agentRef object
        if (agentRef && agentRef.agentCode) {
          cleanedItem.agentCode = agentRef.agentCode;
        }
    
        // Format date if present
        if (cleanedItem.date) {
          cleanedItem.date = new Date(cleanedItem.date).toLocaleDateString();
        }
    
        // Flatten studentDocuments into a single string
        if (cleanedItem.studentDocuments) {
          cleanedItem.studentDocuments = Object.entries(cleanedItem.studentDocuments)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        }
    
        return cleanedItem;
      });
    
      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(cleanData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Gic Data');
    
      // Export workbook as Excel file
      XLSX.writeFile(workbook, 'GicData.xlsx');
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
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
      setSortModel([{ field: 'studentName', sort: 'asc' }]);
    }
  };

  // Memoize columns and rows to prevent re-renders
  const memoizedColumns = useMemo(() => columns, []);
  const memoizedRows = useMemo(() => rows, [rows]);

  return (
    <Box width={'full'}>
      <Box
        display={'flex'}
        padding={7}
        paddingBottom={3}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <div>
          <Text fontSize="34px">GIC Registrations</Text>
        </div>

        <div>
          <Button
            onClick={handleDownloadExcel}
            width={'200px'}
            variant="solid"
            colorScheme="green"
            borderRadius={'none'}
            _hover={{
              bg: 'green.500',
              color: 'white',
              borderColor: 'green.500',
            }}
            mr={4}
            mb={1}
            isLoading={loading}
          >
            Download Excel
          </Button>

          <Link to={'/admin/gic/form'}>
            <Button
              width={'200px'}
              variant="outline"
              colorScheme="blue"
              borderRadius={'none'}
              _hover={{
                bg: 'blue.500',
                color: 'white',
                borderColor: 'blue.500',
              }}
              mb={1}
            >
              Add New
            </Button>
          </Link>
        </div>
      </Box>
      
      {/* Filter Section */}
      <Box p={4} bg="white" borderRadius="md" shadow="md" mb={4} mx={7}>
        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
          <GridItem>
            <FormControl>
              <FormLabel fontSize="sm">Agent</FormLabel>
              <Input 
                placeholder="Search by agent code" 
                size="sm"
                value={filterModel.agent || ''}
                onChange={(e) => setFilterModel({...filterModel, agent: e.target.value})}
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
              <FormLabel fontSize="sm">Passport No</FormLabel>
              <Input 
                placeholder="Search by passport number" 
                size="sm" 
                value={filterModel.passportNo || ''}
                onChange={(e) => setFilterModel({...filterModel, passportNo: e.target.value})}
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
              <FormLabel fontSize="sm">Bank Vendor</FormLabel>
              <Select 
                placeholder="All banks" 
                size="sm"
                value={filterModel.bankVendor || ''}
                onChange={(e) => setFilterModel({...filterModel, bankVendor: e.target.value})}
              >
                <option value="ICICI">ICICI</option>
                <option value="RBC">RBC</option>
                <option value="CIBC">CIBC</option>
                <option value="BOM">BOM</option>
                <option value="TD">TD</option>
                <option value="Fintiba">Fintiba</option>
                <option value="Expatrio">Expatrio</option>
              </Select>
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
                    agent: '',
                    studentName: '',
                    passportNo: '',
                    commissionStatus: '',
                    bankVendor: ''
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
      
      <Divider width={'96%'} mx={'auto'} mb={'20px'} bgColor={'black'} height={'0.5px'} />
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
    </Box>
  );
};

export default Blocked;
