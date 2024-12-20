import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Divider, Text } from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';

const columns = [
  { field: 'sNo', headerName: 'SNo', width: 80 },
  { field: 'date', headerName: 'Date', width: 150 },
  { field: 'studentName', headerName: 'Student Name', width: 200 },
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

const AgentForex = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:4000/auth/viewAllForexForms')
      .then((response) => {
        const fetchedData = response.data.forexForms.map((item, index) => ({
          ...item,
          id: item._id,
         
        }));
        setRows(fetchedData);
      })
      .catch((error) => {
        console.error('Error fetching forex forms:', error);
      });
  }, []);

  const handleDownloadExcel = () => {
    const cleanData = rows.map((item) => {
      // Destructure to remove _id, __v, and id from root level
      console.log('item:', item);
      const { _id, __v, id,agentRef, ...cleanedItem } = item;
      console.log('cleanedItem:', cleanedItem);
  
      // Format the date field if it exists
      if (cleanedItem.date && cleanedItem.date) {
        cleanedItem.date = new Date(cleanedItem.date).toLocaleDateString();
      }
  
      // Format documents if present
      if (cleanedItem.documents) {
        cleanedItem.documents = cleanedItem.documents.map((doc) => {
          const { _id, ...docWithoutId } = doc; // Remove _id from nested documents
          return docWithoutId;
        });
      }
  
      return cleanedItem;
    });
  
    // Flatten nested documents array for export
    const flattenedData = cleanData.map((item) => ({
      ...item,
      documents: item.documents
        ? item.documents.map((doc) => `${doc.documentOf}: ${doc.documentType} (${doc.documentFile})`).join(', ')
        : '',
    }));
  
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Forex Data');
    
    // Export workbook as Excel file
    XLSX.writeFile(workbook, 'ForexData.xlsx');
  };
  

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
          >
            Download Excel
          </Button>

          <Link to={'/agent/forex/form'}>
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
      <Divider
        orientation="vertical"
        width={'96%'}
        mx={'auto'}
        mb={'20px'}
        bgColor={'black'}
        height={'0.5px'}
      />
      <DataTable columns={columns} rows={rows} />
    </Box>
  );
};

export default AgentForex;
