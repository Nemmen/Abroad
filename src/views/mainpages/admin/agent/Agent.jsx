import React, { useEffect } from 'react';

// Chakra imports
import { Box, Flex, Grid } from '@chakra-ui/react';

// Custom components
import PieCard from 'views/mainpages/admin/agent/components/PieCard';

import Card from 'components/card/Card.js';
import TableTopCreators from 'views/mainpages/admin/agent/components/TopUserTable';
import UserDataTable from './components/UserDataTable';
import axios from 'axios';

// const users = [
//   {
//     name: 'John Doe',
//     email: 'john@example.com',
//     city: 'New York',
//     serviceRegisteredOn: '2024-01-01',
//   },
//   {
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     city: 'Los Angeles',
//     serviceRegisteredOn: '2024-02-15',
//   },
//   {
//     name: 'Alice Johnson',
//     email: 'alice@example.com',
//     city: 'Chicago',
//     serviceRegisteredOn: '2024-03-20',
//   },
// ];

function handleUserRowClick(userData) {
  // console.log('Clicked user:', userData);
  // Perform actions like opening a modal or navigating to a detail page
}

export default function Agent() {
  // Chakra Color Mode
  const [users, setUsers] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get(
          'https://abroad-backend-ten.vercel.app/admin/getuser',
          { withCredentials: true },
        );
        const filteredUsers = usersResponse.data.users.filter(
          (user) => user.role === 'user',
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);


  return (
    <Box >
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '1fr 0.46fr': '2xl' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'grid' }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 1 / 2 / 2', '2xl': '1 / 1 / 2 / 9' }}
        >
          <Card px="0px" mb="20px">
            <TableTopCreators />
          </Card>
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 2 / 2 / 3 ', '2xl': '1 / 9 / 2 / 9 ' }}
        >
          <Card px="0px" mb="20px">
            <PieCard />
          </Card>
        </Flex>
      </Grid>
      {/* Delete Product */}
      <Box width={'full'}>
        <Card px="0px" mb="20px">
          <UserDataTable tableData={users} searchValue={searchValue} setSearchValue={setSearchValue} onRowClick={handleUserRowClick} />
        </Card>
      </Box>
    </Box>
  );
}
