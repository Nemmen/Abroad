import React from 'react';
import { Box, Button, Card, Divider, Text } from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';

// Define the columns
const columns = [
  { field: 'sNo', headerName: 'SNo', width: 70 },
  { field: 'accOpeningDate', headerName: 'Acc Opening Date', width: 150 },
  { field: 'studentName', headerName: 'Student Name', width: 150 },
  { field: 'passportNo', headerName: 'Passport No.', width: 130 },
  { field: 'bankVendor', headerName: 'Bank Vendor', width: 150 },
  { field: 'accOpeningMonth', headerName: 'Acc Opening Month', width: 160 },
  { field: 'accFundingMonth', headerName: 'Acc Funding Month', width: 160 },
  {
    field: 'commissionAmt',
    headerName: 'Commission Amt',
    width: 140,
    valueFormatter: ({ value }) => `$${value}`,
  },
  {
    field: 'tds',
    headerName: 'TDS',
    width: 100,
    valueFormatter: ({ value }) => `$${value}`,
  },
  {
    field: 'netPayable',
    headerName: 'Net Payable',
    width: 140,
    valueFormatter: ({ value }) => `$${value}`,
  },
  { field: 'commissionStatus', headerName: 'Commission Status', width: 160 },
];

// Example rows data
const rows = [
  {
    id: 1,
    sNo: 1,
    accOpeningDate: '2024-01-15',
    studentName: 'Alice Johnson',
    passportNo: 'A1234567',
    bankVendor: 'Bank of America',
    accOpeningMonth: 'January',
    accFundingMonth: 'February',
    commissionAmt: 500,
    tds: 50,
    netPayable: 450,
    commissionStatus: 'Paid',
  },
  {
    id: 2,
    sNo: 2,
    accOpeningDate: '2024-02-20',
    studentName: 'Bob Smith',
    passportNo: 'B7654321',
    bankVendor: 'Chase Bank',
    accOpeningMonth: 'February',
    accFundingMonth: 'March',
    commissionAmt: 700,
    tds: 70,
    netPayable: 630,
    commissionStatus: 'Pending',
  },
  {
    id: 3,
    sNo: 3,
    accOpeningDate: '2024-03-05',
    studentName: 'Carol White',
    passportNo: 'C8765432',
    bankVendor: 'Wells Fargo',
    accOpeningMonth: 'March',
    accFundingMonth: 'April',
    commissionAmt: 600,
    tds: 60,
    netPayable: 540,
    commissionStatus: 'Paid',
  },
  // Add more rows as needed
];

export { columns, rows };

const GicPage = () => {
  return (
    <Box width={'full'}>
      <Box
        display={'flex'}
        padding={7}
        paddingBottom={3}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <div className='pt-32'>
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
            GIC Registrations
          </Text>
        </div>

        <div>
          <Link to={'/agent/gic/modal'}>
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

export default GicPage;
