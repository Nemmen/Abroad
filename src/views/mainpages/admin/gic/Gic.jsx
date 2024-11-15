import React, { useEffect, useState, useMemo } from 'react';
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
  { field: 'studentPhoneNo', headerName: 'Student Contact', width: 130 },
  { field: 'bankVendor', headerName: 'Bank Vendor', width: 150 },
  { field: 'accFundingMonth', headerName: 'Acc Funding Month', width: 160 },
  {
    field: 'commissionAmt',
    headerName: 'Commission Amt',
    width: 140,
  },
  {
    field: 'tds',
    headerName: 'TDS',
    width: 100,
  },
  {
    field: 'netPayable',
    headerName: 'Net Payable',
    width: 140,
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
            id: form._id || index,  // Ensure each row has a unique id
            sNo: index + 1,
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
      }
    };

    fetchData();
  }, []);

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
      <Divider width={'96%'} mx={'auto'} mb={'20px'} bgColor={'black'} height={'0.5px'} />
      <Box maxHeight="1200px" overflowY="auto">
        <DataTable columns={memoizedColumns} rows={memoizedRows} />
      </Box>
    </Box>
  );
};

export default Gic;
