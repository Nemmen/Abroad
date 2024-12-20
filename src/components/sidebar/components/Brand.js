import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";


import { HSeparator } from "components/separator/Separator";
import { Text } from '@chakra-ui/react'


export function SidebarBrand() {


  return (
    <Flex align='center' direction='column'>
        <Text mb={'5'} fontSize='3xl'>GlobalEdFi.Com</Text>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
  