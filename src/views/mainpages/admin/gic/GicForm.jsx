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
} from '@chakra-ui/react';
import { format } from 'date-fns';

const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');
const getCurrentMonth = () => format(new Date(), 'MMMM');

function GicForm() {
  const [agents, setAgents] = useState([]);

  const [formData, setFormData] = useState({
    Agents: '',
    studentName: '',
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
      studentName,
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
      !studentName ||
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

    if (validateForm()) {
      const { documentFile, documentType, studentName } = formData;
      const fileExtension = documentFile.name.split('.').pop();
      const renamedFile = new File(
        [documentFile],
        `${documentType}_${studentName}.${fileExtension}`,
        { type: documentFile.type },
      );

      // Prepare form data for API submission
      const formDataToSend = {
        studentName: formData.studentName,
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
      };

      const apiUrl = 'http://localhost:4000/auth/addGicForm';

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
    }
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
              {
                agents.map((agents)=>(
                  <option key={agents._id} value={agents._id}>{agents.agentCode}</option>
                ))
              }
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
            <Input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              h="50px"
              w="full"
            />
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
              <option value="Adhaar">Adhaar</option>
              <option value="Pan">Pan</option>
              <option value="Offer letter">Offer Letter</option>
              <option value="Passport">Passport</option>
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

        <Button type="submit" colorScheme="brand" width="full" mt={4} h="50px">
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default GicForm;
