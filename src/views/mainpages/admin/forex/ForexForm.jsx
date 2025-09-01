import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  useToast,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
} from '@chakra-ui/react';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import countries from './csvjson.json';
const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');

function ForexForm() {
  const navigate = useNavigate();
  const [accOpeningDate1, setAccOpeningDate1] = useState(getCurrentDate());
  const [commissionPaymentDate, setCommissionPaymentDate] = useState(null);
  const [formData, setFormData] = useState({
    agentRef: '',
    studentRef: '',
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
  });
  const [passportFile, setPassportFile] = useState(null);
  const [offerLetterFile, setOfferLetterFile] = useState(null);
  const [ttCopyFile, setTtCopyFile] = useState(null);
  const [commissionPaymentProof, setCommissionPaymentProof] = useState(null);
  // const [emaill, setEmail] = useState('');
  // const [students, setStudents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agentSearch, setAgentSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);
  const toast = useToast();
  const [agents, setAgents] = useState([]);

  // useEffect(() => {
  //   const fetchStudents = async () => {
  //     try {
  //       const response = await fetch('https://abroad-backend-gray.vercel.app/auth/getStudent');
  //       const data = await response.json();
  //       if (response.ok) setStudents(data.students);
  //     } catch (error) {
  //       console.error('Error fetching students:', error);
  //     }
  //   };
  //   fetchStudents();
  // }, [isModalOpen]);

  // const handleNewStudentSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch('https://abroad-backend-gray.vercel.app/auth/studentCreate', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(newStudent),
  //     });
  //     const result = await response.json();

  //     if (response.ok) {
  //       setStudents([...students, result.newStudent]);
  //       setFormData({ ...formData, studentRef: result.newStudent._id });
  //       toast({
  //         title: 'Student Created',
  //         description: 'New student has been added.',
  //         status: 'success',
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //       closeModal();
  //       setLoading(false);
  //     } else {
  //       setLoading(false);
  //       throw new Error(result.message || 'Failed to create student.');
  //     }
  //   } catch (error) {
  //     toast({
  //       title: 'Error',
  //       description: error.message,
  //       status: 'error',
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     setLoading(false);
  //   }
  //   setLoading(false);
  // };

  useEffect(() => {
    const fetchAgents = async () => {
      const apiUrl = 'https://abroad-backend-gray.vercel.app/auth/getAllusers';
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();
        if (response.ok) {
          const filterResult = result.data.filter(
            (data) => data.userStatus === 'active',
          );
          setAgents(filterResult);
        } else {
          console.error('Server Error:', result);
        }
      } catch (error) {
        console.error('Network Error:', error);
      }
    };
    fetchAgents();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const validateForm = () => {
    const {
      agentRef,
      studentRef,
      country,
      currencyBooked,
      quotation,
      studentPaid,
      docsStatus,
      ttCopyStatus,
      agentCommission,
      tds,
      netPayable,
      commissionStatus,
    } = formData;
    if (
      !agentRef ||
      !studentRef ||
      !country ||
      !currencyBooked ||
      !quotation ||
      !studentPaid ||
      !docsStatus ||
      !ttCopyStatus ||
      !agentCommission ||
      !tds ||
      !netPayable ||
      !commissionStatus
    ) {
      toast({
        title: 'Form Incomplete',
        description: 'Please fill in all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // console.log('Form Data:', formData);
      // console.log('Passport File:', passportFile);
      // console.log('Offer Letter File:', offerLetterFile);
      // console.log('Documents:', documents);

      if (!validateForm()) {
        // Show error toast for incomplete form
        toast({
          title: 'Form Incomplete',
          description: 'Please fill in all required fields.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      // Step 1: Create a new student
      // const newStudent = {
      //   name: formData.studentRef,
      //   agentRef: formData.agentRef,
      // };

      // const createStudentResponse = await fetch(
      //   'https://abroad-backend-gray.vercel.app/auth/studentCreate',
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(newStudent),
      //   },
      // );

      // const createStudentResult = await createStudentResponse.json();

      // if (!createStudentResponse.ok) {
      //   throw new Error(
      //     createStudentResult.message || 'Failed to create student.',
      //   );
      // }

      // const studentId = createStudentResult.newStudent._id;
      const types = documents.map((doc) => doc.documentType);
      const allTypes = ['Passport', 'Offer_Letter', ...types];
      let uploadedFiles = [];
      let uploadResult = null;

      if (
        passportFile ||
        offerLetterFile ||
        ttCopyFile||
        commissionPaymentProof ||
        documents.length > 0
      ) {
        // Update formData with the new student ID

        // Step 2: Prepare file upload form data
        const fileUploadFormData = new FormData();
        fileUploadFormData.append(
          'folderId',
          '1f8tN2sgd_UBOdxpDwyQ1CMsyVvi1R96f',
        );
        fileUploadFormData.append('studentRef', '6770f8f171c4d7435685d65e');
        fileUploadFormData.append('type', allTypes);

        const files = [
          passportFile,
          offerLetterFile,
          ttCopyFile,
          commissionPaymentProof,
          ...documents.map((doc) => doc.documentFile),
        ].filter(Boolean);

        files.forEach((file) => fileUploadFormData.append('files', file));

        // Upload files
        const uploadResponse = await fetch(
          'https://abroad-backend-gray.vercel.app/api/uploads/upload',
          {
            method: 'POST',
            body: fileUploadFormData,
            headers: { Accept: 'application/json' },
          },
        );

        uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || 'File upload failed.');
        }

        // Extract uploaded file details and map them to documents
        uploadedFiles = uploadResult.uploads
          .map((file, index) => {
            if (index > 1) {
              return {
                documentOf: documents[index - 3]?.documentOf,
                documentType: documents[index - 3]?.documentType,
                fileId: file.fileId,
                documentFile: file.viewLink,
              };
            }
            return null;
          })
          .filter(Boolean);
      }

      let formattedcommissionPaymentDate = format(
        commissionPaymentDate,
        'yyyy-MM-dd',
      );

      // Step 3: Submit the final form data
      const finalFormData = {
        ...formData,
        date: accOpeningDate1,
        commissionPaymentDate: formattedcommissionPaymentDate,
        // studentRef: studentId,
        studentName: formData.studentRef,
        passportFile: {
          fileId: uploadResult?.uploads[0]?.fileId,
          documentFile: uploadResult?.uploads[0]?.viewLink,
        },
        offerLetterFile: {
          fileId: uploadResult?.uploads[1]?.fileId,
          documentFile: uploadResult?.uploads[1]?.viewLink,
        },
        ttCopyFile:{
          fileId: uploadResult?.uploads[2]?.fileId,
          documentFile: uploadResult?.uploads[2]?.viewLink,
        },
        commissionPaymentProof: {
          fileId: uploadResult?.uploads[3]?.fileId,
          documentFile: uploadResult?.uploads[3]?.viewLink,
        },
        documents: uploadedFiles,
      };

      console.log('Final Form Data:', finalFormData);

      const submitFormResponse = await fetch(
        'https://abroad-backend-gray.vercel.app/auth/addForexForm',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalFormData),
        },
      );

      const submitFormResult = await submitFormResponse.json();

      if (!submitFormResponse.ok) {
        throw new Error(
          submitFormResult.message || 'Failed to submit the form.',
        );
      }

      // Show success toast and navigate
      toast({
        title: 'Form Submitted',
        description: 'Your form has been submitted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate(`/admin/forex/${submitFormResult.data._id}`);
    } catch (error) {
      console.error('Error:', error.message);

      // Show error toast
      toast({
        title: 'Submission Error',
        description: `Failed to submit the form: ${error.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const addDocumentField = () => {
    setDocuments([
      ...documents,
      { documentOf: '', documentType: '', documentFile: null },
    ]);
  };

  const removeDocumentField = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  // Filtered agents based on search
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name?.toLowerCase().includes(agentSearch.toLowerCase()) ||
      agent.organisation?.toLowerCase().includes(agentSearch.toLowerCase()),
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.agent-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box
      maxW="100%"
      bg="white"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <form onSubmit={handleSubmit}>
        <SimpleGrid columns={2} spacing={4}>
          <FormControl isRequired>
            <FormLabel>Agent</FormLabel>
            <Box position="relative" className="agent-dropdown-container">
              <Box position="relative">
                <Input
                  type="text"
                  placeholder="Search and select agent by name or organisation"
                  value={agentSearch}
                  onChange={(e) => {
                    setAgentSearch(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  h="50px"
                  w="full"
                  autoComplete="off"
                  pr="40px"
                />
                <Box
                  position="absolute"
                  right="10px"
                  top="50%"
                  transform="translateY(-50%)"
                  cursor="pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  color="blackAlpha.700"
                  fontSize="20px"
                >
                  {isDropdownOpen ? <GoChevronUp /> : <GoChevronDown />}
                </Box>
              </Box>
              {isDropdownOpen && filteredAgents.length > 0 && (
                <Box
                  position="absolute"
                  top="100%"
                  left="0"
                  right="0"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  boxShadow="lg"
                  maxH="200px"
                  overflowY="auto"
                  zIndex="10"
                  mt="2px"
                >
                  {filteredAgents.map((agent) => (
                    <Box
                      key={agent._id}
                      p={3}
                      cursor="pointer"
                      _hover={{ bg: 'gray.100' }}
                      onClick={() => {
                        setFormData({ ...formData, agentRef: agent._id });
                        setAgentSearch(agent.name.toUpperCase());
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text fontWeight="medium">
                        {agent.name.toUpperCase()}
                      </Text>
                      {agent.organization && (
                        <Text fontSize="sm" color="gray.600">
                          {agent.organization}
                        </Text>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={accOpeningDate1}
              onChange={(e) => setAccOpeningDate1(e.target.value)}
              max={getCurrentDate()} // Restrict future dates
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Student Name</FormLabel>
            <Input
              name="studentRef"
              value={formData.studentRef}
              onChange={handleChange}
              h="50px"
              w="full"
              placeholder="Enter student name"
            />
          </FormControl>

          {/* <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={emaill}
              onChange={(e) => setEmail(e.target.value)}
              h="50px"
              w="full"
            />
          </FormControl> */}

          <FormControl isRequired>
            <FormLabel>Currency</FormLabel>
            <Select
              name="country"
              placeholder="Select Currency"
              value={formData.country}
              onChange={handleChange}
              h="50px"
              w="full"
            >
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Currency Booked</FormLabel>
            <Input
              type="text"
              name="currencyBooked"
              value={formData.currencyBooked}
              onChange={handleChange}
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Quotation</FormLabel>
            <NumberInput min={0} h="50px" w="full">
              <NumberInputField
                name="quotation"
                value={formData.quotation}
                placeholder="Number is Accepted"
                onChange={handleChange}
                h="50px"
              />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Student Paid</FormLabel>
            <NumberInput min={0} h="50px" w="full">
              <NumberInputField
                name="studentPaid"
                value={formData.studentPaid}
                onChange={handleChange}
                h="50px"
              />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>DOCs Status</FormLabel>
            <Select
              name="docsStatus"
              value={formData.docsStatus}
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

          <FormControl isRequired>
            <FormLabel>TT Copy Status</FormLabel>
            <Select
              name="ttCopyStatus"
              value={formData.ttCopyStatus}
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

          <FormControl isRequired>
            <FormLabel>Agent Commission</FormLabel>
            <NumberInput min={0} h="50px" w="full">
              <NumberInputField
                name="agentCommission"
                value={formData.agentCommission}
                onChange={handleChange}
                h="50px"
              />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Commission Payment Date</FormLabel>
            <Input
              type="date"
              value={commissionPaymentDate}
              onChange={(e) => setCommissionPaymentDate(e.target.value)}
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>TDS</FormLabel>
            <NumberInput min={0} h="50px" w="full">
              <NumberInputField
                name="tds"
                value={formData.tds}
                onChange={handleChange}
                h="50px"
              />
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel>AE Commission</FormLabel>
            <Input
              type="text"
              name="aecommission"
              value={formData.aecommission}
              onChange={handleChange}
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Net Payable</FormLabel>
            <NumberInput min={0} h="50px" w="full">
              <NumberInputField
                name="netPayable"
                value={formData.netPayable}
                onChange={handleChange}
                h="50px"
              />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Commission Status</FormLabel>
            <Select
              name="commissionStatus"
              placeholder="Select Status"
              value={formData.commissionStatus}
              onChange={handleChange}
              h="50px"
              w="full"
            >
              <option value="Not Received">Not Received</option>
              <option value="Paid">Paid</option>
              <option value="Under Processing">Under Processing</option>
            </Select>
          </FormControl>
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
              <Text>{passportFile ? passportFile.name : 'No file chosen'}</Text>
              <Input
                type="file"
                id="passportFile"
                name="passportFile"
                onChange={(e) => handleFileChangeoffpass(e, setPassportFile)}
                hidden
              />
            </Flex>
          </FormControl>

          <FormControl>
            <FormLabel>Offer Letter</FormLabel>
            <Flex align="center">
              <Button
                colorScheme="blue"
                onClick={() =>
                  document.getElementById('offerLetterFile').click()
                }
                mr={2}
              >
                Choose File
              </Button>
              <Text>
                {offerLetterFile ? offerLetterFile.name : 'No file chosen'}
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
          <FormControl>
            <FormLabel>TT Copy File</FormLabel>
            <Flex align="center">
              <Button
                colorScheme="blue"
                onClick={() =>
                  document.getElementById('ttCopyFile').click()
                }
                mr={2}
              >
                Choose File
              </Button>
              <Text>
                {ttCopyFile ? ttCopyFile.name : 'No file chosen'}
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
          <FormControl>
            <FormLabel>Commission Payment Proof</FormLabel>
            <Flex align="center">
              <Button
                colorScheme="blue"
                onClick={() =>
                  document.getElementById('commissionPaymentProof').click()
                }
                mr={2}
              >
                Choose File
              </Button>
              <Text>
                {commissionPaymentProof
                  ? commissionPaymentProof.name
                  : 'No file chosen'}
              </Text>
              <Input
                type="file"
                id="commissionPaymentProof"
                name="commissionPaymentProof"
                onChange={(e) =>
                  handleFileChangeoffpass(e, setCommissionPaymentProof)
                }
                hidden
              />
            </Flex>
          </FormControl>
        </SimpleGrid>

        <Box mt={4}>
          <FormLabel>Documents</FormLabel>
          {documents.map((doc, index) => (
            <Box key={index} mb={4} p={4} borderWidth={1} borderRadius="md">
              <FormControl isRequired>
                <FormLabel>Document of</FormLabel>
                <Select
                  name="documentOf"
                  placeholder="Select Relation"
                  value={doc.documentOf}
                  onChange={(e) =>
                    handleDocumentChange(index, 'documentOf', e.target.value)
                  }
                >
                  {whoOptions.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired mt={2}>
                <FormLabel>Document Type</FormLabel>
                <Select
                  name="documentType"
                  placeholder="Select Document Type"
                  value={doc.documentType}
                  onChange={(e) =>
                    handleDocumentChange(index, 'documentType', e.target.value)
                  }
                >
                  {documentOptions.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={2}>
                <FormLabel>Upload Document</FormLabel>
                <Flex align="center">
                  <Button
                    colorScheme="blue"
                    onClick={() =>
                      document.getElementById(`documentFile${index}`).click()
                    }
                    mr={2}
                  >
                    Choose File
                  </Button>
                  <Text>
                    {doc.documentFile
                      ? doc.documentFile.name
                      : 'No file chosen'}
                  </Text>
                  <Input
                    type="file"
                    id={`documentFile${index}`}
                    onChange={(e) =>
                      handleFileChange(index, 'documentFile', e.target.files[0])
                    }
                    hidden
                  />
                </Flex>
              </FormControl>

              <Button
                colorScheme="red"
                mt={2}
                onClick={() => removeDocumentField(index)}
              >
                Remove Document
              </Button>
            </Box>
          ))}

          <Button colorScheme="blue" mt={2} onClick={addDocumentField}>
            Add Document
          </Button>
        </Box>

        {/* <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Student</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Agents</FormLabel>
                <Select
                  name="agentRef"
                  value={newStudent.agentRef}
                  onChange={handleNewStudentChange}
                  h="50px"
                  w="full"
                  mb={'15px'}
                  placeholder="Select an agent"
                >
                  {agents.map((agents) => (
                    <option key={agents._id} value={agents._id}>
                      {agents.agentCode}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={newStudent.name}
                  onChange={handleNewStudentChange}
                  placeholder="Enter student name"
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  value={newStudent.email}
                  onChange={handleNewStudentChange}
                  placeholder="Enter student email"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              {loading ? (
                <Spinner mr={5} />
              ) : (
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={handleNewStudentSubmit}
                >
                  Submit
                </Button>
              )}
              <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal> */}

        {loading ? (
          <Button colorScheme="brand" width="full" mt={6} h="50px">
            <Spinner />
          </Button>
        ) : (
          <Button
            type="submit"
            colorScheme="brand"
            width="full"
            mt={6}
            h="50px"
          >
            Submit
          </Button>
        )}
      </form>
    </Box>
  );
}

export default ForexForm;
