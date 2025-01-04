import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';

const AddUserModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    organization: '',
    phoneNumber: '',
    state: '',
    city: '',
    businessDivision: '',
  });
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Show loader
    try {
      const response = await fetch(
        'https://abroad-backend-ten.vercel.app/admin/adduser',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include',
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Success',
          description: result.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setFormData({
          name: '',
          email: '',
          password: '',
          organization: '',
          phoneNumber: '',
          state: '',
          city: '',
          businessDivision: '',
        });
        onClose();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add user.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Add User
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={[1, 2]} spacing={4}>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="organization">
                <FormLabel>Organization</FormLabel>
                <Input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="phoneNumber">
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="state">
                <FormLabel>State</FormLabel>
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="city">
                <FormLabel>City</FormLabel>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="businessDivision">
                <FormLabel>Business Division</FormLabel>
                <select
                  name="businessDivision"
                  value={formData.businessDivision}
                  onChange={handleChange}
                  style={{
                    padding: '8px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '4px',
                    width: '100%',
                  }}
                >
                  <option value="">Select Business Division</option>
                  <option value="GIC">GIC</option>
                  <option value="FOREX">FOREX</option>
                  <option value="BLOCKED ACCOUNT">BLOCKED ACCOUNT</option>
                </select>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isDisabled={isLoading} // Disable button when loading
            >
              {isLoading ? <Spinner size="sm" /> : 'Add User'}
            </Button>
            <Button onClick={onClose} isDisabled={isLoading}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddUserModal;
