import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  Link,
  useColorModeValue,
  Button,
  Input,
  Select,
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
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get(`https://abroad-backend-ten.vercel.app/auth/viewAllForexForms`)
      .then((response) => {
        if (response.data.success) {
          const formData1 = response.data.forexForms.find(
            (form) => form._id === id,
          );
          if (formData1) {
            setFormData(formData1);
            console.log(formData);
            setEditableData({ ...formData1 });
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

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://abroad-backend-ten.vercel.app/auth/updateForexForm/${id}`,
        editableData,
      );
      if (response.data.success) {
        setFormData(editableData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating Forex form:', error);
    }
  };

  const labelColor = useColorModeValue('gray.500', 'gray.400');
  const valueColor = useColorModeValue('gray.900', 'whiteAlpha.900');
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
        <Button
          ml={4}
          colorScheme="blue"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        {isEditing && (
          <Button ml={4} colorScheme="blue" onClick={handleSave}>
            Update
          </Button>
        )}
      </Flex>

      {Object.keys(formData).length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          {formData.agentRef && (
            <VStack align="start" spacing={2} w="full">
              <Flex align="center">
                <Icon as={FiUser} color="blue.500" mr={2} />
                <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                  Agent Name
                </Text>
              </Flex>
              <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                  {formData.agentRef.name.toUpperCase()}
                </Text>
              </Box>
            </VStack>
          )}
          {formData.agentRef && (
            <VStack align="start" spacing={2} w="full">
              <Flex align="center">
                <Icon as={FiUser} color="blue.500" mr={2} />
                <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                  Studnet Name
                </Text>
              </Flex>
              <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                  {formData.studentRef.name.toUpperCase()}
                </Text>
              </Box>
            </VStack>
          )}
          {Object.entries(formData).map(([label, value], index) => {
            const isEditable =
              label !== 'passportFile' && label !== 'offerLetterFile';

            const renderSelectOptions = (field) => {
              switch (field) {
                case 'ttCopyStatus':
                case 'docsStatus':
                  return (
                    <Select
                      value={editableData[label]}
                      onChange={(e) => handleChange(label, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Received">Received</option>
                      <option value="Verified">Verified</option>
                    </Select>
                  );
                case 'commissionStatus':
                  return (
                    <Select
                      value={editableData[label]}
                      onChange={(e) => handleChange(label, e.target.value)}
                    >
                      <option value="Not Received">Not Received</option>
                      <option value="Paid">Paid</option>
                      <option value="Under Processing">Under Processing</option>
                    </Select>
                  );
                default:
                  return null;
              }
            };

            return (
              label !== '__v' &&
              label !== '_id' &&
              label !== 'documents' &&
              label !== 'agentRef' &&
              label !== 'studentRef' && (
                <VStack key={index} align="start" spacing={2} gridColumn={label === 'date' ? 'span 2':''} w="full">
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
                    {isEditing && isEditable ? (
                      renderSelectOptions(label) || (
                        <Input
                          value={editableData[label]}
                          onChange={(e) => handleChange(label, e.target.value)}
                        />
                      )
                    ) : label.endsWith('File') &&
                      (label === 'passportFile' ||
                        label === 'offerLetterFile') ? (
                      <Link
                        href={value.documentFile}
                        color="blue.500"
                        fontWeight="bold"
                        isExternal
                      >
                        View File 👁️
                      </Link>
                    ) : (
                      <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                        {label === 'date'
                          ? new Date(value).toLocaleDateString('en-GB')
                          : value}
                      </Text>
                    )}
                  </Box>
                </VStack>
              )
            );
          })}

          {/* Documents Section */}
          <Box gridColumn="span 2" mt={6}>
            <Flex align="center" mb={4}>
              <Icon as={FiFolder} color="blue.500" mr={2} />
              <Heading as="h4" fontSize="2xl" color="blue.600">
                Documents
              </Heading>
            </Flex>
            {formData.documents &&
              formData.documents.map((doc, index) => (
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
                      <Link
                        href={doc.documentFile}
                        color="blue.500"
                        fontWeight="bold"
                        isExternal
                      >
                        View File 👁️
                      </Link>
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
