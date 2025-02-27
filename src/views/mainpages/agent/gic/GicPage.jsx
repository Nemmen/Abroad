import React, { useEffect, useState, useMemo } from 'react';
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
} from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';

// Define the columns
const allColumns = [
  { field: 'Agent', headerName: 'Agent Name', width: 140 },
  { field: 'type', headerName: 'Type', width: 100 },
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
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((col) => col.field),
  );
  const { user } = useSelector((state) => state.Auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://abroad-backend-gray.vercel.app/auth/viewAllGicForm',
        );
        if (response.data.success) {
          const userGicForms = response.data.gicForms.filter(
            (form) => form.agentRef._id === user._id, // Replace with the correct field for user matching
          );
          setData(userGicForms);
          const gicForms = userGicForms.map((form, index) => ({
            id: form._id || index,
            type: form.type || 'N/A',
            Agent: form.agentRef.name.toUpperCase() || 'N/A',
            accOpeningMonth: form.accOpeningMonth || 'N/A',
            studentName: form.studentRef.name || 'N/A',
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
      }
    };

    fetchData();
  }, []);

  const handleDownloadExcel = () => {
    // Clean and prepare data
    const cleanData = data.map((item) => {
      // Retain only relevant fields and rename keys to match column names
      const cleanedItem = {
        type: item.type || 'N/A',
        Agent: item.agentRef?.name?.toUpperCase() || 'N/A',
        accOpeningMonth: item.accOpeningMonth || 'N/A',
        studentName: item.studentRef.name || 'N/A',
        passportNo: item.studentPassportNo || 'N/A', // Correct key for Passport No
        studentPhoneNo: item.studentPhoneNo || 'N/A',
        bankVendor: item.bankVendor || 'N/A',
        accFundingMonth: item.fundingMonth || 'N/A',
        commissionAmt: item.commissionAmt || 0,
        tds: item.tds || '0',
        netPayable: item.netPayable || 0,
        commissionStatus: item.commissionStatus || 'N/A',
      };
      return cleanedItem;
    });

    // Filter columns based on selection
    const filteredData = cleanData.map((item) =>
      selectedColumns.reduce((acc, field) => {
        acc[field] = item[field] || 'N/A'; // Ensure fallback for missing fields
        return acc;
      }, {}),
    );

    // Generate Excel file
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gic Data');
    XLSX.writeFile(workbook, 'GicData.xlsx');
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
      >
        <div className='mb-6 lg:mb-0'>
          <Text fontSize="34px">GIC </Text>
        </div>
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
          >
            Download Excel
          </Button>
          <Link to={'/agent/gic/form'}>
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
            <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Gic;
