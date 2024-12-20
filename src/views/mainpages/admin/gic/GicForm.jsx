import React, { useEffect, useState } from 'react';
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
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';

const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');
const getCurrentMonth = () => format(new Date(), 'MMMM');

function GicForm() {
  const [agents, setAgents] = useState([]);
  const [view, setView] = useState('');
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [formData, setFormData] = useState({
    Agents: '',
    studentRef: '',

    passportNo: '',
    email: '',
    phoneNo: '',
    bankVendor: '',
    accFundingMonth: '',
    commission: '',
    tds: '',
    netPayable: '',
    commissionStatus: '',
    documentType: '',
    documentFile: null,
  });
  const toast = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:4000/auth/getStudent');
        const data = await response.json();
        if (response.ok) setStudents(data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [isModalOpen]);

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleNewStudentSubmit = async () => {
    setLoading(true);
    if (!newStudent.name || !newStudent.email) {
      toast({
        title: 'Incomplete Details',
        description: 'Please fill in both Name and Email.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/auth/studentCreate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      const result = await response.json();

      if (response.ok) {
        setStudents([...students, result.newStudent]);
        setFormData({ ...formData, studentRef: result.newStudent._id });
        toast({
          title: 'Student Created',
          description: 'New student has been added.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        closeModal();
        setLoading(false);
      } else {
        setLoading(false);
        throw new Error(result.message || 'Failed to create student.');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchAgents = async () => {
      const apiUrl = 'http://localhost:4000/auth/getAllusers';
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();
        if (response.ok) {
          setAgents(result.data);
        } else {
          console.error('Server Error:', result);
        }
      } catch (error) {
        console.error('Network Error:', error);
      }
    };
    fetchAgents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const {
      Agents,
      studentRef,
      passportNo,
      email,
      phoneNo,
      bankVendor,
      accFundingMonth,
      commission,
      tds,
      netPayable,
      commissionStatus,
      documentType,
      documentFile,
    } = formData;
    if (
      !Agents ||
      !studentRef ||
      !passportNo ||
      !email ||
      !phoneNo ||
      !bankVendor ||
      !accFundingMonth ||
      !commission ||
      !tds ||
      !netPayable ||
      !commissionStatus ||
      !documentType ||
      !documentFile
    ) {
      toast({
        title: 'Form Incomplete',
        description: 'Please fill in all fields, including document upload.',
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

    if (validateForm()) {
      const { documentFile, documentType, studentRef } = formData;
      const fileExtension = documentFile.name.split('.').pop();

      // Prepare form data for API submission
      const formDataToSend = {
        studentRef: formData.studentRef,
        commissionAmt: formData.commission,
        fundingMonth: formData.accFundingMonth,
        tds: formData.tds,
        netPayable: formData.netPayable,
        commissionStatus: formData.commissionStatus,
        agentRef: formData.Agents,
        accOpeningMonth: getCurrentMonth(),
        bankVendor: formData.bankVendor,
        studentEmail: formData.email,
        studentPhoneNo: formData.phoneNo,
        studentPassportNo: formData.passportNo,
        studentDocuments: {}, // Initialize an empty object for documents
      };

      const filedata = new FormData();
      filedata.append('files', documentFile);
      filedata.append('type', documentType);
      filedata.append('agentCode', formData.Agents);
      filedata.append('folderId', '1WkdyWmBhKQAI6W_M4LNLbPylZoGZ7y6V');

      try {
        const response = await fetch(
          'http://localhost:4000/api/uploads/upload',
          {
            method: 'POST',
            body: filedata,
            headers: {
              Accept: 'application/json',
            },
          },
        );

        const result = await response.json();
        const viewLink = result.uploads[0].fileId; // Adjust based on your API response structure
        console.log(viewLink);

        console.log('Server Response:', result);

        // Include the view link in the form data
        formDataToSend.studentDocuments[documentType] = viewLink;
      } catch (error) {
        console.error('Error uploading files:', error);
        toast({
          title: 'File Upload Error',
          description: 'An error occurred while uploading the file.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return; // Stop further execution if file upload fails
      }

      const apiUrl = 'http://localhost:4000/auth/addGicForm';
      console.log('Form Data to Send:', formDataToSend);

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataToSend),
        });

        const result = await response.json();

        if (response.ok) {
          toast({
            title: 'Form Submitted',
            description: 'Your data has been submitted successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          console.log('Server Response:', result);
          Navigate(`/admin/gic/${result.newGIC._id}`);
          setLoading(false);
        } else {
          toast({
            title: 'Submission Failed',
            description:
              result.message || 'An error occurred during submission.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          console.error('Server Error:', result);
          setLoading(false);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Unable to submit form. Please try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        console.error('Network Error:', error);
      }
      setLoading(false);
    }
    setLoading(false);
  };

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
            <FormLabel>Agents</FormLabel>
            <Select
              name="Agents"
              value={formData.Agents}
              onChange={handleChange}
              h="50px"
              w="full"
              placeholder="Select an agent"
            >
              {agents.map((agents) => (
                <option key={agents._id} value={agents._id}>
                  {agents.agentCode}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel>Acc Opening Date</FormLabel>
            <Input
              type="text"
              value={getCurrentDate()}
              readOnly
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Student Name</FormLabel>
            <Select
              name="studentRef"
              value={formData.studentRef}
              onChange={(e) => {
                if (e.target.value === 'create') {
                  openModal();
                } else {
                  handleChange(e);
                }
              }}
              h="50px"
              w="full"
              placeholder="Select a student"
            >
              {students.map((student) => (
                <option key={student?._id} value={student?._id}>
                  {`${student?.studentCode} - ${student?.name} - ${student?.email}`}
                </option>
              ))}
              <option value="create">Create New student</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Passport No.</FormLabel>
            <Input
              type="text"
              name="passportNo"
              value={formData.passportNo}
              onChange={handleChange}
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone No.</FormLabel>
            <Input
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Bank Vendor</FormLabel>
            <Select
              name="bankVendor"
              placeholder="Select Bank Vendor"
              value={formData.bankVendor}
              onChange={handleChange}
              h="50px"
              w="full"
            >
              <option value="ICICI">ICICI</option>
              <option value="RBC">RBC</option>
              <option value="CIBC">CIBC</option>
              <option value="BOM">BOM</option>
              <option value="TD">TD</option>
            </Select>
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel>Acc Opening Month</FormLabel>
            <Input
              type="text"
              value={getCurrentMonth()}
              readOnly
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Acc Funding Month</FormLabel>
            <Select
              name="accFundingMonth"
              placeholder="Select Month"
              value={formData.accFundingMonth}
              onChange={handleChange}
              h="50px"
              w="full"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={format(new Date(0, i), 'MMMM')}>
                  {format(new Date(0, i), 'MMMM')}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Commission</FormLabel>
            <NumberInput min={0} h="50px" w="full">
              <NumberInputField
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                h="50px"
              />
            </NumberInput>
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

          <FormControl
            isRequired
            gridColumn={formData.documentType ? 'span 1' : 'span 2'}
          >
            <FormLabel>Document Type</FormLabel>
            <Select
              name="documentType"
              placeholder="Select Document Type"
              value={formData.documentType}
              onChange={handleChange}
              h="50px"
              w="full"
            >
              <option value="aadhar">Adhaar</option>
              <option value="pan">Pan</option>
              <option value="ol">Offer Letter</option>
              <option value="passport">Passport</option>
            </Select>
          </FormControl>

          {formData.documentType && (
            <FormControl isRequired>
              <FormLabel>Upload Document</FormLabel>
              <Flex align="center">
                <Button
                  colorScheme="blue"
                  onClick={() =>
                    document.getElementById('documentFile').click()
                  }
                  mr={2}
                >
                  Choose File
                </Button>
                <Text>
                  {formData.documentFile
                    ? formData.documentFile.name
                    : 'No file chosen'}
                </Text>
                <Input
                  type="file"
                  name="documentFile"
                  id="documentFile"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  hidden
                />
              </Flex>
            </FormControl>
          )}
        </SimpleGrid>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Student</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
        </Modal>

        {loading ? (
          <Button colorScheme="brand" width="full" mt={4} h="50px">
            <Spinner />
          </Button>
        ) : (
          <Button
            type="submit"
            colorScheme="brand"
            width="full"
            mt={4}
            h="50px"
            disabled={loading}
          >
            Submit
          </Button>
        )}
      </form>
    </Box>
  );
}

export default GicForm;
