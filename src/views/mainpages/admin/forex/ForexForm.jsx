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
} from '@chakra-ui/react';
import { format } from 'date-fns';
import axios from 'axios';

const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');

function ForexForm() {
  const [formData, setFormData] = useState({
    sNo: '',
    studentName: '',
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
    passportFile: '',
    offerLetterFile: '',
  });
  const [countries, setCountries] = useState([]);
  const [documents, setDocuments] = useState([]);
  const toast = useToast();

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
    // Fetch countries from API
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => setCountries(response.data))
      .catch((error) => {
        console.error('Error fetching countries:', error);
        toast({
          title: 'Error',
          description: 'Could not load country options.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, []);

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

  const handlePassOfferFileChange = (e) => {
    const { name, files } = e.target;
    console.log(files[0].name )
    setFormData({ ...formData, [name]: files[0].name });
  };

  const validateForm = () => {
    const {
      sNo,
      studentName,
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
      !sNo ||
      !studentName ||
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
    if (validateForm()) {
      console.log('Form data:', formData);
      console.log('Documents:', documents);
      const documentFiles = documents.map((doc) => ({ ...doc, documentFile: doc.documentFile.name}));
      setFormData({ ...formData, documents: documentFiles});


      await axios.post('http://localhost:4000/auth/addForexForm', {
        ...formData
      });
      toast({
        title: 'Form Submitted',
        description: 'Your data has been submitted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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
            <FormLabel>SNo</FormLabel>
            <Input
              type="text"
              name="sNo"
              value={formData.sNo}
              onChange={handleChange}
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isReadOnly>
            <FormLabel>Date</FormLabel>
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
            <FormLabel>Country</FormLabel>
            <Select
              name="country"
              placeholder="Select Country"
              value={formData.country}
              onChange={handleChange}
              h="50px"
              w="full"
            >
              {countries.map((country, index) => (
                <option key={index} value={country.name.common}>
                  {country.name.common}
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
            <Input
              type="text"
              name="docsStatus"
              value={formData.docsStatus}
              onChange={handleChange}
              h="50px"
              w="full"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>TT Copy Status</FormLabel>
            <Input
              type="text"
              name="ttCopyStatus"
              value={formData.ttCopyStatus}
              onChange={handleChange}
              h="50px"
              w="full"
            />
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

          <FormControl isRequired gridColumn={'span 2'}>
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
              <Text>
                {formData.passportFile
                  ? formData.passportFile
                  : 'No file chosen'}
              </Text>
              <Input
                type="file"
                id="passportFile"
                name="passportFile"
                onChange={handlePassOfferFileChange}
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
                {formData.offerLetterFile
                  ? formData.offerLetterFile
                  : 'No file chosen'}
              </Text>
              <Input
                type="file"
                id="offerLetterFile"
                name="offerLetterFile"
                onChange={handlePassOfferFileChange}
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

        <Button type="submit" colorScheme="brand" width="full" mt={6} h="50px">
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default ForexForm;
