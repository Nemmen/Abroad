import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Text } from '@chakra-ui/react';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Define the columns
const columns = [
  { field: 'sNo', headerName: 'SNo', width: 70 },
  { field: 'accOpeningMonth', headerName: 'Acc Opening Month', width: 150 },
  { field: 'studentName', headerName: 'Student Name', width: 150 },
  { field: 'passportNo', headerName: 'Passport No.', width: 130 },
  { field: 'studentPhoneNo', headerName:  'Student Contact', width: 130 },
  { field: 'bankVendor', headerName: 'Bank Vendor', width: 150 },
  { field: 'accOpeningMonth', headerName: 'Acc Opening Month', width: 160 },
  { field: 'accFundingMonth', headerName: 'Acc Funding Month', width: 160 },
  {
    field: 'commissionAmt',
    headerName: 'Commission Amt',
    width: 140,
    // valueFormatter: ({ value }) => `$${value}`,
  },
  {
    field: 'tds',
    headerName: 'TDS',
    width: 100,
    // valueFormatter: ({ value }) => `$${value}`,
  },
  {
    field: 'netPayable',
    headerName: 'Net Payable',
    width: 140,
    // valueFormatter: ({ value }) => `$${value}`,
  },
  { field: 'commissionStatus', headerName: 'Commission Status', width: 160 },
];

const Gic = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/auth/viewAllGicForm');
        if (response.data.success) {
          const gicForms = response.data.gicForms.map((form, index) => ({
            id: form._id,
            sNo: index + 1,
            accOpeningMonth: form.accOpeningMonth || 'N/A',
            studentName: form.studentName || 'N/A',
            passportNo: form.studentPassportNo || 'N/A',
            studentPhoneNo: form.studentPhoneNo || 'N/A',
            bankVendor: form.bankVendor || 'N/A',
            accOpeningMonth: form.accOpeningMonth || 'N/A',
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
      }
    };

    fetchData();
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
            bg="inherit"
            borderRadius="inherit"
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

export default Gic;
