import React, { useEffect, useState } from 'react';
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
  SimpleGrid,
  Spinner,
  Center,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const EditUserModal = ({ userId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    phoneNumber: '',
    state: '',
    city: '',
    businessDivision: '',
  });

  // Fetch user data
  const fetchUserData = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(
        `https://abroad-backend-gray.vercel.app/admin/getuser/${userId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const userData = await response.json();
      setInitialValues({
        name: userData.user.name,
        email: userData.user.email,
        password: '',
        confirmPassword: '',
        organization: userData.user.organization,
        phoneNumber: userData.user.phoneNumber,
        state: userData.user.state,
        city: userData.user.city,
        businessDivision: userData.user.businessDivision,
      });
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch user data.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handler for opening the modal
  const handleOpen = () => {
    fetchUserData(); // Fetch user data when the modal is opened
    onOpen();
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string().notRequired(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .notRequired(),
    organization: Yup.string().required('Organization is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    businessDivision: Yup.string().required('Business division is required'),
  });

  const handleSubmit = async (values, actions) => {
    try {
      const { confirmPassword, ...updatedValues } = values;
      const response = await fetch(
        `https://abroad-backend-gray.vercel.app/admin/updateuser/${userId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updatedValues),
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      toast({
        title: 'Success',
        description: 'User updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      console.error('Failed to update user:', err);
      toast({
        title: 'Error',
        description: 'Failed to update user.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    actions.setSubmitting(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Edit User</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Center>
                <Spinner size="xl" />
              </Center>
            ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <SimpleGrid columns={2} spacing={4}>
                      <FormControl isInvalid={errors.name && touched.name}>
                        <FormLabel>Name</FormLabel>
                        <Field
                          name="name"
                          as={Input}
                          placeholder="Enter name"
                        />
                      </FormControl>

                      <FormControl isInvalid={errors.email && touched.email}>
                        <FormLabel>Email</FormLabel>
                        <Field
                          name="email"
                          as={Input}
                          placeholder="Enter email"
                        />
                      </FormControl>

                      <FormControl isReadOnly>
                        <FormLabel>Role</FormLabel>
                        <Input value="User" isReadOnly />
                      </FormControl>

                      <FormControl
                        isInvalid={errors.organization && touched.organization}
                      >
                        <FormLabel>Organization</FormLabel>
                        <Field
                          name="organization"
                          as={Input}
                          placeholder="Enter organization"
                        />
                      </FormControl>

                      <FormControl
                        isInvalid={errors.phoneNumber && touched.phoneNumber}
                      >
                        <FormLabel>Phone Number</FormLabel>
                        <Field
                          name="phoneNumber"
                          as={Input}
                          placeholder="Enter phone number"
                        />
                      </FormControl>

                      <FormControl isInvalid={errors.state && touched.state}>
                        <FormLabel>State</FormLabel>
                        <Field
                          name="state"
                          as={Input}
                          placeholder="Enter state"
                        />
                      </FormControl>

                      <FormControl isInvalid={errors.city && touched.city}>
                        <FormLabel>City</FormLabel>
                        <Field
                          name="city"
                          as={Input}
                          placeholder="Enter city"
                        />
                      </FormControl>

                      <FormControl
                        isInvalid={
                          errors.businessDivision && touched.businessDivision
                        }
                      >
                        <FormLabel>Business Division</FormLabel>
                        <Field
                          name="businessDivision"
                          as={Input}
                          placeholder="Enter business division"
                        />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl
                      mt={4}
                      isInvalid={errors.password && touched.password}
                    >
                      <FormLabel>Password (optional)</FormLabel>
                      <Field
                        name="password"
                        as={Input}
                        type="password"
                        placeholder="Enter password"
                      />
                    </FormControl>

                    <FormControl
                      mt={4}
                      isInvalid={
                        errors.confirmPassword && touched.confirmPassword
                      }
                    >
                      <FormLabel>Confirm Password (optional)</FormLabel>
                      <Field
                        name="confirmPassword"
                        as={Input}
                        type="password"
                        placeholder="Confirm password"
                      />
                    </FormControl>

                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        type="submit"
                        isLoading={isSubmitting}
                      >
                        Save
                      </Button>
                      <Button variant="ghost" onClick={onClose}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Form>
                )}
              </Formik>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditUserModal;
