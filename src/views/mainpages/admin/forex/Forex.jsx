import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Divider, Text } from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';

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

const Forex = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://localhost:4000/auth/viewAllForexForms')
      .then((response) => {
        // Map the response data to the format expected by the DataTable
        const fetchedData = response.data.forexForms.map((item, index) => ({
          id: item._id,
          sNo: item.sNo,
          date: new Date(item.date).toLocaleDateString(), // Format date as needed
          studentName: item.studentName,
          country: item.country,
          currencyBooked: item.currencyBooked,
          quotation: item.quotation,
          studentPaid: item.studentPaid,
          docsStatus: item.docsStatus,
          ttCopyStatus: item.ttCopyStatus,
          agentCommission: item.agentCommission,
          tds: item.tds,
          netPayable: item.netPayable,
          commissionStatus: item.commissionStatus,
        }));
        setRows(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching forex forms:", error);
      });
  }, []);

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
          <Text
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight=""
            fontSize="34px"
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
          >
            FOREX Registrations
          </Text>
        </div>

        <div>
          <Link to={'/admin/forex/form'}>
            <Button
              width={'200px'}
              variant="outline"
              colorScheme="blue"
              borderRadius={'none'}
              _hover={{
                bg: 'blue.500', // Fill color on hover
                color: 'white', // Text color on hover
                borderColor: 'blue.500', // Border color remains consistent
              }}
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

export default Forex;
