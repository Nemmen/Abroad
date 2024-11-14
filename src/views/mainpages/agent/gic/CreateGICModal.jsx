import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  SimpleGrid,
  useToast,
  Flex,
  Text,
} from '@chakra-ui/react';

function GicForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    passportNo: '',
    email: '',
    phoneNo: '',
    bankVendor: '',
    agentCode: '',
    documentType: '',
    documentFile: null,
  });
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const { studentName, passportNo, email, phoneNo, bankVendor, agentCode, documentType, documentFile } = formData;
    if (!studentName || !passportNo || !email || !phoneNo || !bankVendor || !agentCode || !documentType || !documentFile) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { documentFile, documentType, studentName } = formData;
      const fileExtension = documentFile.name.split('.').pop();
      const renamedFile = new File([documentFile], `${documentType}_${studentName}.${fileExtension}`, { type: documentFile.type });

      console.log('Renamed file:', renamedFile);

      toast({
        title: 'Form Submitted',
        description: 'Your data has been submitted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Additional code to upload renamedFile goes here
    }
  };

  return (
    <Box maxW="100%" bg="white" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <form onSubmit={handleSubmit} className='pt-6'>
        <SimpleGrid columns={2} spacing={4}>
          <FormControl isRequired>
            <FormLabel>Student Name</FormLabel>
            <Input type="text" name="studentName" value={formData.studentName} onChange={handleChange} h="50px" w="full" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Passport No.</FormLabel>
            <Input type="text" name="passportNo" value={formData.passportNo} onChange={handleChange} h="50px" w="full" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} h="50px" w="full" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone No.</FormLabel>
            <Input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} h="50px" w="full" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Bank Vendor</FormLabel>
            <Select name="bankVendor" placeholder="Select Bank Vendor" value={formData.bankVendor} onChange={handleChange} h="50px" w="full">
              <option value="ICICI">ICICI</option>
              <option value="RBC">RBC</option>
              <option value="CIBC">CIBC</option>
              <option value="BOM">BOM</option>
              <option value="TD">TD</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Agent Code</FormLabel>
            <Input type="text" name="agentCode" value={formData.agentCode} onChange={handleChange} h="50px" w="full" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Document Type</FormLabel>
            <Select name="documentType" placeholder="Select Document Type" value={formData.documentType} onChange={handleChange} h="50px" w="full">
              <option value="Adhaar">Adhaar</option>
              <option value="Pan">Pan</option>
              <option value="Offer letter">Offer Letter</option>
              <option value="Passport">Passport</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Upload Document</FormLabel>
            <Flex align="center">
              <Button colorScheme="blue" onClick={() => document.getElementById('documentFile').click()} mr={2}>Choose File</Button>
              <Text>{formData.documentFile ? formData.documentFile.name : 'No file chosen'}</Text>
              <Input type="file" name="documentFile" id="documentFile" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} hidden />
            </Flex>
          </FormControl>
        </SimpleGrid>

        <Button type="submit" colorScheme="brand" width="full" mt={4} h="50px">Submit</Button>
      </form>
    </Box>
  );
}

export default GicForm;
