import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Checkbox,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Flex,
  Grid,
  Badge,
} from '@chakra-ui/react';
import {
  ChevronRightIcon,
  ArrowBackIcon,
  CheckIcon,
} from '@chakra-ui/icons';
import axios from 'axios';

// Constants
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://abroad-backend-gray.vercel.app/api';

// Auth config utility for cookies
const getAuthConfig = () => {
  return {
    withCredentials: true
  };
};

const ForexCalculatePage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  // State variables
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Calculation state
  const [calculationData, setCalculationData] = useState({
    pmMargin: 0.10,
    aeMargin: 0.25,
    sendEmail: true,
    additionalNotes: '',
  });
  
  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token_auth');
    const userRole = localStorage.getItem('user_role');
    
    if (!token || userRole !== 'admin') {
      setIsAuthenticated(false);
      toast({
        title: "Authentication Error",
        description: "You must be logged in as admin to access this page",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate('/admin/login');
    }
  }, [toast, navigate]);
  
  // Fetch request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!isAuthenticated || !requestId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/forex/request/${requestId}`, 
          getAuthConfig()
        );
        
        if (response.data && response.data.success) {
          const requestData = response.data.request;
          
          if (requestData.status !== 'pending') {
            toast({
              title: 'Warning',
              description: 'This request has already been calculated',
              status: 'warning',
              duration: 5000,
              isClosable: true,
            });
            navigate(`/admin/forex/request/${requestId}`);
            return;
          }
          
          setRequest(requestData);
        } else {
          toast({
            title: 'Error',
            description: 'Could not load request details',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          navigate('/admin/forex');
        }
      } catch (error) {
        console.error('Error fetching request details:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to fetch request details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/admin/forex');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequestDetails();
  }, [requestId, isAuthenticated, toast, navigate]);
  
  // Handle calculation data changes
  const handleCalculationDataChange = (field, value) => {
    setCalculationData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Handle calculation submission
  const handleCalculate = async () => {
    if (!request || !isAuthenticated) return;
    
    try {
      setSubmitLoading(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/forex/calculate/${requestId}`, 
        calculationData,
        getAuthConfig()
      );
      
      if (response.data && response.data.success) {
        toast({
          title: 'Success',
          description: 'Forex calculation completed and saved',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Navigate back to request detail page
        navigate(`/admin/forex/request/${requestId}`);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to calculate forex',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error calculating forex:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to calculate forex',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Flex justify="center" align="center" height="70vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Flex>
    );
  }
  
  if (!request) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          Request not found or already calculated.
        </Alert>
        <Button 
          leftIcon={<ArrowBackIcon />} 
          mt={4} 
          colorScheme="blue" 
          onClick={() => navigate('/admin/forex')}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }
  
  return (
    <Box px={4} py={6} maxWidth="1000px" mx="auto">
      {/* Breadcrumbs & Header */}
      <Box mb={6}>
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} mb={3}>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/admin')}>Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/admin/forex')}>Forex</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(`/admin/forex/request/${requestId}`)}>
              Request {requestId.substring(18)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Calculate</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg">Calculate Forex</Heading>
            <Text color="gray.500" fontSize="sm" mt={1}>
              Calculate exchange rates and margins for {request.agent?.name || 'Unknown Agent'}
            </Text>
          </Box>
          
          <Badge 
            colorScheme="blue" 
            fontSize="md" 
            px={3} 
            py={1} 
            borderRadius="full"
          >
            {request.currencyType}
          </Badge>
        </Flex>
      </Box>
      
      {/* Content */}
      <VStack spacing={6} align="stretch">
        {/* Request Summary */}
        <Box 
          bg="blue.50" 
          p={5} 
          borderRadius="xl" 
          borderLeft="4px solid" 
          borderColor="blue.400"
          boxShadow="md"
        >
          <Flex justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Text color="blue.700" fontSize="sm" fontWeight="bold" mb={1}>AGENT</Text>
              <Text fontSize="xl" fontWeight="bold">{request.agent?.name || 'N/A'}</Text>
              <Text fontSize="sm" color="gray.600">{request.agent?.organization || 'N/A'}</Text>
              <Badge mt={2} colorScheme="orange" variant="solid">
                {request.agent?.agentCode || 'N/A'}
              </Badge>
            </Box>
            <Box textAlign="right">
              <Text color="blue.700" fontSize="sm" fontWeight="bold" mb={1}>AMOUNT</Text>
              <Text fontSize="xl" fontWeight="bold">
                {request.currencyType} {request.foreignAmount.toLocaleString()}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Agent Margin: {request.agentMargin.toFixed(2)} paise/unit
              </Text>
            </Box>
          </Flex>
        </Box>
        
        {/* Calculation Parameters */}
        <Box 
          p={6} 
          borderRadius="xl" 
          bg="white"
          boxShadow="lg" 
        >
          <Text color="green.700" fontSize="lg" fontWeight="bold" mb={5}>CALCULATION PARAMETERS</Text>
          
          <Grid templateColumns="repeat(2, 1fr)" gap={8}>
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">PM Margin (paise/unit)</FormLabel>
              <Input 
                type="number"
                step="0.01"
                value={calculationData.pmMargin}
                onChange={(e) => handleCalculationDataChange('pmMargin', e.target.value)}
                bg="white"
                borderRadius="md"
                size="lg"
                _hover={{ borderColor: 'green.300' }}
                _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">AE Margin (paise/unit)</FormLabel>
              <Input 
                type="number"
                step="0.01"
                value={calculationData.aeMargin}
                onChange={(e) => handleCalculationDataChange('aeMargin', e.target.value)}
                bg="white"
                borderRadius="md"
                size="lg"
                _hover={{ borderColor: 'green.300' }}
                _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
              />
            </FormControl>
          </Grid>
          
          <FormControl mt={6}>
            <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">Additional Notes</FormLabel>
            <Input 
              value={calculationData.additionalNotes}
              onChange={(e) => handleCalculationDataChange('additionalNotes', e.target.value)}
              placeholder="Add any relevant notes for this calculation"
              bg="white"
              borderRadius="md"
              size="lg"
              _hover={{ borderColor: 'green.300' }}
              _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
            />
          </FormControl>
          
          <FormControl mt={6}>
            <Checkbox 
              isChecked={calculationData.sendEmail}
              onChange={(e) => handleCalculationDataChange('sendEmail', e.target.checked)}
              size="lg"
              colorScheme="green"
            >
              <Text fontWeight="semibold">Send email notification to agent</Text>
            </Checkbox>
          </FormControl>
        </Box>
        
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="semibold">Important</Text>
            <Text fontSize="sm">
              Calculation will use current market rates. Make sure to verify the calculation before saving.
            </Text>
          </Box>
        </Alert>
        
        {/* Action Buttons */}
        <Flex justify="space-between" mt={4}>
          <Button 
            leftIcon={<ArrowBackIcon />} 
            variant="outline" 
            onClick={() => navigate(`/admin/forex/request/${requestId}`)}
            size="lg"
            borderRadius="full"
          >
            Cancel
          </Button>
          
          <Button 
            rightIcon={<CheckIcon />} 
            colorScheme="green" 
            onClick={handleCalculate}
            isLoading={submitLoading}
            loadingText="Calculating..."
            size="lg"
            borderRadius="full"
            fontWeight="bold"
            px={8}
          >
            Calculate and Save
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default ForexCalculatePage;