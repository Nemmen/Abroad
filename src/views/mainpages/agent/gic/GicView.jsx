import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiFileText, FiUser, FiPhone, FiMail, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

const sampleData = {
  sNo: '1',
  studentName: 'John Doe',
  passportNo: 'A1234567',
  email: 'johndoe@example.com',
  phoneNo: '1234567890',
  bankVendor: 'ICICI',
  accFundingMonth: 'August',
  commission: '500',
  amt: '1000',
  tds: '50',
  netPayable: '950',
  commissionStatus: 'Paid',
  documentType: 'Passport',
  documentFile: 'passport_johndoe.pdf',
};

// Map of form fields to icons
const fieldIcons = {
  sNo: FiFileText,
  studentName: FiUser,
  passportNo: FiFileText,
  email: FiMail,
  phoneNo: FiPhone,
  bankVendor: FiBriefcase,
  accFundingMonth: FiDollarSign,
  commission: FiDollarSign,
  amt: FiDollarSign,
  tds: FiDollarSign,
  netPayable: FiDollarSign,
  commissionStatus: FiBriefcase,
  documentType: FiFileText,
  documentFile: FiFileText,
};

function GicView() {
  const { id } = useParams();
  const formData = sampleData;

  // Define color mode values
  const labelColor = useColorModeValue('gray.500', 'gray.400');
  const valueColor = useColorModeValue('gray.900', 'whibluepha.900');
  const bgColor = useColorModeValue('white', 'gray.800');
  const fieldBgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      width="full"
      maxW="90vw"
      mx="auto"
      mt={10}
      p={10}
      bg={bgColor}
      borderRadius="xl"
      boxShadow="2xl"
    >
      <Flex align="center" mb={8}>
        <Icon as={FiFileText} w={8} h={8} color="blue.500" mr={4} />
        <Heading as="h3" fontSize="3xl" color="blue.600">
          GIC Details
        </Heading>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {Object.entries(formData).map(([label, value], index) => (
          <VStack key={index} align="start" spacing={2} w="full">
            <Flex align="center">
              <Icon as={fieldIcons[label] || FiFileText} color="blue.500" mr={2} />
              <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                {label.replace(/([A-Z])/g, ' $1')}
              </Text>
            </Flex>
            <Box
              p={4}
              bg={fieldBgColor}
              borderRadius="md"
              width="full"
            >
              <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                {value}
              </Text>
            </Box>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default GicView;
