import React from 'react';

// Chakra imports
import { Box, Flex, Grid } from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/marketplace/components/Banner';


import Card from 'components/card/Card.js';
import TableTopCreators from 'views/admin/marketplace/components/TableTopCreators';
import tableDataTopCreators from '../variable/tableDataTopCreators.json';
import { tableColumnsTopCreators } from 'views/mainpages/admin/variable/tableColumnsTopCreators';

export default function MainDashboard() {
  // Chakra Color Mode

  return (
    <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'grid' }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}
        >
          <Banner />
          <Flex direction="column"></Flex>
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
        >
          <Card px="0px" mb="20px">
            <TableTopCreators
              tableData={tableDataTopCreators}
              columnsData={tableColumnsTopCreators}
            />
          </Card>
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
