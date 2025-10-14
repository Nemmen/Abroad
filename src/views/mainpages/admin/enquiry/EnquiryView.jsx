import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  Link,
  useColorModeValue,
  Badge,
  HStack,
  Button,
  useToast,
  Spinner,
  Divider,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiClock,
  FiTag,
  FiUserCheck,
  FiCalendar,
  FiAlertCircle,
} from 'react-icons/fi';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const formatEnquiryData = (data) => {
  if (!data) return {};
  
  return {
    id: data._id || '',
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    subject: data.subject || '',
    message: data.message || '',
    status: data.status || 'New',
    priority: data.priority || 'Medium',
    createdAt: data.createdAt ? new Date(data.createdAt).toLocaleString() : '',
    assignedTo: data.assignedTo || '',
    followUpDate: data.followUpDate ? new Date(data.followUpDate).toLocaleDateString() : '',
    notes: data.notes || '',
    createdAt: data.createdAt ? new Date(data.createdAt).toLocaleString() : '',
    updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '',
  };
};

const fieldIcons = {
  name: FiUser,
  email: FiMail,
  phone: FiPhone,
  subject: FiMessageSquare,
  message: FiMessageSquare,
  status: FiTag,
  priority: FiAlertCircle,
  createdAt: FiClock,
  assignedTo: FiUserCheck,
  followUpDate: FiCalendar,
  notes: FiMessageSquare,
};

const fieldLabels = {
  name: 'Full Name',
  email: 'Email Address',
  phone: 'Phone Number',
  subject: 'Subject/Message',
  message: 'Message',
  status: 'Current Status',
  priority: 'Priority Level',
  createdAt: 'Submitted On',
  assignedTo: 'Assigned Agent',
  followUpDate: 'Follow-up Date',
  notes: 'Internal Notes',
  updatedAt: 'Last Updated',
};

