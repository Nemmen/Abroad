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
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Textarea,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import {
  FiFileText,
  FiUser,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiBriefcase,
  FiUpload,
  FiTrash2,
  FiCalendar,
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const formatOshcData = (data) => {
  // Function to format the date to a readable format (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  const data1 = {
    AgentName: data.agentRef?.name || '',
    studentName: data.studentRef?.name || '',
    studentEmail: data.studentRef?.email || '',
    studentPhone: data.studentRef?.phoneNumber || '',
    ...data,
    policyStartDate: formatDate(data.policyStartDate),
    policyEndDate: formatDate(data.policyEndDate),
  };

  const { agentRef, studentRef, ...rest } = data1;
  return rest;
};

const fieldIcons = {
  studentName: FiUser,
  studentEmail: FiMail,
  studentPhone: FiPhone,
  passportNumber: FiFileText,
  partner: FiBriefcase,
  policyStartDate: FiCalendar,
  policyEndDate: FiCalendar,
  premium: FiDollarSign,
  commission: FiDollarSign,
  status: FiBriefcase,
  notes: FiFileText,
  AgentName: FiUser,
};

function AdminOshcView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({});
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Document management states
  const [documents, setDocuments] = useState([]);

  // Document type options to match OshcForm
  const documentTypeOptions = ['Policy Document', 'Receipt', 'Application Form', 'Other'];
  
  // Partner and Status options
  const partnerOptions = ['AHM', 'NIB', 'Allianz', 'Medibank', 'Bupa'];
  const statusOptions = ['Pending', 'Approved', 'Rejected', 'Processing'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://abroad-backend-gray.vercel.app/api/oshc/${id}`,
          { withCredentials: true }
        );
        
        if (response.data.success && response.data.data) {
          const oshcData = response.data.data;
          setFormData(formatOshcData(oshcData));

          setEditableData({
            partner: oshcData?.partner || '',
            policyStartDate: oshcData?.policyStartDate || '',
            policyEndDate: oshcData?.policyEndDate || '',
            premium: oshcData?.premium || 0,
            commission: oshcData?.commission || 0,
            status: oshcData?.status || 'Pending',
            notes: oshcData?.notes || '',
          });

          // Initialize documents
          setDocuments(
            Array.isArray(oshcData?.documents)
              ? oshcData.documents.map((doc) => ({
                  documentType: doc.type || '',
                  documentFile: doc.url || '',
                  filename: doc.filename || '',
                }))
              : []
          );
        } else {
          console.error('Insurance entry not found with ID:', id);
          setFormData({});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load Insurance data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setFormData({});
        setEditableData({});
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, toast]);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  // Document management functions
  const addDocument = () => {
    setDocuments([
      ...documents,
      { documentType: '', documentFile: null, filename: '' },
    ]);
  };

  const removeDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  const handleDocumentChange = (index, name, value) => {
    const updatedDocuments = documents.map((doc, i) =>
      i === index ? { ...doc, [name]: value } : doc
    );
    setDocuments(updatedDocuments);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let updatedFormData = { ...editableData };

      // Handle document uploads if any new files are selected
      const documentsArray = [];
      const filesToUpload = [];
      const types = [];

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        if (doc.documentType) {
          if (doc.documentFile && typeof doc.documentFile === 'object') {
            // New file to upload
            filesToUpload.push(doc.documentFile);
            types.push(doc.documentType);
          } else if (doc.documentFile && typeof doc.documentFile === 'string') {
            // Existing file URL
            documentsArray.push({
              type: doc.documentType,
              url: doc.documentFile,
              filename: doc.filename || '',
            });
          }
        }
      }

      // Upload new files if any
      if (filesToUpload.length > 0) {
        try {
          const formDataForUpload = new FormData();
          filesToUpload.forEach((file) => {
            formDataForUpload.append('files', file);
          });

          const uploadResponse = await axios.post(
            'https://abroad-backend-gray.vercel.app/upload/upload-multiple',
            formDataForUpload,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );

          if (uploadResponse.data.success) {
            const uploads = uploadResponse.data.uploads;
            for (let i = 0; i < types.length; i++) {
              documentsArray.push({
                type: types[i],
                url: uploads[i].viewLink,
                filename: filesToUpload[i].name,
              });
            }
          }
        } catch (uploadError) {
          console.error('Error uploading files:', uploadError);
          toast({
            title: 'File Upload Error',
            description: 'An error occurred while uploading files.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
          return;
        }
      }

      // Prepare API data
      const apiData = {
        partner: updatedFormData.partner,
        policyStartDate: updatedFormData.policyStartDate,
        policyEndDate: updatedFormData.policyEndDate,
        premium: parseFloat(updatedFormData.premium) || 0,
        commission: parseFloat(updatedFormData.commission) || 0,
        status: updatedFormData.status,
        notes: updatedFormData.notes,
      };

      // Add documents if any exist
      if (documentsArray.length > 0) {
        apiData.documents = documentsArray;
      }

      // Remove empty fields
      Object.keys(apiData).forEach((key) => {
        if (apiData[key] === '' || apiData[key] === null || apiData[key] === undefined) {
          delete apiData[key];
        }
      });

      const response = await axios.put(
        `https://abroad-backend-gray.vercel.app/api/oshc/admin/${id}`,
        apiData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success) {
        // Format the updated data and refresh the view
        const updatedOSHC = response.data.data || response.data.oshc;
        if (updatedOSHC) {
          const formattedData = formatOshcData(updatedOSHC);
          setFormData(formattedData);

          // Update documents state with the new data
          setDocuments(
            Array.isArray(updatedOSHC?.documents)
              ? updatedOSHC.documents.map((doc) => ({
                  documentType: doc.type || '',
                  documentFile: doc.url || '',
                  filename: doc.filename || '',
                }))
              : []
          );
        }
        setIsEditing(false);
        toast({
          title: 'Success',
          description: 'Insurance entry updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating Insurance entry:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error updating Insurance entry. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // All hooks must be called before any conditional returns
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const documentBoxBg = useColorModeValue('gray.50', 'gray.700');
  const pageBg = useColorModeValue('gray.50', 'gray.900');

  // Fields that should not be editable (read-only)
  const readOnlyFields = ['studentName', 'studentEmail', 'studentPhone', 'passportNumber', 'AgentName'];
  
  // Fields to exclude from display
  const excludedFields = ['_id', 'createdAt', 'updatedAt', 'isDeleted', '__v' , 'documents'];

  // Show loading state
  if (loading) {
    return (
      <Box p={6} bg={pageBg} minH="100vh">
        <Flex justify="center" align="center" minH="400px">
          <VStack spacing={4}>
            <Text fontSize="lg">Loading Insurance data...</Text>
            <Text fontSize="sm" color="gray.500">ID: {id}</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  // Show empty state if no data
  if (!formData || Object.keys(formData).length === 0) {
    return (
      <Box p={6} bg={pageBg} minH="100vh">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color={headingColor}>
            OSHC Entry Not Found
          </Heading>
          <Button
            colorScheme="gray"
            onClick={() => navigate('/admin/oshc')}
          >
            Back to List
          </Button>
        </Flex>
        <Text>No Insurance entry found with ID: {id}</Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg={pageBg} minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color={headingColor}>
          OSHC Entry Details
        </Heading>
        <Flex gap={3}>
          <Button
            colorScheme="gray"
            onClick={() => navigate('/admin/oshc')}
          >
            Back to List
          </Button>
          {!isEditing ? (
            <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                colorScheme="green"
                onClick={handleSave}
                isLoading={loading}
              >
                Save
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  setIsEditing(false);
                  // Reset editable data to original
                  setEditableData({
                    partner: formData?.partner || '',
                    policyStartDate: formData?.policyStartDate || '',
                    policyEndDate: formData?.policyEndDate || '',
                    premium: formData?.premium || 0,
                    commission: formData?.commission || 0,
                    status: formData?.status || 'Pending',
                    notes: formData?.notes || '',
                  });
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {Object.entries(formData)
          .filter(([key]) => !key.startsWith('__') && !excludedFields.includes(key))
          .map(([key, value]) => {
            const isEditable = !readOnlyFields.includes(key) && isEditing;
            const icon = fieldIcons[key] || FiFileText;

            return (
              <Box
                key={key}
                p={5}
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                boxShadow="sm"
              >
                <Flex align="center" mb={2}>
                  <Icon as={icon} mr={2} color={headingColor} />
                  <Text fontWeight="bold" fontSize="sm" color="gray.600">
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Text>
                </Flex>

                {isEditable ? (
                  <FormControl>
                    {key === 'partner' ? (
                      <Select
                        value={editableData[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                      >
                        <option value="">Select Partner</option>
                        {partnerOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    ) : key === 'status' ? (
                      <Select
                        value={editableData[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    ) : key === 'notes' ? (
                      <Textarea
                        value={editableData[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder="Enter notes"
                      />
                    ) : key === 'premium' || key === 'commission' ? (
                      <NumberInput
                        value={editableData[key] || 0}
                        onChange={(valueString) => handleChange(key, valueString)}
                        min={0}
                      >
                        <NumberInputField />
                      </NumberInput>
                    ) : key === 'policyStartDate' || key === 'policyEndDate' ? (
                      <Input
                        type="date"
                        value={editableData[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    ) : (
                      <Input
                        value={editableData[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    )}
                  </FormControl>
                ) : (
                  <Text fontSize="md" color="gray.800">
                    {value || 'N/A'}
                  </Text>
                )}
              </Box>
            );
          })}
      </SimpleGrid>

      {/* Documents Section */}
      <Box mt={8} p={5} bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="md">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md" color={headingColor}>
            Documents
          </Heading>
          {isEditing && (
            <Button leftIcon={<FiUpload />} colorScheme="blue" size="sm" onClick={addDocument}>
              Add Document
            </Button>
          )}
        </Flex>

        <VStack spacing={4} align="stretch">
          {documents.length === 0 ? (
            <Text color="gray.500">No documents uploaded</Text>
          ) : (
            documents.map((doc, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                bg={documentBoxBg}
              >
                <SimpleGrid columns={{ base: 1, md: isEditing ? 3 : 2 }} spacing={3}>
                  <FormControl>
                    <FormLabel fontSize="sm">Document Type</FormLabel>
                    {isEditing ? (
                      <Select
                        value={doc.documentType}
                        onChange={(e) =>
                          handleDocumentChange(index, 'documentType', e.target.value)
                        }
                      >
                        <option value="">Select Type</option>
                        {documentTypeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Text>{doc.documentType || 'N/A'}</Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">File</FormLabel>
                    {isEditing ? (
                      <Input
                        type="file"
                        onChange={(e) =>
                          handleDocumentChange(index, 'documentFile', e.target.files[0])
                        }
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    ) : doc.documentFile ? (
                      <Button
                        as="a"
                        href={doc.documentFile}
                        target="_blank"
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<FiFileText />}
                      >
                        View Document
                      </Button>
                    ) : (
                      <Text>No file</Text>
                    )}
                  </FormControl>

                  {isEditing && (
                    <Flex align="flex-end">
                      <Button
                        colorScheme="red"
                        size="sm"
                        leftIcon={<FiTrash2 />}
                        onClick={() => removeDocument(index)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  )}
                </SimpleGrid>
              </Box>
            ))
          )}
        </VStack>
      </Box>
    </Box>
  );
}

export default AdminOshcView;
