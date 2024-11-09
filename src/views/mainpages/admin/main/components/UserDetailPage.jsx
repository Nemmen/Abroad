import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  Heading,
  HStack,
  Badge,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingBlock, setLoadingBlock] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:4000/admin/getuser/${id}`,
          { withCredentials: true },
        );
        setUser(userResponse.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (!user) {
    return <Text>Loading user data...</Text>;
  }

  const handleApprove = async () => {
    setLoadingApprove(true);
    try {
      const data = await axios.put(
        `http://localhost:4000/admin/approve/${id}`,
        {},
        { withCredentials: true }
      );
      if (data.status === 200) {
        toast({
          title: 'User Approved',
          description: 'User has been approved successfully.',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'bottom-right',
          containerStyle: { width: '400px' },
        });
        navigate('/admin/agent', { replace: true });
      }
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleBlock = async () => {
    setLoadingBlock(true);
    try {
      const data = await axios.put(
        `http://localhost:4000/admin/block/${id}`,
        {},
        { withCredentials: true }
      );
      toast({
        title: 'User Blocked',
        description: 'User has been blocked successfully.',
        status: 'success',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
        containerStyle: { width: '400px' },
      });
      navigate('/admin/agent', { replace: true } );
    } catch (error) {
      console.error('Error blocking user:', error);
    } finally {
      setLoadingBlock(false);
    }
  };

  return (
    <Box
      maxW="100%"
      mx="auto"
      p={5}
      boxShadow="xl"
      borderRadius="md"
      bg="white"
      overflow="hidden"
      mt={'130px'}
    >
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        User Details
      </Heading>

      <VStack align="stretch" spacing={6} mb={6}>
        <HStack spacing={2} textTransform={'uppercase'} align="baseline">
          <Text fontSize="2xl" fontWeight="bold">
            {user.name}
          </Text>
          <Badge colorScheme={user.userStatus === 'pending' ? 'yellow' : 'green'}>
            {user.userStatus}
          </Badge>
        </HStack>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          <Text fontSize="lg"><strong>Email:</strong> {user.email}</Text>
          <Text fontSize="lg"><strong>Role:</strong> {user.role}</Text>
          <Text fontSize="lg"><strong>Organization:</strong> {user.organization}</Text>
          <Text fontSize="lg"><strong>Phone:</strong> {user.phoneNumber}</Text>
          <Text fontSize="lg"><strong>Location:</strong> {user.state}, {user.city}</Text>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          <Text fontSize="lg"><strong>Abroad Reason:</strong> {user.abroadReason}</Text>
          <Text fontSize="lg"><strong>Business Division:</strong> {user.businessDivision}</Text>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          <Text fontSize="lg">
            <strong>Document 1:</strong>{' '}
            <a href={`/documents/${user.document1}`} target="_blank" rel="noopener noreferrer">
              View
            </a>
          </Text>
          <Text fontSize="lg">
            <strong>Document 2:</strong>{' '}
            <a href={`/documents/${user.document2}`} target="_blank" rel="noopener noreferrer">
              View
            </a>
          </Text>
        </SimpleGrid>

        <HStack spacing={4} mt={6} align="center" justify="space-between">
          <Button
            colorScheme="green"
            size="lg"
            flex="1"
            onClick={handleApprove}
            isLoading={loadingApprove}
            spinner={<Spinner />}
          >
            Approve
          </Button>
          <Button
            colorScheme="red"
            size="lg"
            flex="1"
            onClick={handleBlock}
            isLoading={loadingBlock}
            spinner={<Spinner />}
          >
            Block
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default UserDetailPage;
