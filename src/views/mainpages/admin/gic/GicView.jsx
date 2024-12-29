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
          'http://localhost:4000/auth/viewAllGicForm'
        );
        if (response.data.success) {
          const formData1 = response.data.gicForms.find(
            (form) => form._id === id
          );
          setFormData(formData1);
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
        `http://localhost:4000/auth/updateGicForm/${id}`,
        editableData
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


  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const bankVendors = ['ICICI', 'RBC', 'CIBC', 'BOM', 'TD'];
  
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
          GIC Details
        </Heading>
        {isEditing ? (
          <Flex>
            <Button colorScheme="green" onClick={handleSave} mr={4}>
              Save
            </Button>
            <Button
              colorScheme="red"
              onClick={() => setIsEditing(false)}
            >
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
            label !== '_id' && (
              <VStack key={index} align="start" spacing={2} w="full">
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
    label === 'commissionStatus' ? (
      <Select
        value={editableData[label]}
        onChange={(e) => handleChange(label, e.target.value)}
      >
        <option value="Not Received">Not Received</option>
        <option value="Paid">Paid</option>
        <option value="Under Processing">Under Processing</option>
      </Select>
    ) : label === 'fundingMonth' ? (
      <Select
        value={editableData[label]}
        onChange={(e) => handleChange(label, e.target.value)}
      >
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </Select>
    ) : label === 'bankVendor' ? (
      <Select
        value={editableData[label]}
        onChange={(e) => handleChange(label, e.target.value)}
      >
        {bankVendors.map((vendor, index) => (
          <option key={index} value={vendor}>
            {vendor}
          </option>
        ))}
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
    value ? (
      <VStack align="start" spacing={3}>
        <Text fontSize="lg" fontWeight="bold" color={valueColor}>
          {value.name || 'N/A'}
        </Text>
        {value.documents?.length > 0 ? (
          value.documents.map((doc, docIndex) => (
            <Flex
              key={docIndex}
              justify="space-between"
              align="center"
              w="full"
            >
              <Text fontSize="md" fontWeight="medium" color={valueColor}>
                {doc.name || 'Unnamed Document'}
              </Text>
              <Link
                href={doc.url}
                isExternal
                color="blue.500"
                textDecoration="underline"
                display="flex"
                alignItems="center"
              >
                View File 👁️
              </Link>
            </Flex>
          ))
        ) : (
          <Text fontSize="md" fontWeight="medium" color={labelColor}>
            No Documents Available
          </Text>
        )}
      </VStack>
    ) : (
      <Text fontSize="md" fontWeight="medium" color={labelColor}>
        No Student Reference Available
      </Text>
    )
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
      </SimpleGrid>

      <SimpleGrid columns={1} spacing={10}>
        {editableData?.pan && (
          <VStack align="start" spacing={2} w="full">
            <Text fontSize="sm" fontWeight="medium" color={labelColor}>
              PAN
            </Text>
            <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
              <Link
                href={editableData.pan}
                isExternal
                color="blue.500"
                textDecoration="underline"
                display="flex"
                alignItems="center"
              >
                View PAN File 👁️
              </Link>
            </Box>
          </VStack>
        )}
      </SimpleGrid>
    </Box>
  );
}

export default GicView;
