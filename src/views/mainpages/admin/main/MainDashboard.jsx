import React from 'react';

// Chakra imports
import { Box, Flex, Grid } from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/marketplace/components/Banner';


import Card from 'components/card/Card.js';

import NotificationBar from './components/NotificationBar';
import DynamicLineChart1 from './components/GicChart';
import DynamicLineChart from './components/Chart';
import ForexcurrentMonth from './components/ForexcurrentMonth';
import GICcurrentMonth from './components/GicCurrent';

export default function MainDashboard() {
  // Chakra Color Mode

  return (
    <Box>
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
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}
        >
          <Card px="0px" mb="20px">
           <NotificationBar />
          </Card>
        </Flex>
      </Grid>
      {/* Delete Product */}

      <div className='flex justify-around'>
        <ForexcurrentMonth />
        <DynamicLineChart />
      </div>
      <div className='flex justify-around'>
        <GICcurrentMonth />
        <DynamicLineChart1 />
      </div>
      {/* <UserDetailPage /> */}
    </Box>
  );
}
