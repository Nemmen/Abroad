import React, { useEffect } from 'react';
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Spinner,
  Center,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import AddUserModal from './AddUserModel';

const columnHelper = createColumnHelper();

export default function UserDataTable(props) {
  const { tableData, onRowClick } = props;
  const [sorting, setSorting] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // Add loading state
  const [loadingButtonId, setLoadingButtonId] = React.useState(null); // Add this state
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    if (tableData.length > 0) {
      const filteredData = tableData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .filter((user) => user.isDeleted !== true);
      setData([...filteredData]);
      setLoading(false); // Set loading to false when data is ready
    }
  }, [tableData]);

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="black" fontWeight="500">
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
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="black" fontWeight="500">
          EMAIL
        </Text>
      ),
      cell: (info) => (
        <Text color="gray.500" fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('userStatus', {
      id: 'userStatus',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="black" fontWeight="500">
          STATUS
        </Text>
      ),
      cell: (info) => (
        <Text color="gray.500" fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('organization', {
      id: 'organization',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="black" fontWeight="500">
          ORGANIZATION
        </Text>
      ),
      cell: (info) => (
        <Text color="gray.500" fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('phoneNumber', {
      id: 'phoneNumber',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="black" fontWeight="500">
          PHONE NUMBER
        </Text>
      ),
      cell: (info) => (
        <Text color="gray.500" fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('state', {
      id: 'state',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="black" fontWeight="500">
          STATE
        </Text>
      ),
      cell: (info) => (
        <Text color="gray.500" fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="black" fontWeight="500">
          CREATED ON
        </Text>
      ),
      cell: (info) => (
        <Text color="gray.500" fontSize="sm" fontWeight="500">
          {new Date(info.getValue()).toLocaleDateString()}
        </Text>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '13px' }} color="black" fontWeight="500">
          ACTIONS
        </Text>
      ),
      cell: (info) => {
        const userStatus = info.row.original.userStatus;
        const userId = info.row.original._id;
        return (
          <Box display="flex" gap="10px">
            {userStatus === 'active' && (
              <Button
                fontSize="15px"
                paddingRight="32px"
                paddingLeft="32px"
                colorScheme="red"
                borderRadius="50px"
                onClick={() => handleStatusChange(userId, 'active')}
                disabled={loadingButtonId === userId}
              >
                {loadingButtonId === userId ? <Spinner color="white" /> : 'Block'}
              </Button>
            )}
            {userStatus === 'block' && (
              <Button
                fontSize="15px"
                paddingRight="24px"
                paddingLeft="24px"
                borderRadius="50px"
                colorScheme="blue"
                onClick={() => handleStatusChange(userId, 'block')}
                disabled={loadingButtonId === userId}
              >
                {loadingButtonId === userId ? <Spinner color="white" /> : 'Unblock'}
              </Button>
            )}
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              aria-label="Delete"
              onClick={() => handleStatusChange(userId, 'isdeleted')}
              variant="outline"
            />
          </Box>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (row) => {
    if (onRowClick) onRowClick(row.original);
  };

  const handleStatusChange = async (userId, currentStatus) => {
    setLoadingButtonId(userId);
    try {
      if (currentStatus === 'isdeleted') {
        const url = `https://abroad-backend-ten.vercel.app/admin/delete/${userId}`;
        await axios.put(url, {}, { withCredentials: true });
        const updatedData = data.filter((user) => user._id !== userId);
        setData(updatedData);
        return;
      }
      const newStatus = currentStatus === 'active' ? 'block' : 'active';
      const url =
        currentStatus === 'active'
          ? `https://abroad-backend-ten.vercel.app/admin/block/${userId}`
          : `https://abroad-backend-ten.vercel.app/admin/unblock/${userId}`;
      await axios.put(url, {}, { withCredentials: true });
      const updatedData = data.map((user) =>
        user._id === userId ? { ...user, userStatus: newStatus } : user
      );
      setData(updatedData);
    } catch (error) {
      console.error('Error handling user status change:', error);
    } finally {
      setLoadingButtonId(null);
    }
  };

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
          User Registrations
        </Text>
        <AddUserModal />
      </Flex>
      {loading ? (
        <Center h="300px">
          <Spinner size="lg" color="blue.500" />
          <Text ml="10px" color={textColor} fontWeight="600">
            Loading agents...
          </Text>
        </Center>
      ) : (
        <Box height="300px" overflowY="auto">
          <Table variant="simple" color="gray.500" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{ asc: '', desc: '' }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.original._id} onClick={() => handleRowClick(row)} cursor="pointer">
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} fontSize={{ sm: '14px' }} borderColor={borderColor}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Flex>
  );
}
