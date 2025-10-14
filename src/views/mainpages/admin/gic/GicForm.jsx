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
  Spinner,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Gic } from 'views/mainpages/redux/GicSlice';
import { GoChevronDown , GoChevronUp  } from "react-icons/go";

const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');
const getCurrentMonth = () => format(new Date(), 'MMMM');

function GicForm() {
  const dispatch = useDispatch();
  // const { gic, error } = useSelector((state) => state.Gic);
  const [agents, setAgents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [agentSearch, setAgentSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [accOpeningDate1, setAccOpeningDate1] = useState(getCurrentDate());
  const [accOpeningMonth, setAccOpeningMonth] = useState(getCurrentMonth());

  const documentTypeOptions = ['aadhar', 'pan', 'ol', 'passport'];

  const addDocuments = () => {
    setDocuments([
      ...documents,
      {
        documentType: '',
        documentFile: null,
      },
    ]);
  };

  const removeDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  const handleChangeDocument = (e, index) => {
    const { name, value, files } = e.target;
    const updatedDocuments = [...documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [name]: files ? files[0] : value,
    };
    setDocuments(updatedDocuments);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(Gic()); // Dispatch the async thunk to fetch data
  }, [dispatch]);

  const [formData, setFormData] = useState({
    type: '',
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
  });
  const toast = useToast();
  // const handleNewStudentSubmit = async () => {
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

  // useEffect(() => {
  //   const GIC = gic && gic.length > 0 ? gic.find((gic) => gic.studentPassportNo === formData.passportNo) : null;

  //   if (GIC) {
  //     setFormData({

  //     });

  //   }
  // }, [formData.passportNo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const {
      type,
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
    } = formData;
    if (!type || !Agents || !studentRef || !passportNo || !email) {
      toast({
        title: 'Form Incomplete',
        description: 'Please fill in all required fields.',
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
      // const { documentFile, documentType } = formData;

      const newStudent = {
        name: formData.studentRef,
        email: formData.email,
        agentRef: formData.Agents,
      };

      try {
        const response = await fetch(
          'https://abroad-backend-gray.vercel.app/auth/studentCreate',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent),
          },
        );
        const result = await response.json();

        if (response.ok) {
          // setStudents([...students, result.newStudent]);
        } else {
          setLoading(false);
          throw new Error(result.message || 'Failed to create student.');
        }

        const formDataToSend = {
          type: formData.type,
          studentRef: result.newStudent._id,
          commissionAmt: formData.commission,
          fundingMonth: formData.accFundingMonth,
          tds: formData.tds,
          netPayable: formData.netPayable,
          commissionStatus: formData.commissionStatus,
          agentRef: formData.Agents,
          accOpeningMonth: accOpeningMonth,
          accOpeningDate: accOpeningDate1,
          bankVendor: formData.bankVendor,
          studentEmail: formData.email,
          studentPhoneNo: formData.phoneNo,
          studentPassportNo: formData.passportNo,
          studentDocuments: {
            aadhar: {
              fileId: '',
              documentFile: '',
            },
            pan: {
              fileId: '',
              documentFile: '',
            },
            ol: {
              fileId: '',
              documentFile: '',
            },
            passport: {
              fileId: '',
              documentFile: '',
            },
          },
        };

        const types = [...documents.map((doc) => doc.documentType)];
        const filedata = new FormData();
        filedata.append('type', types);
        filedata.append('studentRef', result.newStudent._id);
        filedata.append('folderId', '1WkdyWmBhKQAI6W_M4LNLbPylZoGZ7y6V');
        const files = [...documents.map((doc) => doc.documentFile)].filter(
          Boolean,
        );
        files.forEach((file) => filedata.append('files', file));
        

        if (documents.length > 0) {
          try {
            const response = await fetch(
              'https://abroad-backend-gray.vercel.app/api/uploads/upload',
              {
                method: 'POST',
                body: filedata,
                headers: {
                  Accept: 'application/json',
                },
              },
            );
            const result = await response.json();
            const respo = result.uploads; // Adjust based on your API response structure
            // console.log(respo);

            for (let i = 0; i < types.length; i++) {
              formDataToSend.studentDocuments[types[i]] = {
                fileId: respo[i].fileId,
                documentFile: respo[i].viewLink,
              };
            }
          } catch (error) {
            console.error('Error uploading files:', error);
            toast({
              title: 'File Upload Error',
              description: 'An error occurred while uploading the file.',
              status: 'error',
              duration: 3000,
              isClosable: true, 
            });
            setLoading(false);
            return; // Stop further execution if file upload fails
          }
        }

        const apiUrl = 'https://abroad-backend-gray.vercel.app/auth/addGicForm';
        // console.log('Form Data to Send:', formDataToSend);

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
            // console.log('Server Response:', result);
            navigate(`/admin/gic/${result.newGIC._id}`);
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
            <FormLabel>Type Of Service</FormLabel>
            <Select
              name="type"
              placeholder="Select Type of Service"
              value={formData.type}
              onChange={handleChange}
              h="50px"
              w="full"
            >
              <option value="GIC">GIC</option>
              <option value="BLOCKED ACCOUNT">BLOCKED ACCOUNT</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Agent Name</FormLabel>
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
                  color="gray.400"
                  fontSize="20px"
                >
                   {isDropdownOpen ? <GoChevronUp /> : <GoChevronDown  />}
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
                      _hover={{ bg: "gray.100" }}
                      onClick={() => {
                        setFormData({ ...formData, Agents: agent._id });
                        setAgentSearch(agent.name.toUpperCase());
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text fontWeight="medium">{agent.name.toUpperCase()}</Text>
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
              <option value="Expatrio">Expatrio</option>
              <option value="Fintiba">Fintiba</option>
              <option value="TD">TD</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Acc Opening Date</FormLabel>
            <Input
              type="date"
              value={accOpeningDate1}
              onChange={(e) => setAccOpeningDate1(e.target.value)}
              max={getCurrentDate()} // Restrict future dates
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel>Acc Opening Month</FormLabel>
            <Select
              name="accOpeningMonth"
              placeholder="Select Month"
              value={accOpeningMonth}
              onChange={(e) => setAccOpeningMonth(e.target.value)}
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
              <option value={'Not Funded Yet'}>Not Funded Yet</option>
            </Select>
          </FormControl>

          <FormControl>
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

          <FormControl>
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

          <FormControl>
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

          {/* <FormControl
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
          )} */}
        </SimpleGrid>

        <Box mt={4}>
          {Array.isArray(documents) &&
            documents.map((doc, index) => (
              <Flex key={index} direction="column" mb={4}>
                <FormControl>
                  <FormLabel>Document Type</FormLabel>
                  <Select
                    name="documentType"
                    value={doc.documentType}
                    onChange={(e) => handleChangeDocument(e, index)}
                    h="50px"
                    w="full"
                  >
                    <option value={''}> -- Select Type --</option>
                    {documentTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type === 'ol' ? 'Offer Letter' : type.toUpperCase()}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mt={5}>
                  <FormLabel>Upload Document</FormLabel>
                  <Flex align="center">
                    <Button
                      colorScheme="blue"
                      onClick={() =>
                        document.getElementById(`documentFile-${index}`).click()
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
                      name="documentFile"
                      id={`documentFile-${index}`}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleChangeDocument(e, index)}
                      hidden
                    />
                  </Flex>
                </FormControl>
                <Button
                  colorScheme="red"
                  mt={2}
                  width={32}
                  onClick={() => removeDocument(index)}
                >
                  Remove
                </Button>
              </Flex>
            ))}

          {documents.length < 4 && (
            <Button
              colorScheme="blue"
              onClick={addDocuments}
              mt={4}
              width={'100%'}
            >
              Add Document
            </Button>
          )}
        </Box>

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
