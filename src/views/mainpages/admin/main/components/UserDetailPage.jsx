import React, { useEffect, useState, useRef } from 'react';
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
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const toast = useToast();
  const cancelRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get(
          `https://abroad-backend-ten.vercel.app/admin/getuser/${id}`,
          { withCredentials: true },
        );

        setUser(userResponse.data.user);
        const userResponse1 = await axios.get(
          'https://abroad-backend-ten.vercel.app/admin/getcurrentuser',
          { withCredentials: true },
        );
        setCurrentUserId(userResponse1.data.user);
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
    setIsApproveDialogOpen(false);
    try {
      const data = await axios.put(
        `https://abroad-backend-ten.vercel.app/admin/approve/${id}`,
        {approvedBy: currentUserId},
        { withCredentials: true },
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
    setIsBlockDialogOpen(false);
    try {
      const data = await axios.put(
        `https://abroad-backend-ten.vercel.app/admin/block/${id}`,
        {},
        { withCredentials: true },
      );
      toast({
        title: 'User Blocked',
        description: 'User has been rejected successfully.',
        status: 'success',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
        containerStyle: { width: '400px' },
      });
      navigate('/admin/agent', { replace: true });
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
          <Badge
            colorScheme={user.userStatus === 'pending' ? 'yellow' : 'green'}
          >
            {user.userStatus}
          </Badge>
        </HStack>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          <Text fontSize="lg">
            <strong>Email:</strong> {user.email}
          </Text>
          <Text fontSize="lg">
            <strong>Role:</strong> {user.role}
          </Text>
          <Text fontSize="lg">
            <strong>Organization:</strong> {user.organization}
          </Text>
          <Text fontSize="lg">
            <strong>Phone:</strong> {user.phoneNumber}
          </Text>
          <Text fontSize="lg">
            <strong>Location:</strong> {user.state}, {user.city}
          </Text>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          <Text fontSize="lg">
            <strong>Abroad Reason:</strong> {user.abroadReason}
          </Text>
          <Text fontSize="lg">
            <strong>Business Division:</strong> {user.businessDivision}
          </Text>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          <Text fontSize="lg">
            <strong>Document 1:</strong>{' '}
            <a
              href={`/documents/${user.document1}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </Text>
          <Text fontSize="lg">
            <strong>Document 2:</strong>{' '}
            <a
              href={`/documents/${user.document2}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </Text>
        </SimpleGrid>

        <HStack spacing={4} mt={6} align="center" justify="space-between">
          <Button
            colorScheme="green"
            size="lg"
            flex="1"
            onClick={() => setIsApproveDialogOpen(true)}
            isLoading={loadingApprove}
            spinner={<Spinner />}
          >
            Approve
          </Button>
          <Button
            colorScheme="red"
            size="lg"
            flex="1"
            onClick={() => setIsBlockDialogOpen(true)}
            isLoading={loadingBlock}
            spinner={<Spinner />}
          >
            Reject
          </Button>
        </HStack>
      </VStack>

      {/* Approve Confirmation Modal */}
      <AlertDialog
        isOpen={isApproveDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsApproveDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Approve User
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to approve this user?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsApproveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleApprove} ml={3}>
                Yes, Approve
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Block Confirmation Modal */}
      <AlertDialog
        isOpen={isBlockDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsBlockDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reject User
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to Reject this user?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsBlockDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleBlock} ml={3}>
                Yes, Reject
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UserDetailPage;
