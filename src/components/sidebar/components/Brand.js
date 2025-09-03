import React from 'react';

// Chakra imports
import { Flex, Img, useColorModeValue } from '@chakra-ui/react';


import { HSeparator } from 'components/separator/Separator';
import { Text } from '@chakra-ui/react';

export function SidebarBrand() {
  return (
    <Flex align="center" direction="column">
      <img className="mb-5" src="/Logo.png" alt="Abrocare" />
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