const EnquiryView = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const toast = useToast();

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://abroad-backend-gray.vercel.app/admin/enquiries/${id}`,
          {withCredentials: true}
        );
        if (response.data.success) {
          const enquiryData = response.data.enquiry;
          setFormData(formatEnquiryData(enquiryData));
        } else {
          console.error('API returned success: false');
          setFormData({});
        }
      } catch (error) {
        console.error('Error fetching enquiry data:', error);
        setFormData({});
        toast({
          title: 'Error',
          description: 'Failed to load enquiry details',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          'https://abroad-backend-gray.vercel.app/admin/agents',
          {withCredentials: true}
        );
        if (response.data.success) {
          setAgents(response.data.agents);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    if (id) {
      fetchData();
      fetchAgents();
    }
  }, [id, toast]);

  const getStatusColor = (status) => {
    const colors = {
      'New': 'blue',
      'In Progress': 'yellow',
      'Contacted': 'purple',
      'Resolved': 'green',
      'Closed': 'gray'
    };
    return colors[status] || 'gray';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'green',
      'Medium': 'yellow',
      'High': 'orange',
      'Urgent': 'red'
    };
    return colors[priority] || 'gray';
  };

  const renderField = (fieldName, value) => {
    if (!value && fieldName !== 'message' && fieldName !== 'notes') return null;

    const IconComponent = fieldIcons[fieldName] || FiMessageSquare;

    // Special rendering for certain fields
    if (fieldName === 'status') {
      return (
        <Flex align="center" mb={4} key={fieldName}>
          <Icon as={IconComponent} mr={3} color="blue.500" boxSize={5} />
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              {fieldLabels[fieldName]}
            </Text>
            <Badge colorScheme={getStatusColor(value)} size="lg">
              {value}
            </Badge>
          </Box>
        </Flex>
      );
    }

    if (fieldName === 'priority') {
      return (
        <Flex align="center" mb={4} key={fieldName}>
          <Icon as={IconComponent} mr={3} color="orange.500" boxSize={5} />
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              {fieldLabels[fieldName]}
            </Text>
            <Badge colorScheme={getPriorityColor(value)} size="lg">
              {value}
            </Badge>
          </Box>
        </Flex>
      );
    }

    if (fieldName === 'email') {
      return (
        <Flex align="center" mb={4} key={fieldName}>
          <Icon as={IconComponent} mr={3} color="blue.500" boxSize={5} />
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              {fieldLabels[fieldName]}
            </Text>
            <Link href={`mailto:${value}`} color="blue.500" textDecoration="underline">
              {value}
            </Link>
          </Box>
        </Flex>
      );
    }

    if (fieldName === 'phone') {
      return (
        <Flex align="center" mb={4} key={fieldName}>
          <Icon as={IconComponent} mr={3} color="green.500" boxSize={5} />
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              {fieldLabels[fieldName]}
            </Text>
            <Link href={`tel:${value}`} color="green.500" textDecoration="underline">
              {value}
            </Link>
          </Box>
        </Flex>
      );
    }

    return (
      <Flex align="flex-start" mb={4} key={fieldName}>
        <Icon as={IconComponent} mr={3} color="gray.500" boxSize={5} mt={0.5} />
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={1}>
            {fieldLabels[fieldName]}
          </Text>
          <Text color={headingColor} whiteSpace="pre-wrap">
            {value}
          </Text>
        </Box>
      </Flex>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Loading enquiry details...</Text>
      </Box>
    );
  }

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="xl" color="gray.500">
          Enquiry not found or failed to load.
        </Text>
        <Button
          mt={4}
          colorScheme="blue"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      {/* Header */}
      <VStack spacing={6} align="stretch">
        <Box>
          <HStack justify="space-between" align="center" mb={2}>
            <Heading size="lg" color={headingColor}>
              Enquiry Details
            </Heading>
            <HStack>
              <Badge colorScheme={getStatusColor(formData.status)} size="lg">
                {formData.status}
              </Badge>
              <Badge colorScheme={getPriorityColor(formData.priority)} size="lg">
                {formData.priority} Priority
              </Badge>
            </HStack>
          </HStack>
          <Text color={textColor}>
            Enquiry ID: {formData.id}
          </Text>
        </Box>

        <Divider />

        {/* Main Content */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Contact Information */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardHeader>
              <Heading size="md" color={headingColor}>
                Contact Information
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {renderField('name', formData.name)}
                {renderField('email', formData.email)}
                {renderField('phone', formData.phone)}
              </VStack>
            </CardBody>
          </Card>

          {/* Status & Priority */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardHeader>
              <Heading size="md" color={headingColor}>
                Status & Priority
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {renderField('status', formData.status)}
                {renderField('priority', formData.priority)}
                {renderField('assignedTo', formData.assignedTo)}
                {renderField('followUpDate', formData.followUpDate)}
              </VStack>
            </CardBody>
          </Card>

          {/* Enquiry Details */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardHeader>
              <Heading size="md" color={headingColor}>
                Enquiry Message
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {renderField('subject', formData.subject)}
                {formData.message && renderField('message', formData.message)}
              </VStack>
            </CardBody>
          </Card>

          {/* Timeline */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardHeader>
              <Heading size="md" color={headingColor}>
                Timeline
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {renderField('createdAt', formData.createdAt)}
                {renderField('updatedAt', formData.updatedAt)}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Internal Notes */}
        {formData.notes && (
          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardHeader>
              <Heading size="md" color={headingColor}>
                Internal Notes
              </Heading>
            </CardHeader>
            <CardBody>
              {renderField('notes', formData.notes)}
            </CardBody>
          </Card>
        )}

        {/* Action Buttons */}
        <HStack justify="center" spacing={4} pt={6}>
          <Button
            colorScheme="blue"
            onClick={() => window.history.back()}
          >
            Back to Enquiries
          </Button>
          <Button
            colorScheme="green"
            as={Link}
            href={`mailto:${formData.email}?subject=Re: ${formData.subject}`}
            isExternal
          >
            Reply via Email
          </Button>
          <Button
            colorScheme="purple"
            as={Link}
            href={`tel:${formData.phone}`}
          >
            Call Customer
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default EnquiryView;