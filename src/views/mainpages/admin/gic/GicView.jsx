import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Link,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiFileText,
  FiUser,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiBriefcase,
} from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Map of form fields to icons
const fieldIcons = {
  sNo: FiFileText,
  studentName: FiUser,
  studentPassportNo: FiFileText,
  studentEmail: FiMail,
  studentPhoneNo: FiPhone,
  bankVendor: FiBriefcase,
  accFundingMonth: FiDollarSign,
  commissionAmt: FiDollarSign,
  amount: FiDollarSign,
  tds: FiDollarSign,
  netPayable: FiDollarSign,
  commissionStatus: FiBriefcase,
  aadhar: FiFileText,
  pan: FiFileText,
  ol: FiFileText,
  passport: FiFileText,
};

function GicView() {
  const { id } = useParams();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/auth/viewAllGicForm',
        );
        if (response.data.success) {
          const formData1 = response.data.gicForms.find(
            (form) => form._id === id,
          );
          setFormData(formData1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const labelColor = useColorModeValue('gray.500', 'gray.400');
  const valueColor = useColorModeValue('gray.900', 'white');
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
        {Object.entries(formData).map(
          ([label, value], index) =>
            label !== '__v' &&
            label !== '_id' &&
            label !== 'studentDocuments' && (
              <VStack key={index} align="start" spacing={2} w="full">
                <Flex align="center">
                  <Icon
                    as={fieldIcons[label] || FiFileText}
                    color="blue.500"
                    mr={2}
                  />
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                    {label.replace(/([A-Z])/g, ' $1')}{' '}
                    {/* Format label names */}
                  </Text>
                </Flex>
                <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                  <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                    {typeof value === 'object' && value !== null
                      ? // Handle specific cases for nested objects
                        label === 'agentRef' && value.agentCode
                        ? value.agentCode // Render only the agentCode if the label is 'agentRef'
                        : label === 'studentRef' && value.studentCode
                        ? value.name // Render only the studentCode if the label is 'studentRef'
                        : Object.entries(value)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(', ') // Fallback: render key-value pairs for other objects
                      : value}{' '}
                    {/* Render simple values */}
                  </Text>
                </Box>
              </VStack>
            ),
        )}

        {/* Render each student document as a separate field */}
        {formData.studentDocuments &&
          Object.entries(formData.studentDocuments).map(
            ([docLabel, docLink]) => (
              <VStack
                key={docLabel}
                gridColumn={docLabel === 'passport' ? 'span 2' : 'span 1'}
                align="start"
                spacing={2}
                w="full"
              >
                <Flex align="center">
                  <Icon
                    as={fieldIcons[docLabel] || FiFileText}
                    color="blue.500"
                    mr={2}
                  />
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                    {docLabel.toUpperCase()}
                  </Text>
                </Flex>
                <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                  <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                  <Link
                      href={docLink}
                      color="blue.500"
                      fontWeight="bold"
                      isExternal
                    >
                      View File 👁️
                    </Link>
                  </Text>
                </Box>
              </VStack>
            ),
          )}
      </SimpleGrid>
    </Box>
  );
}

export default GicView;
