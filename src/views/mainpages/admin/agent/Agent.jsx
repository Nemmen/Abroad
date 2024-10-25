import React from 'react';

// Chakra imports
import { Box, Flex, Grid } from '@chakra-ui/react';

// Custom components
import PieCard from 'views/admin/default/components/PieCard';

import Card from 'components/card/Card.js';
import TableTopCreators from 'views/admin/marketplace/components/TableTopCreators';
import tableDataTopCreators from '../variable/tableDataTopCreators.json';
import { tableColumnsTopCreators } from 'views/mainpages/admin/variable/tableColumnsTopCreators';
import UserDataTable from './components/UserDataTable';

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    city: 'New York',
    serviceRegisteredOn: '2024-01-01',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    city: 'Los Angeles',
    serviceRegisteredOn: '2024-02-15',
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    city: 'Chicago',
    serviceRegisteredOn: '2024-03-20',
  },
];

function handleUserRowClick(userData) {
  console.log('Clicked user:', userData);
  // Perform actions like opening a modal or navigating to a detail page
}

export default function Agent() {
  // Chakra Color Mode

  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
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
            <TableTopCreators
              tableData={tableDataTopCreators}
              columnsData={tableColumnsTopCreators}
            />
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
          <UserDataTable tableData={users} onRowClick={handleUserRowClick} />
        </Card>
      </Box>
    </Box>
  );
}
