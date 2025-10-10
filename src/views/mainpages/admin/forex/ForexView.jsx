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
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  useToast,
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
  FiUpload,
  FiTrash2,
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
  commissionPaymentDate: FiFileText,
  remarks: FiFileText,
  passportFile: FiFile,
  offerLetterFile: FiFile,
  ttCopyFile:FiFile,
};

function ForexView() {
  const { id } = useParams();
  const toast = useToast();
  const [formData, setFormData] = useState({});
  const [editableData, setEditableData] = useState({
    agentRef: '',
    studentRef: '',
    studentName: '',
    date: '',
    country: '',
    currencyBooked: '',
    quotation: '',
    studentPaid: '',
    docsStatus: '',
    ttCopyStatus: '',
    agentCommission: '',
    tds: '',
    netPayable: '',
    commissionStatus: '',
    aecommission: '',
    remarks: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // File upload states to match ForexForm
  const [passportFile, setPassportFile] = useState(null);
  const [offerLetterFile, setOfferLetterFile] = useState(null);
  const [ttCopyFile, setTtCopyFile] = useState(null);
  const [commissionPaymentProof, setCommissionPaymentProof] = useState(null);
  const [commissionPaymentDate, setCommissionPaymentDate] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Options to match ForexForm
  const whoOptions = [
    'Self',
    'Brother',
    'Sister', 
    'Husband',
    'Father',
    'Mother',
    'Grand Father',
    'Grand Mother',
  ];
  
  const documentOptions = [
    'Aadhar',
    'Pan',
    'Account statement',
    'Passbook Front',
    'Cheque Copy',
  ];

  useEffect(() => {
    // Change from viewAllForexForms to specific forex endpoint
    axios
      .get(`https://abroad-backend-gray.vercel.app/auth/getForexForm/${id}`)
      .then((response) => {
        if (response.data.success) {
          const formData1 = response.data.forexForm; // Single form, not array
          if (formData1) {
            setFormData(formData1);
            // Initialize editableData with all form fields
            setEditableData({
              agentRef: formData1.agentRef?._id || formData1.agentRef || '',
              studentRef: formData1.studentRef?._id || formData1.studentRef || '',
              studentName: formData1.studentName || '',
              date: formData1.date || '',
              country: formData1.country || '',
              currencyBooked: formData1.currencyBooked || '',
              quotation: formData1.quotation || '',
              studentPaid: formData1.studentPaid || '',
              docsStatus: formData1.docsStatus || '',
              ttCopyStatus: formData1.ttCopyStatus || '',
              agentCommission: formData1.agentCommission || '',
              tds: formData1.tds || '',
              netPayable: formData1.netPayable || '',
              commissionStatus: formData1.commissionStatus || '',
              aecommission: formData1.aecommission || '',
              remarks: formData1.remarks || '',
            });
            
            // Initialize file states and commission payment date
            setCommissionPaymentDate(formData1.commissionPaymentDate || null);
            setDocuments(formData1.documents || []);
            
          } else {
            console.error('Form data not found for ID:', id);
          }
        } else {
          console.error('Request was not successful:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching forex data:', error);
      });
  }, [id]);

  // Form handlers to match ForexForm
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData({ ...editableData, [name]: value });
  };

  const handleDocumentChange = (index, name, value) => {
    const updatedDocuments = documents.map((doc, i) =>
      i === index ? { ...doc, [name]: value } : doc,
    );
    setDocuments(updatedDocuments);
  };

  const handleFileChange = (index, fileType, file) => {
    const updatedDocuments = documents.map((doc, i) =>
      i === index ? { ...doc, [fileType]: file } : doc,
    );
    setDocuments(updatedDocuments);
  };

  const handleFileChangeoffpass = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      { documentOf: '', documentType: '', documentFile: null },
    ]);
  };

  const removeDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let updatedFormData = { ...editableData };
      
      // Add commission payment date if exists
      if (commissionPaymentDate) {
        updatedFormData.commissionPaymentDate = commissionPaymentDate;
      }

      // Step 1: Upload individual files first and get their URLs
      if (passportFile && typeof passportFile === 'object') {
        const passportFormData = new FormData();
        passportFormData.append('file', passportFile);
        
        const passportResponse = await axios.post(
          'https://abroad-backend-gray.vercel.app/upload/upload',
          passportFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        if (passportResponse.data.success) {
          updatedFormData.passportFile = {
            fileId: passportResponse.data.fileId,
            documentFile: passportResponse.data.fileUrl
          };
        }
      }

      if (offerLetterFile && typeof offerLetterFile === 'object') {
        const offerFormData = new FormData();
        offerFormData.append('file', offerLetterFile);
        
        const offerResponse = await axios.post(
          'https://abroad-backend-gray.vercel.app/upload/upload',
          offerFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        if (offerResponse.data.success) {
          updatedFormData.offerLetterFile = {
            fileId: offerResponse.data.fileId,
            documentFile: offerResponse.data.fileUrl
          };
        }
      }

      if (ttCopyFile && typeof ttCopyFile === 'object') {
        const ttFormData = new FormData();
        ttFormData.append('file', ttCopyFile);
        
        const ttResponse = await axios.post(
          'https://abroad-backend-gray.vercel.app/upload/upload',
          ttFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        if (ttResponse.data.success) {
          updatedFormData.ttCopyFile = {
            fileId: ttResponse.data.fileId,
            documentFile: ttResponse.data.fileUrl
          };
        }
      }

      if (commissionPaymentProof && typeof commissionPaymentProof === 'object') {
        const proofFormData = new FormData();
        proofFormData.append('file', commissionPaymentProof);
        
        const proofResponse = await axios.post(
          'https://abroad-backend-gray.vercel.app/upload/upload',
          proofFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        if (proofResponse.data.success) {
          updatedFormData.commissionPaymentProof = {
            fileId: proofResponse.data.fileId,
            documentFile: proofResponse.data.fileUrl
          };
        }
      }

      // Step 2: Upload document files and prepare documents array
      const updatedDocuments = [];
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        let documentData = {
          documentOf: doc.documentOf,
          documentType: doc.documentType,
          fileId: doc.fileId || '',
          documentFile: doc.documentFile
        };

        // If there's a new file to upload
        if (doc.documentFile && typeof doc.documentFile === 'object') {
          const docFormData = new FormData();
          docFormData.append('file', doc.documentFile);
          
          const docResponse = await axios.post(
            'https://abroad-backend-gray.vercel.app/upload/upload',
            docFormData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          
          if (docResponse.data.success) {
            documentData.fileId = docResponse.data.fileId;
            documentData.documentFile = docResponse.data.fileUrl;
          }
        }
        
        updatedDocuments.push(documentData);
      }
      
      updatedFormData.documents = updatedDocuments;

      // Clean up empty ObjectId fields before sending to backend
      const cleanedFormData = { ...updatedFormData };
      
      // Remove empty string ObjectId fields to prevent CastError
      if (cleanedFormData.studentRef === '' || cleanedFormData.studentRef === null) {
        delete cleanedFormData.studentRef;
      }
      if (cleanedFormData.agentRef === '' || cleanedFormData.agentRef === null) {
        delete cleanedFormData.agentRef;
      }
      
      // Remove empty string fields to avoid overwriting existing data
      Object.keys(cleanedFormData).forEach(key => {
        if (cleanedFormData[key] === '' || cleanedFormData[key] === null || cleanedFormData[key] === undefined) {
          delete cleanedFormData[key];
        }
      });

      console.log('Sending cleaned data to backend:', cleanedFormData);

      // Step 3: Send the form data with file URLs to backend
      const response = await axios.put(
        `https://abroad-backend-gray.vercel.app/auth/updateForexForm/${id}`,
        cleanedFormData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      if (response.data.success) {
        setFormData(response.data.data);
        setIsEditing(false);
        toast({
          title: 'Success',
          description: 'Forex form updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating Forex form:', error);
      toast({
        title: 'Error', 
        description: 'Error updating Forex form. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
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
          isDisabled={loading}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        {isEditing && (
          <Button 
            ml={4} 
            colorScheme="blue" 
            onClick={handleSave}
            isLoading={loading}
            loadingText="Updating..."
          >
            Update
          </Button>
        )}
      </Flex>

      {Object.keys(formData).length > 0 && (
        <>
          {!isEditing ? (
            // View Mode - Display existing structure
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Agent Name */}
              {formData.agentRef && (
                <VStack align="start" spacing={2} w="full">
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                    Agent Name
                  </Text>
                  <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                    <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                      {formData.agentRef.name ? formData.agentRef.name.toUpperCase() : 'N/A'}
                    </Text>
                  </Box>
                </VStack>
              )}

              {/* Student Name */}
              <VStack align="start" spacing={2} w="full">
                <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                  Student Name
                </Text>
                <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                  <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                    {formData.studentName || 'N/A'}
                  </Text>
                </Box>
              </VStack>

              {/* Display all other fields */}
              {[
                { key: 'country', label: 'Country' },
                { key: 'currencyBooked', label: 'Currency Booked' },
                { key: 'quotation', label: 'Quotation' },
                { key: 'studentPaid', label: 'Student Paid' },
                { key: 'docsStatus', label: 'DOCs Status' },
                { key: 'ttCopyStatus', label: 'TT Copy Status' },
                { key: 'agentCommission', label: 'Agent Commission' },
                { key: 'commissionPaymentDate', label: 'Commission Payment Date' },
                { key: 'tds', label: 'TDS' },
                { key: 'aecommission', label: 'AE Commission' },
                { key: 'netPayable', label: 'Net Payable' },
                { key: 'commissionStatus', label: 'Commission Status' },
                { key: 'remarks', label: 'Remarks' },
              ].map(({ key, label }) => (
                <VStack key={key} align="start" spacing={2} w="full">
                  <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                    {label}
                  </Text>
                  <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                    <Text fontSize="lg" fontWeight="bold" color={valueColor}>
                      {key === 'commissionPaymentDate' && formData[key]
                        ? new Date(formData[key]).toLocaleDateString('en-GB')
                        : formData[key] || 'Not Set'}
                    </Text>
                  </Box>
                </VStack>
              ))}

              {/* File Links */}
              {['passportFile', 'offerLetterFile', 'ttCopyFile', 'commissionPaymentProof'].map((fileKey) => 
                formData[fileKey] && (
                  <VStack key={fileKey} align="start" spacing={2} w="full">
                    <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                      {fileKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Text>
                    <Box p={4} bg={fieldBgColor} borderRadius="md" width="full">
                      <Link
                        href={formData[fileKey].documentFile || formData[fileKey]}
                        color="blue.500"
                        fontWeight="bold"
                        isExternal
                      >
                        View File 👁️
                      </Link>
                    </Box>
                  </VStack>
                )
              )}
            </SimpleGrid>
          ) : (
            // Edit Mode - ForexForm structure
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Date */}
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  name="date"
                  value={editableData.date ? editableData.date.split('T')[0] : ''}
                  onChange={handleChange}
                  h="50px"
                  w="full"
                />
              </FormControl>

              {/* Student Name */}
              <FormControl isRequired>
                <FormLabel>Student Name</FormLabel>
                <Input
                  name="studentName"
                  value={editableData.studentName || formData.studentName || ''}
                  onChange={handleChange}
                  h="50px"
                  placeholder="Enter student name"
                />
              </FormControl>

              {/* Country */}
              <FormControl isRequired>
                <FormLabel>Country</FormLabel>
                <Input
                  name="country"
                  value={editableData.country}
                  onChange={handleChange}
                  h="50px"
                  placeholder="Enter country"
                />
              </FormControl>

              {/* Currency Booked */}
              <FormControl isRequired>
                <FormLabel>Currency Booked</FormLabel>
                <Input
                  name="currencyBooked"
                  value={editableData.currencyBooked}
                  onChange={handleChange}
                  h="50px"
                  placeholder="Enter currency amount"
                />
              </FormControl>

              {/* Quotation */}
              <FormControl isRequired>
                <FormLabel>Quotation</FormLabel>
                <NumberInput min={0} h="50px" w="full">
                  <NumberInputField
                    name="quotation"
                    value={editableData.quotation}
                    placeholder="Number is Accepted"
                    onChange={handleChange}
                    h="50px"
                  />
                </NumberInput>
              </FormControl>

              {/* Student Paid */}
              <FormControl isRequired>
                <FormLabel>Student Paid</FormLabel>
                <NumberInput min={0} h="50px" w="full">
                  <NumberInputField
                    name="studentPaid"
                    value={editableData.studentPaid}
                    onChange={handleChange}
                    h="50px"
                  />
                </NumberInput>
              </FormControl>

              {/* DOCs Status */}
              <FormControl isRequired>
                <FormLabel>DOCs Status</FormLabel>
                <Select
                  name="docsStatus"
                  value={editableData.docsStatus}
                  onChange={handleChange}
                  h="50px"
                  w="full"
                >
                  <option value="">Select an option</option>
                  <option value="Pending">Pending</option>
                  <option value="Received">Received</option>
                  <option value="Verified">Verified</option>
                </Select>
              </FormControl>

              {/* TT Copy Status */}
              <FormControl isRequired>
                <FormLabel>TT Copy Status</FormLabel>
                <Select
                  name="ttCopyStatus"
                  value={editableData.ttCopyStatus}
                  onChange={handleChange}
                  h="50px"
                  w="full"
                >
                  <option value="">Select an option</option>
                  <option value="Pending">Pending</option>
                  <option value="Received">Received</option>
                  <option value="Verified">Verified</option>
                </Select>
              </FormControl>

              {/* Agent Commission */}
              <FormControl isRequired>
                <FormLabel>Agent Commission</FormLabel>
                <NumberInput min={0} h="50px" w="full">
                  <NumberInputField
                    name="agentCommission"
                    value={editableData.agentCommission}
                    onChange={handleChange}
                    h="50px"
                  />
                </NumberInput>
              </FormControl>

              {/* Commission Payment Date */}
              <FormControl>
                <FormLabel>Commission Payment Date</FormLabel>
                <Input
                  type="date"
                  value={commissionPaymentDate ? commissionPaymentDate.split('T')[0] : ''}
                  onChange={(e) => setCommissionPaymentDate(e.target.value)}
                  h="50px"
                  w="full"
                />
              </FormControl>

              {/* TDS */}
              <FormControl isRequired>
                <FormLabel>TDS</FormLabel>
                <NumberInput min={0} h="50px" w="full">
                  <NumberInputField
                    name="tds"
                    value={editableData.tds}
                    onChange={handleChange}
                    h="50px"
                  />
                </NumberInput>
              </FormControl>

              {/* AE Commission */}
              <FormControl>
                <FormLabel>AE Commission</FormLabel>
                <NumberInput min={0} h="50px" w="full">
                  <NumberInputField
                    name="aecommission"
                    value={editableData.aecommission}
                    onChange={handleChange}
                    h="50px"
                  />
                </NumberInput>
              </FormControl>

              {/* Net Payable */}
              <FormControl isRequired>
                <FormLabel>Net Payable</FormLabel>
                <NumberInput min={0} h="50px" w="full">
                  <NumberInputField
                    name="netPayable"
                    value={editableData.netPayable}
                    onChange={handleChange}
                    h="50px"
                  />
                </NumberInput>
              </FormControl>

              {/* Commission Status */}
              <FormControl isRequired>
                <FormLabel>Commission Status</FormLabel>
                <Select
                  name="commissionStatus"
                  placeholder="Select Status"
                  value={editableData.commissionStatus}
                  onChange={handleChange}
                  h="50px"
                  w="full"
                >
                  <option value="Non Claimable">Non Claimable</option>
                  <option value="Paid">Paid</option>
                  <option value="Under Processing">Under Processing</option>
                </Select>
              </FormControl>

              {/* Remarks */}
              <FormControl>
                <FormLabel>Remarks</FormLabel>
                <Input
                  name="remarks"
                  placeholder="Enter any remarks or notes"
                  value={editableData.remarks}
                  onChange={handleChange}
                  h="50px"
                  w="full"
                />
              </FormControl>

              {/* File Upload Sections */}
              
              {/* Passport */}
              <FormControl>
                <FormLabel>Passport</FormLabel>
                <Flex align="center">
                  <Button
                    colorScheme="blue"
                    onClick={() => document.getElementById('passportFile').click()}
                    mr={2}
                  >
                    Choose File
                  </Button>
                  <Text>{passportFile ? passportFile.name : (formData.passportFile ? 'File exists - Choose new file to replace' : 'No file chosen')}</Text>
                  <Input
                    type="file"
                    id="passportFile"
                    name="passportFile"
                    onChange={(e) => handleFileChangeoffpass(e, setPassportFile)}
                    hidden
                  />
                </Flex>
              </FormControl>

              {/* Offer Letter */}
              <FormControl>
                <FormLabel>Offer Letter</FormLabel>
                <Flex align="center">
                  <Button
                    colorScheme="blue"
                    onClick={() => document.getElementById('offerLetterFile').click()}
                    mr={2}
                  >
                    Choose File
                  </Button>
                  <Text>
                    {offerLetterFile ? offerLetterFile.name : (formData.offerLetterFile ? 'File exists - Choose new file to replace' : 'No file chosen')}
                  </Text>
                  <Input
                    type="file"
                    id="offerLetterFile"
                    name="offerLetterFile"
                    onChange={(e) => handleFileChangeoffpass(e, setOfferLetterFile)}
                    hidden
                  />
                </Flex>
              </FormControl>

              {/* TT Copy File */}
              <FormControl>
                <FormLabel>TT Copy File</FormLabel>
                <Flex align="center">
                  <Button
                    colorScheme="blue"
                    onClick={() => document.getElementById('ttCopyFile').click()}
                    mr={2}
                  >
                    Choose File
                  </Button>
                  <Text>
                    {ttCopyFile ? ttCopyFile.name : (formData.ttCopyFile ? 'File exists - Choose new file to replace' : 'No file chosen')}
                  </Text>
                  <Input
                    type="file"
                    id="ttCopyFile"
                    name="ttCopyFile"
                    onChange={(e) => handleFileChangeoffpass(e, setTtCopyFile)}
                    hidden
                  />
                </Flex>
              </FormControl>

              {/* Commission Payment Proof */}
              <FormControl>
                <FormLabel>Commission Payment Proof</FormLabel>
                <Flex align="center">
                  <Button
                    colorScheme="blue"
                    onClick={() => document.getElementById('commissionPaymentProof').click()}
                    mr={2}
                  >
                    Choose File
                  </Button>
                  <Text>
                    {commissionPaymentProof
                      ? commissionPaymentProof.name
                      : (formData.commissionPaymentProof ? 'File exists - Choose new file to replace' : 'No file chosen')}
                  </Text>
                  <Input
                    type="file"
                    id="commissionPaymentProof"
                    name="commissionPaymentProof"
                    onChange={(e) => handleFileChangeoffpass(e, setCommissionPaymentProof)}
                    hidden
                  />
                </Flex>
              </FormControl>
            </SimpleGrid>
          )}

          {/* Documents Section */}
          <Box mt={8}>
            <FormLabel fontSize="lg" fontWeight="bold">Documents</FormLabel>
            
            {/* Add Document Button (Edit Mode Only) */}
            {isEditing && (
              <Button
                colorScheme="blue"
                onClick={addDocument}
                mb={4}
                leftIcon={<Icon as={FiUpload} />}
              >
                Add Document
              </Button>
            )}

            {/* Documents List */}
            {documents.map((doc, index) => (
              <Box key={index} mb={4} p={4} borderWidth={1} borderRadius="md" bg={fieldBgColor}>
                {isEditing ? (
                  <>
                    {/* Edit Mode - Form Fields */}
                    <FormControl isRequired mb={2}>
                      <FormLabel>Document of</FormLabel>
                      <Select
                        placeholder="Select Relation"
                        value={doc.documentOf || ''}
                        onChange={(e) => handleDocumentChange(index, 'documentOf', e.target.value)}
                      >
                        {whoOptions.map((option, i) => (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired mb={2}>
                      <FormLabel>Document Type</FormLabel>
                      <Select
                        placeholder="Select Document Type"
                        value={doc.documentType || ''}
                        onChange={(e) => handleDocumentChange(index, 'documentType', e.target.value)}
                      >
                        {documentOptions.map((option, i) => (
                          <option key={i} value={option}>
                            {option}
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
                          onChange={(e) => handleFileChange(index, 'documentFile', e.target.files[0])}
                          hidden
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
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <VStack align="start">
                      <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                        Document Of
                      </Text>
                      <Text fontSize="md" fontWeight="bold" color={valueColor}>
                        {doc.documentOf || 'N/A'}
                      </Text>
                    </VStack>
                    <VStack align="start">
                      <Text fontSize="sm" fontWeight="medium" color={labelColor}>
                        Document Type
                      </Text>
                      <Text fontSize="md" fontWeight="bold" color={valueColor}>
                        {doc.documentType || 'N/A'}
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

export default ForexView;
