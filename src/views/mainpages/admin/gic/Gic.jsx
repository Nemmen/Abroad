import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Divider,
  Text,
  Checkbox,
  VStack,
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
} from '@chakra-ui/react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((col) => col.field),
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  const memoizedRows = useMemo(() => rows, [rows]);

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
            <Button colorScheme="blue" onClick={onClose}>
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Gic;