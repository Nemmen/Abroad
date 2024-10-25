import React from 'react';
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
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export default function UserDataTable(props) {
  const { tableData, onRowClick } = props; // Props passed to component
  const [sorting, setSorting] = React.useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  let defaultData = tableData;

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
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
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          EMAIL
        </Text>
      ),
      cell: (info) => (
        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('city', {
      id: 'city',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          CITY
        </Text>
      ),
      cell: (info) => (
        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('serviceRegisteredOn', {
      id: 'serviceRegisteredOn',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          SERVICE REGISTERED ON
        </Text>
      ),
      cell: (info) => (
        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
          {info.getValue()}
        </Text>
      ),
    }),
  ];

  const [data, setData] = React.useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const handleRowClick = (row) => {
    if (onRowClick) onRowClick(row.original); // Call onRowClick prop
  };

  return (
    <Flex direction="column" w="100%" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        pb="20px"
        mb="10px"
        boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
      >
        <Text color={textColor} fontSize="xl" fontWeight="600">
          User Registrations
        </Text>
      </Flex>
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
            {table.getRowModel().rows.slice(0, 11).map((row) => (
              <Tr
                key={row.id}
                onClick={() => handleRowClick(row)} // Call handleRowClick on row click
                _hover={{ bg: 'gray.100', cursor: 'pointer' }}
              >
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
      </Box>
    </Flex>
  );
}
