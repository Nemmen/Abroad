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
} from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';

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
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.map((col) => col.field),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
 const { user } = useSelector((state) => state.Auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://abroad-backend-gray.vercel.app/auth/viewAllForexForms',
        );
        if (response.data.forexForms) {

          const userForexForms = response.data.forexForms.filter(
            (form) => form.agentRef._id === user._id, // Replace with the correct field for user matching
          );


          const forexForms = userForexForms.map((item) => ({
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
          setData(userForexForms);
        }
      } catch (error) {
        console.error('Error fetching forex forms:', error);
      }
    };

    fetchData();
  }, []);

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
        <Text fontSize="34px">FOREX Registrations</Text>
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

export default Forex;
