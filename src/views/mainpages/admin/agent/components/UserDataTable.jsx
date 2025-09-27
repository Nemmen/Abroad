import React, { useState, useEffect } from 'react';
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
  Badge,
  IconButton,
  HStack,
  Tooltip,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Stack,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table';
import axios from 'axios';
import { 
  DeleteIcon, 
  EditIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon 
} from '@chakra-ui/icons';
import { FaSort, FaSortUp, FaSortDown, FaEllipsisV } from 'react-icons/fa';
import AddUserModal from './AddUserModel';
import EditUserModal from './EditUserModal';

const columnHelper = createColumnHelper();

export default function UserDataTable(props) {
  const { 
    tableData, 
    onRowClick, 
    searchValue, 
    setSearchValue, 
    isLoading: parentLoading,
    pagination,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    onSearchChange,
    serverSide = false
  } = props;
  
  const [sorting, setSorting] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(parentLoading);
  const [loadingButtonId, setLoadingButtonId] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Toast notifications
  const toast = useToast();
  
  // Theme colors
  const textColor = useColorModeValue('gray.700', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.800');
  
  // Responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  useEffect(() => {
    if (tableData.length > 0) {
      const filteredData = tableData
        .filter((user) => user.isDeleted !== true);
      
      if (!serverSide) {
        // For client-side sorting
        filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      setData([...filteredData]);
      
      // If server-side pagination, update the total record count
      if (serverSide && pagination) {
        setTotalRecords(pagination.total);
        setPageSize(pagination.limit);
        setPageIndex(pagination.page - 1); // Convert 1-based to 0-based
      }
    }
    setLoading(parentLoading);
  }, [tableData, parentLoading, serverSide, pagination]);

  useEffect(() => {
    if (!serverSide && searchValue !== undefined && tableData.length > 0) {
      // For client-side search
      const searchLower = searchValue.toLowerCase();
      const filteredData = tableData
        .filter(user => user.isDeleted !== true)
        .filter(user => 
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.agentCode?.toLowerCase().includes(searchLower) ||
          user.organization?.toLowerCase().includes(searchLower) ||
          user.city?.toLowerCase().includes(searchLower) ||
          user.state?.toLowerCase().includes(searchLower)
        );
      setData([...filteredData]);
      setPageIndex(0); // Reset to first page when searching
    } else if (serverSide && searchValue !== undefined) {
      // For server-side search
      if (onSearchChange) {
        onSearchChange(searchValue);
      }
    }
  }, [searchValue, tableData, serverSide, onSearchChange]);

  const getStatusBadge = (status) => {
    let colorScheme;
    let label = status;
    
    switch(status) {
      case 'active':
        colorScheme = 'green';
        break;
      case 'pending':
        colorScheme = 'yellow';
        break;
      case 'block':
        colorScheme = 'red';
        label = 'Blocked';
        break;
      default:
        colorScheme = 'gray';
    }
    
    return (
      <Badge 
        colorScheme={colorScheme} 
        borderRadius="full" 
        px={2} 
        py={0.5}
        textTransform="capitalize"
      >
        {label}
      </Badge>
    );
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => <Text fontWeight="600">NAME</Text>,
      cell: (info) => (
        <Box>
          <Text fontWeight="500" color={textColor}>
            {info.getValue() || 'N/A'}
          </Text>
          <Text fontSize="xs" color={textColorSecondary}>
            {info.row.original.agentCode || 'No Code'}
          </Text>
        </Box>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: () => <Text fontWeight="600">CONTACT</Text>,
      cell: (info) => (
        <Box>
          <Text color={textColorSecondary}>
            {info.getValue() || 'N/A'}
          </Text>
          <Text fontSize="xs" color={textColorSecondary}>
            {info.row.original.phoneNumber || 'No Phone'}
          </Text>
        </Box>
      ),
    }),
    columnHelper.accessor('organization', {
      id: 'organization',
      header: () => <Text fontWeight="600">ORGANIZATION</Text>,
      cell: (info) => (
        <Text color={textColorSecondary}>
          {info.getValue() || 'N/A'}
        </Text>
      ),
    }),
    columnHelper.accessor(row => (row.city && row.state) ? `${row.city}, ${row.state}` : (row.city || row.state || 'N/A'), {
      id: 'location',
      header: () => <Text fontWeight="600">LOCATION</Text>,
      cell: (info) => (
        <Text color={textColorSecondary}>
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('userStatus', {
      id: 'userStatus',
      header: () => <Text fontWeight="600">STATUS</Text>,
      cell: (info) => getStatusBadge(info.getValue()),
    }),
    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      header: () => <Text fontWeight="600">REGISTERED</Text>,
      cell: (info) => (
        <Text color={textColorSecondary}>
          {formatDate(info.getValue())}
        </Text>
      ),
      enableSorting: true,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <Text fontWeight="600">ACTIONS</Text>,
      cell: (info) => {
        const userStatus = info.row.original.userStatus;
        const userId = info.row.original._id;
        
        // For mobile view, use a menu
        if (isMobile) {
          return (
            <Menu>
              <MenuButton 
                as={IconButton}
                icon={<FaEllipsisV />}
                variant="ghost"
                aria-label="Actions"
                size="sm"
              />
              <MenuList>
                {userStatus === 'active' && (
                  <MenuItem 
                    icon={<DeleteIcon />} 
                    color="red.500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(userId, 'active');
                    }}
                  >
                    Block Agent
                  </MenuItem>
                )}
                {userStatus === 'block' && (
                  <MenuItem 
                    icon={<EditIcon />} 
                    color="blue.500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(userId, 'block');
                    }}
                  >
                    Unblock Agent
                  </MenuItem>
                )}
                <MenuItem 
                  icon={<DeleteIcon />} 
                  color="red.500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(userId, 'isdeleted');
                  }}
                >
                  Delete Agent
                </MenuItem>
                <EditUserModal userId={userId} triggerAsMenuItem />
              </MenuList>
            </Menu>
          );
        }
        
        // For desktop view, show action buttons
        return (
          <HStack spacing={2} onClick={(e) => e.stopPropagation()}>
            {userStatus === 'active' && (
              <Tooltip hasArrow label="Block this agent">
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  leftIcon={loadingButtonId === userId ? undefined : <DeleteIcon />}
                  onClick={() => handleStatusChange(userId, 'active')}
                  isDisabled={loadingButtonId === userId}
                >
                  {loadingButtonId === userId ? <Spinner size="sm" /> : 'Block'}
                </Button>
              </Tooltip>
            )}
            
            {userStatus === 'block' && (
              <Tooltip hasArrow label="Unblock this agent">
                <Button
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                  onClick={() => handleStatusChange(userId, 'block')}
                  isDisabled={loadingButtonId === userId}
                >
                  {loadingButtonId === userId ? <Spinner size="sm" /> : 'Unblock'}
                </Button>
              </Tooltip>
            )}
            
            <Tooltip hasArrow label="Delete this agent">
              <IconButton
                icon={loadingButtonId === `${userId}-delete` ? <Spinner size="sm" /> : <DeleteIcon />}
                colorScheme="red"
                aria-label="Delete"
                onClick={() => handleStatusChange(userId, 'isdeleted')}
                size="sm"
                isDisabled={loadingButtonId === userId || loadingButtonId === `${userId}-delete`}
              />
            </Tooltip>
            
            <EditUserModal userId={userId} />
          </HStack>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { 
      sorting,
      pagination: { pageIndex, pageSize }
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const { pageIndex: newPageIndex } = updater({ pageIndex, pageSize });
        setPageIndex(newPageIndex);
      } else {
        setPageIndex(updater.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleRowClick = (row) => {
    if (onRowClick) onRowClick(row.original);
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const actionId = currentStatus === 'isdeleted' ? `${userId}-delete` : userId;
    setLoadingButtonId(actionId);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token_auth');
      
      // Set up headers with the token
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      if (currentStatus === 'isdeleted') {
        const url = `https://abroad-backend-gray.vercel.app/admin/delete/${userId}`;
        await axios.put(url, {}, { headers });
        const updatedData = data.filter((user) => user._id !== userId);
        setData(updatedData);
        
        toast({
          title: "Agent Deleted",
          description: "The agent has been successfully deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const newStatus = currentStatus === 'active' ? 'block' : 'active';
      const url = currentStatus === 'active'
        ? `https://abroad-backend-gray.vercel.app/admin/block/${userId}`
        : `https://abroad-backend-gray.vercel.app/admin/unblock/${userId}`;
        
      await axios.put(url, {}, { headers });
      
      const updatedData = data.map((user) =>
        user._id === userId ? { ...user, userStatus: newStatus } : user
      );
      setData(updatedData);
      
      toast({
        title: currentStatus === 'active' ? "Agent Blocked" : "Agent Unblocked",
        description: `The agent has been successfully ${currentStatus === 'active' ? 'blocked' : 'unblocked'}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error handling user status change:', error);
      toast({
        title: "Action Failed",
        description: error.response?.data?.message || "Failed to complete the action. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingButtonId(null);
    }
  };

  // Calculate pagination details
  const pageCount = Math.ceil(data.length / pageSize);
  const currentPageStart = serverSide ? (pagination?.page - 1) * pagination?.limit + 1 : pageIndex * pageSize + 1;
  const currentPageEnd = serverSide 
    ? Math.min(pagination?.page * pagination?.limit, pagination?.total) 
    : Math.min((pageIndex + 1) * pageSize, data.length);
    
  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    if (serverSide && onPageSizeChange) {
      onPageSizeChange(parseInt(newPageSize));
    } else {
      setPageSize(parseInt(newPageSize));
    }
  };

  return (
    <Box w="100%">
      <Flex 
        align="center" 
        justify="space-between" 
        w="100%" 
        px={4} 
        py={3} 
        bg={headerBg}
      >
        <Text color={textColor} fontWeight="600">
          Agents Directory
        </Text>
        <AddUserModal />
      </Flex>
      
      {loading ? (
        <Center h="300px">
          <Stack spacing={3} align="center">
            <Spinner size="xl" color="blue.500" thickness="3px" />
            <Text color={textColor}>Loading agents...</Text>
          </Stack>
        </Center>
      ) : data.length === 0 ? (
        <Center h="200px">
          <Text color={textColorSecondary}>
            {searchValue ? "No agents match your search criteria" : "No agents found in the system"}
          </Text>
        </Center>
      ) : (
        <>
          <Box overflowX="auto">
            <Table variant="simple" w="100%">
              <Thead bg={headerBg}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        cursor={header.column.getCanSort() ? "pointer" : "default"}
                        pe="4px"
                        borderColor={borderColor}
                      >
                        <Flex align="center" fontSize="sm">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <Box ml={1}>
                              {header.column.getIsSorted() === "asc" ? (
                                <FaSortUp />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <FaSortDown />
                              ) : (
                                <FaSort opacity={0.4} />
                              )}
                            </Box>
                          )}
                        </Flex>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => (
                  <Tr
                    key={row.original._id}
                    onClick={() => handleRowClick(row)}
                    cursor="pointer"
                    _hover={{ bg: hoverBg }}
                    transition="background 0.2s"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        borderColor={borderColor}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          
          {/* Pagination */}
          {data.length > 0 && (
            <Flex align="center" justify="space-between" p={4} borderTop={`1px solid ${borderColor}`}>
              <Flex align="center" gap={2}>
                <Text fontSize="sm" color={textColorSecondary}>
                  Showing {currentPageStart} to {currentPageEnd} of {serverSide ? pagination?.total : data.length} entries
                </Text>
                <Box ml={4}>
                  <select 
                    value={serverSide ? pagination?.limit : pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    style={{ 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      border: '1px solid #E2E8F0',
                      fontSize: '14px'
                    }}
                  >
                    {[10, 25, 50, 100].map(size => (
                      <option key={size} value={size}>
                        Show {size}
                      </option>
                    ))}
                  </select>
                </Box>
              </Flex>
              
              <HStack>
                <Button
                  size="sm"
                  onClick={() => {
                    if (serverSide && onPageChange) {
                      onPageChange(1); // First page is 1 for API
                    }
                    setPageIndex(0);
                  }}
                  isDisabled={pageIndex === 0}
                  variant="ghost"
                >
                  First
                </Button>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  onClick={() => {
                    const newPage = Math.max(0, pageIndex - 1);
                    if (serverSide && onPageChange) {
                      onPageChange(newPage + 1); // Convert to 1-based for API
                    } else {
                      setPageIndex(newPage);
                    }
                  }}
                  isDisabled={pageIndex === 0}
                  size="sm"
                  variant="ghost"
                  aria-label="Previous page"
                />
                <Text fontSize="sm" fontWeight="medium" minW="4rem" textAlign="center">
                  {pageIndex + 1} / {serverSide ? (pagination?.pages || 1) : pageCount}
                </Text>
                <IconButton
                  icon={<ChevronRightIcon />}
                  onClick={() => {
                    const maxPage = serverSide ? (pagination?.pages || 1) - 1 : pageCount - 1;
                    const newPage = Math.min(maxPage, pageIndex + 1);
                    if (serverSide && onPageChange) {
                      onPageChange(newPage + 1); // Convert to 1-based for API
                    } else {
                      setPageIndex(newPage);
                    }
                  }}
                  isDisabled={serverSide ? (pageIndex >= (pagination?.pages || 1) - 1) : (pageIndex >= pageCount - 1)}
                  size="sm"
                  variant="ghost"
                  aria-label="Next page"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const lastPage = serverSide ? pagination?.pages || 1 : pageCount;
                    if (serverSide && onPageChange) {
                      onPageChange(lastPage); // Use pagination.pages for API
                    } else {
                      setPageIndex(pageCount - 1);
                    }
                  }}
                  isDisabled={serverSide ? (pageIndex >= (pagination?.pages || 1) - 1) : (pageIndex >= pageCount - 1)}
                  variant="ghost"
                >
                  Last
                </Button>
              </HStack>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
}