import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';

const columnHelper = createColumnHelper();

export default function TopUserTable() {
  const [users, setUsers] = useState([]);
  const [sorting, setSorting] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from backend
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('https://abroad-backend-ten.vercel.app/admin/getuser', {
          withCredentials: true,
        });
        const users = response.data.users.filter((user) => user.userStatus === 'pending');
        setUsers(users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchPendingUsers();
  }, []);

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="white" fontWeight="500">
          NAME
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="600">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="white" fontWeight="500">
          EMAIL
        </Text>
      ),
      cell: (info) => (
        <Text color="gray.500" fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('_id', {
      id: 'view',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="white" fontWeight="500">
          ACTION
        </Text>
      ),
      cell: (info) => (
        <Button
        fontSize="15px"
        paddingRight="32px"
        paddingLeft="32px"
        borderRadius="50px"
          colorScheme="blue"
          onClick={() => navigate(`/admin/agent/userdetail/${info.getValue()}`)}
        >
          View
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Flex direction="column" w="100%" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="15px"
        pb="5px"
        mb="10px"
        boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
      >
        <Text color={textColor} fontSize="2xl" fontWeight="600">
          Recent Signups
        </Text>
      </Flex>
      <Box height="300px" overflowY="auto">
        {users.length > 0 ? (
          <Table variant="simple" color="gray.500" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                     className='bg-gray-800'
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: '', desc: '' }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor="transparent"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text fontSize="md" color={textColorSecondary} textAlign="center" mt="20px">
            No pending users
          </Text>
        )}
      </Box>
    </Flex>
  );
}
