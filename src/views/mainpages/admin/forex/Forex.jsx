import React from 'react';
import { Box, Button, Card, Divider, Text } from '@chakra-ui/react';
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

const rows = [
  {
    id: 1,
    sNo: 1,
    date: '2024-11-01',
    studentName: 'John Doe',
    country: 'USA',
    currencyBooked: 'USD',
    quotation: '5000',
    studentPaid: '4500',
    docsStatus: 'Submitted',
    ttCopyStatus: 'Received',
    agentCommission: '500',
    tds: '50',
    netPayable: '450',
    commissionStatus: 'Paid',
  },
  {
    id: 2,
    sNo: 2,
    date: '2024-11-02',
    studentName: 'Jane Smith',
    country: 'Canada',
    currencyBooked: 'CAD',
    quotation: '7000',
    studentPaid: '6500',
    docsStatus: 'Pending',
    ttCopyStatus: 'Not Received',
    agentCommission: '600',
    tds: '60',
    netPayable: '540',
    commissionStatus: 'Pending',
  },
  // Additional rows as needed
];

const Forex = () => {
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
