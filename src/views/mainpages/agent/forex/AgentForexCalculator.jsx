import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Grid,
  GridItem,
  Button,
  VStack,
  HStack,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Checkbox,
  useToast,
  Spinner,
  Badge,
  FormHelperText
} from '@chakra-ui/react';
import axios from 'axios';

// Custom useDebounce hook
const useDebounce = (callback, delay, deps = []) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      callback();
    }, delay);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [...deps]);
};

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token_auth');
};

// Configure axios with auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };
};

// API base URL
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://abroad-backend-gray.vercel.app/api';

// Currency options with symbols
const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($) - US Dollar', symbol: '$' },
  { value: 'AUD', label: 'AUD ($) - Australian Dollar', symbol: 'A$' },
  { value: 'CAD', label: 'CAD ($) - Canadian Dollar', symbol: 'C$' },
  { value: 'GBP', label: 'GBP (£) - British Pound', symbol: '£' },
  { value: 'EUR', label: 'EUR (€) - Euro', symbol: '€' },
  { value: 'AED', label: 'AED (د.إ) - UAE Dirham', symbol: 'د.إ' },
  { value: 'MYR', label: 'MYR (RM) - Malaysian Ringgit', symbol: 'RM' },
];

// Get currency symbol by code
const getCurrencySymbol = (code) => {
  const currency = CURRENCY_OPTIONS.find(c => c.value === code);
  return currency ? currency.symbol : '';
};

