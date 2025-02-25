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
  Input,
  Button,
  Select,
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

const formatGICData = (data) => {
  // Function to format the date to a readable format (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  const data1 = {
    AgentName: data.agentRef?.name || '', // Extract agent name
    studentName: data.studentRef?.name || '', // Extract student name
    ...data,
    accOpeningDate: formatDate(data.accOpeningDate), // Format the date
  };

  const { agentRef, studentRef, ...rest } = data1;
  return rest;
};
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
};

function GicView() {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://abroad-backend-gray.vercel.app/auth/viewAllGicForm',
        );
        if (response.data.success) {
          const formData1 = response.data.gicForms.find(
            (form) => form._id === id,
          );
          setFormData(formatGICData(formData1));
          setEditableData({
            studentPhoneNo: formData1?.studentPhoneNo,
            studentPassportNo: formData1?.studentPassportNo,
            bankVendor: formData1?.bankVendor,
            fundingMonth: formData1?.fundingMonth,
            commissionAmt: formData1?.commissionAmt,
            tds: formData1?.tds,
            netPayable: formData1?.netPayable,
            commissionStatus: formData1?.commissionStatus || 'Not Received',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://abroad-backend-gray.vercel.app/auth/updateGicForm/${id}`,
        editableData,
      );
      if (response.data.success) {
        setFormData((prev) => ({ ...prev, ...editableData }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating GIC form:', error);
    }
  };

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
      <Flex justify="space-between" mb={8}>
        <Heading as="h3" fontSize="3xl" color="blue.600">
        {formData?.type ? formData?.type : 'GIC'} Details
        </Heading>
        {isEditing ? (
          <Flex>
            <Button colorScheme="green" onClick={handleSave} mr={4}>
              Save
            </Button>
            <Button colorScheme="red" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </Flex>
        ) : (
          <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {Object.entries(formData).map(([label, value], index) => {
          const isEditable = [
            'studentPhoneNo',
            'studentPassportNo',
            'bankVendor',
            'fundingMonth',
            'commissionAmt',
            'tds',
            'netPayable',
            'commissionStatus',
          ].includes(label);

          return (
            label !== '__v' &&
            label !== '_id' &&
            label !== 'studentDocuments' && (
              <VStack
                key={index}
                align="start"
                spacing={2}
                gridColumn={label === 'commissionStatus' ? 'span 2' : ''}
                w="full"
              >
                <Flex align="center">
                  <Icon
                    as={fieldIcons[label] || FiFileText}
                    color="blue.500"
                    mr={2}
                  />
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                    {label === 'accOpeningDate'
                      ? 'Account Opening Date'
                      : `${label
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/\b\w/g, (char) =>
                            char.toUpperCase(),
                          )}${' '}`}
                  </Text>
                </Flex>
                <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                  {isEditing && isEditable ? (
                    label === 'commissionStatus' ? (
                      <Select
                        value={editableData[label]}
                        onChange={(e) => handleChange(label, e.target.value)}
                      >
                        <option value="Not Received">Not Received</option>
                        <option value="Paid">Paid</option>
                        <option value="Under Processing">
                          Under Processing
                        </option>
                      </Select>
                    ) : (
                      <Input
                        value={editableData[label] || ''}
                        onChange={(e) => handleChange(label, e.target.value)}
                      />
                    )
                  ) : label === 'agentRef' ? (
                    <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                      {value.agentCode}
                    </Text>
                  ) : label === 'studentRef' ? (
                    <VStack align="start" spacing={3}>
                      <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                        {value.name}
                      </Text>
                    </VStack>
                  ) : typeof value === 'object' ? (
                    <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                      {JSON.stringify(value)}
                    </Text>
                  ) : (
                    <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                      {value}
                    </Text>
                  )}
                </Box>
              </VStack>
            )
          );
        })}

        {/* Render each student document as a separate field */}
        {formData.studentDocuments &&
          Object.entries(formData.studentDocuments).map(([docLabel, doc]) => (
            <VStack
              key={docLabel}
              align="start"
              gridColumn={'span 2'}
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
                {doc.documentFile ? (
                  <Link
                    href={doc.documentFile}
                    color="blue.500"
                    fontWeight="bold"
                    isExternal
                  >
                    View File 👁️
                  </Link>
                ) : (
                  <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                    Not Provided
                  </Text>
                )}
              </Box>
            </VStack>
          ))}
      </SimpleGrid>
    </Box>
  );
}

export default GicView;
