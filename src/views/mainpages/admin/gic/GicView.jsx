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
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  useToast,
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
  const toast = useToast();
  const [formData, setFormData] = useState({});
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Document management states
  const [documents, setDocuments] = useState([]);
  
  // Document type options to match GicForm
  const documentTypeOptions = ['aadhar', 'pan', 'ol', 'passport'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://abroad-backend-gray.vercel.app/auth/viewAllGicForm',
        );
        if (response.data.success && response.data.gicForms) {
          const formData1 = response.data.gicForms.find(
            (form) => form._id === id,
          );
          if (formData1) {
            setFormData(formatGICData(formData1));
          } else {
            console.error('GIC form not found with ID:', id);
            setFormData({});
          }
       
          setEditableData({
            type: formData1?.type || '',
            Agents: formData1?.agentRef?._id || '',
            passportNo: formData1?.studentPassportNo || '',
            studentRef: formData1?.studentRef?.name || formData1?.studentName || '',
            email: formData1?.studentEmail || '',
            phoneNo: formData1?.studentPhoneNo || '',
            bankVendor: formData1?.bankVendor || '',
            accOpeningDate: formData1?.accOpeningDate || '',
            accOpeningMonth: formData1?.accOpeningMonth || '',
            accFundingMonth: formData1?.fundingMonth || '',
            commission: formData1?.commissionAmt || '',
            tds: formData1?.tds || '',
            netPayable: formData1?.netPayable || '',
            commissionStatus: formData1?.commissionStatus || 'Not Received',
          });
          
          // Initialize documents with proper null checks
          setDocuments(formData1?.studentDocuments && typeof formData1.studentDocuments === 'object' ? 
            Object.entries(formData1.studentDocuments).map(([type, data]) => ({
              documentType: type,
              documentFile: data?.documentFile || '',
              fileId: data?.fileId || ''
            })) : []
          );
        } else {
          console.error('Invalid API response structure');
          setFormData({});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFormData({});
        setEditableData({});
        setDocuments([]);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  // Document management functions
  const addDocument = () => {
    if (documents.length < 4) {
      setDocuments([
        ...documents,
        { documentType: '', documentFile: null, fileId: '' }
      ]);
    }
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
      const studentDocuments = {};
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
            studentDocuments[doc.documentType] = {
              fileId: doc.fileId || '',
              documentFile: doc.documentFile
            };
          }
        }
      }
      
      // Upload new files if any
      if (filesToUpload.length > 0) {
        try {
          const formDataForUpload = new FormData();
          filesToUpload.forEach((file, index) => {
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
              studentDocuments[types[i]] = {
                fileId: uploads[i].fileId,
                documentFile: uploads[i].viewLink
              };
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
      
      // Add studentDocuments to the form data if any documents exist
      if (Object.keys(studentDocuments).length > 0) {
        updatedFormData.studentDocuments = studentDocuments;
      }
      
      // Map the form data to match the backend API exactly as provided
      const apiData = {
        studentPhoneNo: updatedFormData.phoneNo,
        studentPassportNo: updatedFormData.passportNo,
        bankVendor: updatedFormData.bankVendor,
        fundingMonth: updatedFormData.accFundingMonth,
        commissionAmt: updatedFormData.commission,
        tds: updatedFormData.tds,
        netPayable: updatedFormData.netPayable,
        commissionStatus: updatedFormData.commissionStatus,
      };
      
      // Add studentDocuments if any documents exist
      if (Object.keys(studentDocuments).length > 0) {
        apiData.studentDocuments = studentDocuments;
      }
      
      // Remove empty fields
      Object.keys(apiData).forEach(key => {
        if (apiData[key] === '' || apiData[key] === null || apiData[key] === undefined) {
          delete apiData[key];
        }
      });

      const response = await axios.put(
        `https://abroad-backend-gray.vercel.app/auth/updateGicForm/${id}`,
        apiData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      if (response.data.success) {
        // Format the updated data and refresh the view
        const updatedGIC = response.data.updatedGIC || response.data.gicForm || response.data.data;
        if (updatedGIC) {
          const formattedData = formatGICData(updatedGIC);
          setFormData(formattedData);
          
          // Update documents state with the new data
          setDocuments(updatedGIC?.studentDocuments && typeof updatedGIC.studentDocuments === 'object' ? 
            Object.entries(updatedGIC.studentDocuments).map(([type, data]) => ({
              documentType: type,
              documentFile: data?.documentFile || '',
              fileId: data?.fileId || ''
            })) : []
          );
        }
        setIsEditing(false);
        toast({
          title: 'Success',
          description: 'GIC form updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating GIC form:', error);
      toast({
        title: 'Error',
        description: 'Error updating GIC form. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
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
            <Button 
              colorScheme="green" 
              onClick={handleSave} 
              mr={4}
              isLoading={loading}
              loadingText="Saving..."
            >
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

      {formData && Object.keys(formData).length > 0 && (
        <>
          {!isEditing ? (
            // View Mode - Display existing structure
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Display all fields in view mode */}
              {[
                { key: 'type', label: 'Service Type' },
                { key: 'AgentName', label: 'Agent Name' },
                { key: 'studentName', label: 'Student Name' },
                { key: 'studentPassportNo', label: 'Passport No' },
                { key: 'studentEmail', label: 'Email' },
                { key: 'studentPhoneNo', label: 'Phone No' },
                { key: 'bankVendor', label: 'Bank Vendor' },
                { key: 'accOpeningDate', label: 'Account Opening Date' },
                { key: 'accOpeningMonth', label: 'Account Opening Month' },
                { key: 'fundingMonth', label: 'Funding Month' },
                { key: 'commissionAmt', label: 'Commission Amount' },
                { key: 'tds', label: 'TDS' },
                { key: 'netPayable', label: 'Net Payable' },
                { key: 'commissionStatus', label: 'Commission Status' },
              ].map(({ key, label }) => (
                formData[key] && (
                  <VStack key={key} align="start" spacing={2} w="full">
                    <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                      {label}
                    </Text>
                    <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                      <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                        {key === 'accOpeningDate' && formData[key]
                          ? new Date(formData[key]).toLocaleDateString('en-GB')
                          : formData[key] || 'Not Set'}
                      </Text>
                    </Box>
                  </VStack>
                )
              ))}
            </SimpleGrid>
          ) : (
            // Edit Mode - Complete form matching GicForm.jsx
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Service Type */}
              <FormControl isRequired>
                <FormLabel>Type Of Service</FormLabel>
                <Select
                  value={editableData.type || ''}
                  onChange={(e) => handleChange('type', e.target.value)}
                  h="50px"
                  w="full"
                >
                  <option value="">Select Type of Service</option>
                  <option value="GIC">GIC</option>
                  <option value="BLOCKED ACCOUNT">BLOCKED ACCOUNT</option>
                </Select>
              </FormControl>

              {/* Agent Name - Display only (not editable in edit form) */}
              <FormControl>
                <FormLabel>Agent Name</FormLabel>
                <Input
                  value={formData.AgentName || ''}
                  isReadOnly
                  bg="gray.100"
                  h="50px"
                />
              </FormControl>

              {/* Passport No */}
              <FormControl isRequired>
                <FormLabel>Passport No.</FormLabel>
                <Input
                  value={editableData.passportNo || ''}
                  onChange={(e) => handleChange('passportNo', e.target.value)}
                  h="50px"
                  placeholder="Enter passport number"
                />
              </FormControl>

              {/* Student Name */}
              <FormControl isRequired>
                <FormLabel>Student Name</FormLabel>
                <Input
                  value={editableData.studentRef || ''}
                  onChange={(e) => handleChange('studentRef', e.target.value)}
                  h="50px"
                  placeholder="Enter student name"
                />
              </FormControl>

              {/* Email */}
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={editableData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  h="50px"
                  placeholder="Enter email address"
                />
              </FormControl>

              {/* Phone No */}
              <FormControl isRequired>
                <FormLabel>Phone No.</FormLabel>
                <Input
                  type="tel"
                  value={editableData.phoneNo || ''}
                  onChange={(e) => handleChange('phoneNo', e.target.value)}
                  h="50px"
                  placeholder="Enter phone number"
                />
              </FormControl>

              {/* Bank Vendor */}
              <FormControl isRequired>
                <FormLabel>Bank Vendor</FormLabel>
                <Select
                  value={editableData.bankVendor || ''}
                  onChange={(e) => handleChange('bankVendor', e.target.value)}
                  h="50px"
                  w="full"
                >
                  <option value="">Select Bank Vendor</option>
                  <option value="ICICI">ICICI</option>
                  <option value="RBC">RBC</option>
                  <option value="CIBC">CIBC</option>
                  <option value="BOM">BOM</option>
                  <option value="Expatrio">Expatrio</option>
                  <option value="Fintiba">Fintiba</option>
                  <option value="TD">TD</option>
                </Select>
              </FormControl>

              {/* Account Opening Date */}
              <FormControl isRequired>
                <FormLabel>Account Opening Date</FormLabel>
                <Input
                  type="date"
                  value={editableData.accOpeningDate ? editableData.accOpeningDate.split('T')[0] : ''}
                  onChange={(e) => handleChange('accOpeningDate', e.target.value)}
                  h="50px"
                  w="full"
                />
              </FormControl>

              {/* Account Opening Month */}
              <FormControl>
                <FormLabel>Account Opening Month</FormLabel>
                <Select
                  value={editableData.accOpeningMonth || ''}
                  onChange={(e) => handleChange('accOpeningMonth', e.target.value)}
                  h="50px"
                  w="full"
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                    return (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>

              {/* Account Funding Month */}
              <FormControl isRequired>
                <FormLabel>Account Funding Month</FormLabel>
                <Select
                  value={editableData.accFundingMonth || ''}
                  onChange={(e) => handleChange('accFundingMonth', e.target.value)}
                  h="50px"
                  w="full"
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                    return (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    );
                  })}
                  <option value="Not Funded Yet">Not Funded Yet</option>
                </Select>
              </FormControl>

              {/* Commission */}
              <FormControl>
                <FormLabel>Commission</FormLabel>
                <NumberInput min={0} h="50px" w="full">
                  <NumberInputField
                    value={editableData.commission || ''}
                    onChange={(e) => handleChange('commission', e.target.value)}
                    h="50px"
                    placeholder="Enter commission amount"
                  />
                </NumberInput>
              </FormControl>

              {/* TDS */}
              <FormControl>
                <FormLabel>TDS</FormLabel>
                <NumberInput min={0} h="50px" w="full">
                  <NumberInputField
                    value={editableData.tds || ''}
                    onChange={(e) => handleChange('tds', e.target.value)}
                    h="50px"
                    placeholder="Enter TDS amount"
                  />
                </NumberInput>
              </FormControl>

              {/* Net Payable */}
              <FormControl>
                <FormLabel>Net Payable</FormLabel>
                <NumberInput min={0} h="50px" w="full">
                  <NumberInputField
                    value={editableData.netPayable || ''}
                    onChange={(e) => handleChange('netPayable', e.target.value)}
                    h="50px"
                    placeholder="Enter net payable amount"
                  />
                </NumberInput>
              </FormControl>

              {/* Commission Status */}
              <FormControl>
                <FormLabel>Commission Status</FormLabel>
                <Select
                  value={editableData.commissionStatus || ''}
                  onChange={(e) => handleChange('commissionStatus', e.target.value)}
                  h="50px"
                  w="full"
                >
                  <option value="">Select Status</option>
                  <option value="Not Received">Not Received</option>
                  <option value="Paid">Paid</option>
                  <option value="Under Processing">Under Processing</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          )}

          {/* Documents Section */}
          <Box mt={8}>
            <Heading size="md" mb={4}>Documents</Heading>
            
            {/* Add Document Button (Edit Mode Only) */}
            {isEditing && (
              <Button
                colorScheme="blue"
                onClick={addDocument}
                mb={4}
                leftIcon={<Icon as={FiUpload} />}
                isDisabled={documents.length >= 4}
              >
                Add Document ({documents.length}/4)
              </Button>
            )}

            {/* Documents List */}
            {documents.map((doc, index) => (
              <Box key={index} mb={4} p={4} borderWidth={1} borderRadius="md" bg={fieldBgColor}>
                {isEditing ? (
                  <>
                    {/* Edit Mode - Form Fields */}
                    <FormControl isRequired mb={2}>
                      <FormLabel>Document Type</FormLabel>
                      <Select
                        placeholder="Select Document Type"
                        value={doc.documentType || ''}
                        onChange={(e) => handleDocumentChange(index, 'documentType', e.target.value)}
                        h="50px"
                      >
                        {documentTypeOptions.map((type) => (
                          <option key={type} value={type}>
                            {type === 'ol' ? 'Offer Letter' : type.toUpperCase()}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl mb={2}>
                      <FormLabel>Upload Document</FormLabel>
                      <Flex align="center">
                        <Button
                          colorScheme="blue"
                          onClick={() => document.getElementById(`documentFile${index}`).click()}
                          mr={2}
                        >
                          Choose File
                        </Button>
                        <Text>
                          {doc.documentFile && typeof doc.documentFile === 'object'
                            ? doc.documentFile.name
                            : doc.documentFile && typeof doc.documentFile === 'string'
                            ? 'File exists - Choose new file to replace'
                            : 'No file chosen'}
                        </Text>
                        <Input
                          type="file"
                          id={`documentFile${index}`}
                          onChange={(e) => handleDocumentChange(index, 'documentFile', e.target.files[0])}
                          hidden
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </Flex>
                    </FormControl>

                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      leftIcon={<Icon as={FiTrash2} />}
                    >
                      Remove Document
                    </Button>
                  </>
                ) : (
                  // View Mode - Display Document Info
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <VStack align="start">
                      <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                        Document Type
                      </Text>
                      <Text fontSize="md" fontWeight="bold" color={valueColor}>
                        {doc.documentType === 'ol' ? 'Offer Letter' : doc.documentType?.toUpperCase() || 'N/A'}
                      </Text>
                    </VStack>
                    <VStack align="start">
                      <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                        File
                      </Text>
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
                        <Text color={labelColor}>No file</Text>
                      )}
                    </VStack>
                  </SimpleGrid>
                )}
              </Box>
            ))}

            {documents.length === 0 && (
              <Box p={4} bg={fieldBgColor} borderRadius="md">
                <Text color={labelColor} textAlign="center">
                  No documents uploaded yet.
                </Text>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default GicView;
