import React, { useEffect, useState } from 'react';
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
import {
  FiFileText,
  FiUser,
  FiGlobe,
  FiDollarSign,
  FiFile,
  FiCheckSquare,
  FiPercent,
  FiFolder,
} from 'react-icons/fi';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Sample data for display, including documents
const sampleData = {
  sNo: '1',
  date: '2023-11-12',
  studentName: 'John Doe',
  country: 'India',
  currencyBooked: 'INR',
  quotation: '1000',
  studentPaid: '900',
  docsStatus: 'Complete',
  ttCopyStatus: 'Received',
  agentCommission: '50',
  tds: '5',
  netPayable: '945',
  commissionStatus: 'Paid',
  passportFile: 'passport_john.pdf',
  offerLetterFile: 'offer_letter_john.pdf',
  documents: [
    {
      documentOf: 'Father',
      documentType: 'Adhar',
      documentFile: 'adhar_john_doe.pdf',
    },
    {
      documentOf: 'Mother',
      documentType: 'Pan',
      documentFile: 'pan_mary_doe.pdf',
    },
  ],
};

// Map of form fields to icons
const fieldIcons = {
  sNo: FiFileText,
  date: FiFileText,
  studentName: FiUser,
  country: FiGlobe,
  currencyBooked: FiDollarSign,
  quotation: FiDollarSign,
  studentPaid: FiDollarSign,
  docsStatus: FiCheckSquare,
  ttCopyStatus: FiCheckSquare,
  agentCommission: FiPercent,
  tds: FiPercent,
  netPayable: FiDollarSign,
  commissionStatus: FiCheckSquare,
  passportFile: FiFile,
  offerLetterFile: FiFile,
};

function ForexView() {
  const { id } = useParams();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:4000/auth/viewAllForexForms`)
      .then((response) => {
        console.log('Response received:', response.data);
        if (response.data.success) {
          const formData1 = response.data.forexForms.find(
            (form) => form._id === id,
          );
          if (formData1) {
            setFormData(formData1);
            
          } else {
            console.error('Form data not found for ID:', id);
          }
        } else {
          console.error('Request was not successful:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

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
          Forex Details
        </Heading>
      </Flex>

      {Object.keys(formData).length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          {Object.entries(formData).map(
            ([label, value], index) =>
              // Render general fields, excluding 'documents'
            label !== '__v' && label !=='_id' && label !== 'documents' && (
                <VStack
                  key={index}
                  align="start"
                  spacing={2}
                  w="full"
                >
                  <Flex align="center">
                    <Icon
                      as={fieldIcons[label] || FiFileText}
                      color="blue.500"
                      mr={2}
                    />
                    <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                      {label.replace(/([A-Z])/g, ' $1')}
                    </Text>
                  </Flex>
                  <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                    <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                    {label === 'date'
                      ? new Date(value).toLocaleDateString('en-GB') // Format as DD/MM/YYYY
                      : value}
                    </Text>
                  </Box>
                </VStack>
              ),
          )}

          {/* Document section */}
          <Box gridColumn="span 2" mt={6}>
            <Flex align="center" mb={4}>
              <Icon as={FiFolder} color="blue.500" mr={2} />
              <Heading as="h4" fontSize="2xl" color="blue.600">
                Documents
              </Heading>
            </Flex>
            {formData.documents.map((doc, index) => (
              <Box
                key={index}
                mb={4}
                p={4}
                bg={fieldBgColor}
                borderRadius="md"
                boxShadow="md"
              >
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <VStack align="start">
                    <Flex align="center">
                      <Icon as={FiUser} color="blue.500" mr={2} />
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={labelColor}
                      >
                        Document Of
                      </Text>
                    </Flex>
                    <Text fontSize="md" fontWeight="bold" color={valueColor}>
                      {doc.documentOf}
                    </Text>
                  </VStack>
                  <VStack align="start">
                    <Flex align="center">
                      <Icon as={FiFileText} color="blue.500" mr={2} />
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={labelColor}
                      >
                        Document Type
                      </Text>
                    </Flex>
                    <Text fontSize="md" fontWeight="bold" color={valueColor}>
                      {doc.documentType}
                    </Text>
                  </VStack>
                  <VStack align="start">
                    <Flex align="center">
                      <Icon as={FiFile} color="blue.500" mr={2} />
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={labelColor}
                      >
                        File Name
                      </Text>
                    </Flex>
                    <Text fontSize="md" fontWeight="bold" color={valueColor}>
                      {doc.documentFile}
                    </Text>
                  </VStack>
                </SimpleGrid>
              </Box>
            ))}
          </Box>
        </SimpleGrid>
      )}
    </Box>
  );
}

export default ForexView;