// Format currency
const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const AgentForexCalculator = () => {
  const toast = useToast();
  
  // Form state
  const [currencyType, setCurrencyType] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState(10000);
  const [ibrRate, setIbrRate] = useState(83.00);
  
  // Fixed margins for agent view (non-modifiable)
  const pmMargin = 0.10;
  const aeMargin = 0.05;
  const [agentMargin, setAgentMargin] = useState(0.35);
  
  // Service charge settings
  const [serviceChargePercentage, setServiceChargePercentage] = useState(1); // 1% service charge
  const [serviceChargeBase, setServiceChargeBase] = useState(500); // Base service charge in INR
  
  // Optional charges are disabled for agent view
  const includeFlyWire = false;
  const includeCIBC = false;
  const flyWireAmount = 750;
  const cibcAmount = 1500;
  
  // Loading states
  const [isRateLoading, setIsRateLoading] = useState(false);
  
  // Results state
  const [calculationResult, setCalculationResult] = useState({
    newRate: 0,
    inrConverted: 0,
    serviceCharge: 0,
    gst: 0,
    tcs: 0,
    flyWireCharge: 0,
    cibcCharge: 0,
    grandTotal: 0,
    pmMargin: 0,
    aeMargin: 0,
    agentMargin: 0
  });
  
  // For debouncing currency type changes
  const [debouncedCurrencyType, setDebouncedCurrencyType] = useState(currencyType);

  // Handler for input fields
  const handleNumberInput = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || !isNaN(value)) {
      setter(value === '' ? '' : parseFloat(value));
    }
  };

  // Debounce currency type changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedCurrencyType(currencyType);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [currencyType]);

  // Fetch IBR rate when currency type changes
  useEffect(() => {
    const fetchIbrRate = async () => {
      if (!debouncedCurrencyType) return;
      
      setIsRateLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/forex/get-rate/${debouncedCurrencyType}`,
          getAuthHeaders()
        );
        
        if (response.data && response.data.success) {
          setIbrRate(parseFloat(response.data.rate).toFixed(2));
          toast({
            title: 'Rate updated',
            description: `Current ${debouncedCurrencyType}/INR rate: ${parseFloat(response.data.rate).toFixed(2)}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to fetch current rate. Using default value.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching currency rate:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch current rate. Using default value.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsRateLoading(false);
      }
    };
    
    fetchIbrRate();
  }, [debouncedCurrencyType, toast]);
  
  // Calculate results when any input changes
  useEffect(() => {
    calculateResults();
  }, [
    ibrRate,
    currencyType,
    foreignAmount,
    serviceChargePercentage,
    serviceChargeBase,
    pmMargin,
    aeMargin,
    agentMargin,
  ]);

  // Calculate results based on current values
  const calculateResults = useCallback(() => {
    // Calculate new currency rate
    const newRate = parseFloat(ibrRate) + parseFloat(pmMargin) + parseFloat(aeMargin) + parseFloat(agentMargin);
    
    // Calculate INR amount
    const inrConverted = (parseFloat(foreignAmount) || 0) * newRate;
    
    // Calculate service charge
    const baseServiceCharge = parseFloat(serviceChargeBase) || 0;
    const percentageServiceCharge = (inrConverted * (parseFloat(serviceChargePercentage) || 0)) / 100;
    const serviceCharge = baseServiceCharge + percentageServiceCharge;
    
    // Calculate GST on service charge (18%)
    const gst = serviceCharge * 0.18;
    
    // Calculate TCS (Tax Collected at Source)
    // TCS is 5% on amounts over 10 lakhs
    const tcs = inrConverted > 1000000 ? (inrConverted - 1000000) * 0.05 : 0;
    
    // Calculate optional charges (disabled for agents)
    const flyWireCharge = includeFlyWire ? parseFloat(flyWireAmount) : 0;
    const cibcCharge = includeCIBC ? parseFloat(cibcAmount) : 0;
    
    // Calculate grand total
    const grandTotal = inrConverted + serviceCharge + gst + tcs + flyWireCharge + cibcCharge;
    
    // Update calculation result
    setCalculationResult({
      newRate,
      inrConverted,
      serviceCharge,
      gst,
      tcs,
      flyWireCharge,
      cibcCharge,
      grandTotal,
      pmMargin,
      aeMargin,
      agentMargin,
      currencyType,
      foreignAmount,
    });
  }, [
    ibrRate, 
    pmMargin, 
    aeMargin, 
    agentMargin, 
    foreignAmount, 
    serviceChargeBase, 
    serviceChargePercentage, 
    includeFlyWire, 
    includeCIBC, 
    flyWireAmount, 
    cibcAmount,
    currencyType
  ]);

  return (
    <Box p={{ base: 3, md: 5 }} bg="white" borderRadius="lg" boxShadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={2} color="green.700">
        Agent Forex Calculator
      </Text>
      <Text fontSize="sm" color="gray.600" mb={{ base: 4, md: 5 }}>
        Calculate currency conversions with your commission rate
      </Text>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }} gap={{ base: 4, md: 6 }}>
        {/* Input Section */}
        <GridItem colSpan={{ base: 12, md: 5 }}>
          <VStack spacing={{ base: 4, md: 5 }} align="stretch">
            <Box 
              p={{ base: 4, md: 5 }} 
              bg="gray.50" 
              borderRadius="xl" 
              boxShadow="sm" 
              borderLeft="4px solid" 
              borderColor="green.400"
            >
              <Text fontSize="md" fontWeight="semibold" mb={3} color="green.700">
                Currency & Amount
              </Text>

              {/* Currency Selection */}
              <FormControl mb={{ base: 3, md: 4 }}>
                <FormLabel fontWeight="medium" mb={1}>Foreign Currency</FormLabel>
                <Select
                  value={currencyType}
                  onChange={(e) => setCurrencyType(e.target.value)}
                  bg="white"
                  size="md"
                  h="40px"
                  _hover={{ borderColor: 'green.300' }}
                  _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                >
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Amount Input */}
              <FormControl mb={{ base: 3, md: 4 }}>
                <FormLabel fontWeight="medium" mb={1}>Foreign Amount</FormLabel>
                <Input
                  type="number"
                  value={foreignAmount}
                  onChange={handleNumberInput(setForeignAmount)}
                  placeholder={`Enter amount in ${currencyType}`}
                  bg="white"
                  size="md"
                  h="40px"
                  _hover={{ borderColor: 'green.300' }}
                  _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                />
                <FormHelperText mt={1}>Amount in {currencyType}</FormHelperText>
              </FormControl>
              
              {/* IBR Rate Section */}
              <FormControl mb={{ base: 1, md: 2 }}>
                <HStack justify="space-between" mb={1}>
                  <FormLabel mb={0} fontWeight="medium">IBR Rate</FormLabel>
                  <Button
                    size="xs"
                    colorScheme="green"
                    variant="outline"
                    isLoading={isRateLoading}
                    onClick={() => {
                      if (currencyType) {
                        setDebouncedCurrencyType(currencyType);
                      }
                    }}
                    leftIcon={isRateLoading ? <Spinner size="xs" /> : null}
                  >
                    {isRateLoading ? 'Loading...' : 'Refresh Rate'}
                  </Button>
                </HStack>
                <Input
                  type="number"
                  value={ibrRate}
                  onChange={handleNumberInput(setIbrRate)}
                  placeholder="IBR Rate"
                  step="0.01"
                  isReadOnly
                  bg="white"
                  size="md"
                  h="40px"
                  _hover={{ borderColor: 'green.300' }}
                  _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                />
                <FormHelperText mt={1}>Interbank Rate (INR per {currencyType})</FormHelperText>
              </FormControl>
            </Box>

            <Box 
              p={{ base: 4, md: 5 }} 
              bg="gray.50" 
              borderRadius="xl" 
              boxShadow="sm"
              borderLeft="4px solid" 
              borderColor="blue.400"
            >
              <Text fontSize="md" fontWeight="semibold" mb={3} color="blue.700">
                Margins & Charges
              </Text>

              {/* Margins */}
              <FormControl mb={{ base: 3, md: 4 }}>
                <FormLabel fontWeight="medium" mb={1}>PM Margin</FormLabel>
                <Input
                  type="number"
                  value={pmMargin}
                  placeholder="Platform margin"
                  step="0.01"
                  isReadOnly
                  bg="white"
                  size="md"
                  h="40px"
                  opacity={0.8}
                  _hover={{ borderColor: 'blue.300' }}
                />
                <FormHelperText mt={1}>Platform margin (fixed)</FormHelperText>
              </FormControl>
              
              <FormControl mb={{ base: 3, md: 4 }}>
                <FormLabel fontWeight="medium" mb={1}>AE Margin</FormLabel>
                <Input
                  type="number"
                  value={aeMargin}
                  placeholder="Abroad Educare margin"
                  step="0.01"
                  isReadOnly
                  bg="white"
                  size="md"
                  h="40px"
                  opacity={0.8}
                  _hover={{ borderColor: 'blue.300' }}
                />
                <FormHelperText mt={1}>Abroad Educare's own margin (fixed)</FormHelperText>
              </FormControl>
              
              <FormControl mb={{ base: 3, md: 4 }}>
                <FormLabel fontWeight="medium" mb={1}>Agent Margin</FormLabel>
                <Input
                  type="number"
                  value={agentMargin}
                  onChange={handleNumberInput(setAgentMargin)}
                  placeholder="Agent margin"
                  step="0.01"
                  bg="white"
                  size="md"
                  h="40px"
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
                <FormHelperText mt={1}>Your additional margin</FormHelperText>
              </FormControl>
              
              <Divider my={{ base: 3, md: 4 }} borderColor="gray.300" />
              
              {/* Service Charge */}
              <FormControl mb={{ base: 3, md: 4 }}>
                <FormLabel fontWeight="medium" mb={1}>Service Charge Percentage</FormLabel>
                <Input
                  type="number"
                  value={serviceChargePercentage}
                  onChange={handleNumberInput(setServiceChargePercentage)}
                  placeholder="Service charge %"
                  step="0.01"
                  bg="white"
                  size="md"
                  h="40px"
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
                <FormHelperText mt={1}>Percentage of converted amount</FormHelperText>
              </FormControl>
              
              <FormControl mb={{ base: 1, md: 1 }}>
                <FormLabel fontWeight="medium" mb={1}>Service Charge Base (INR)</FormLabel>
                <Input
                  type="number"
                  value={serviceChargeBase}
                  onChange={handleNumberInput(setServiceChargeBase)}
                  placeholder="Base service charge"
                  bg="white"
                  size="md"
                  h="40px"
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
                <FormHelperText mt={1}>Fixed amount in INR</FormHelperText>
              </FormControl>
            </Box>
          </VStack>
        </GridItem>

        {/* Results Section */}
        <GridItem colSpan={{ base: 12, md: 7 }}>
          <Box 
            p={6} 
            borderRadius="xl" 
            bgGradient="linear(to-b, green.50, green.100)" 
            boxShadow="lg"
            position="relative"
            overflow="hidden"
          >
            <Box 
              position="absolute" 
              top={0} 
              left={0} 
              right={0} 
              h="5px" 
              bgGradient="linear(to-r, green.400, green.600)" 
            />
            
            <Text fontSize="lg" fontWeight="bold" mb={5} color="green.700">
              CALCULATION RESULTS
            </Text>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              {/* Exchange Rate */}
              <Stat 
                bg="white" 
                p={4} 
                borderRadius="lg" 
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <StatLabel color="gray.600" fontWeight="medium" fontSize="sm">Exchange Rate</StatLabel>
                <StatNumber color="green.600" fontWeight="bold">
                  ₹{calculationResult.newRate.toFixed(2)}
                </StatNumber>
                <StatHelpText fontSize="xs" mt={1}>
                  IBR + Margins (per {currencyType})
                </StatHelpText>
              </Stat>

              {/* INR Converted */}
              <Stat 
                bg="white" 
                p={4} 
                borderRadius="lg" 
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <StatLabel color="gray.600" fontWeight="medium" fontSize="sm">INR Converted</StatLabel>
                <StatNumber color="green.600" fontWeight="bold">
                  {formatCurrency(calculationResult.inrConverted)}
                </StatNumber>
                <StatHelpText fontSize="xs" mt={1}>
                  {foreignAmount} {currencyType} × ₹{calculationResult.newRate.toFixed(2)}
                </StatHelpText>
              </Stat>

              {/* Service Charge */}
              <Stat 
                bg="white" 
                p={4} 
                borderRadius="lg" 
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <StatLabel color="gray.600" fontWeight="medium" fontSize="sm">Service Charge</StatLabel>
                <StatNumber color="blue.600" fontWeight="bold">
                  {formatCurrency(calculationResult.serviceCharge)}
                </StatNumber>
                <StatHelpText fontSize="xs" mt={1}>
                  Base (₹{serviceChargeBase}) + {serviceChargePercentage}%
                </StatHelpText>
              </Stat>

              {/* GST */}
              <Stat 
                bg="white" 
                p={4} 
                borderRadius="lg" 
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <StatLabel color="gray.600" fontWeight="medium" fontSize="sm">GST (18%)</StatLabel>
                <StatNumber color="blue.600" fontWeight="bold">
                  {formatCurrency(calculationResult.gst)}
                </StatNumber>
                <StatHelpText fontSize="xs" mt={1}>
                  On Service Charge
                </StatHelpText>
              </Stat>

              {/* TCS */}
              <Stat 
                bg="white" 
                p={4} 
                borderRadius="lg" 
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
              >
                <StatLabel color="gray.600" fontWeight="medium" fontSize="sm">TCS (&gt;10L)</StatLabel>
                <StatNumber color="orange.600" fontWeight="bold">
                  {formatCurrency(calculationResult.tcs)}
                </StatNumber>
                <StatHelpText fontSize="xs" mt={1}>
                  {calculationResult.tcs > 0 ? '5% on amount over ₹10,00,000' : 'Not Applicable'}
                </StatHelpText>
              </Stat>

              {/* Total Amount - Full Width */}
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <Box 
                  bg="green.700" 
                  p={5} 
                  borderRadius="lg" 
                  boxShadow="md"
                >
                  <Text color="green.100" fontSize="sm" fontWeight="medium" mb={1}>
                    TOTAL AMOUNT
                  </Text>
                  <Text color="white" fontSize="2xl" fontWeight="bold">
                    {formatCurrency(calculationResult.grandTotal)}
                  </Text>
                  <Text color="green.100" fontSize="xs" mt={1}>
                    Final amount to be paid by customer
                  </Text>
                </Box>
              </GridItem>

            </Grid>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AgentForexCalculator;