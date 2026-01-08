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

// Auth config utility for cookies
const getAuthConfig = () => {
  return {
    withCredentials: true
  };
};

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

const ForexCalculator = () => {
  const toast = useToast();
  
  // Form state
  const [currencyType, setCurrencyType] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState(10000);
  const [ibrRate, setIbrRate] = useState(83.00); // Live IBR rate from API
  const [pmMargin, setPmMargin] = useState(0.20); // Base PM margin (fixed at ₹0.20)
  const [aeMargin, setAeMargin] = useState(0.00); // AE margin - admin adjustable, visible to admin only
  const [agentMargin, setAgentMargin] = useState(0.35);
  
  // AE Margin persistence state
  const [isSavingAeMargin, setIsSavingAeMargin] = useState(false);
  const [includeFlyWire, setIncludeFlyWire] = useState(false);
  const [includeCIBC, setIncludeCIBC] = useState(false);
  const [flyWireAmount, setFlyWireAmount] = useState(750);
  const [cibcAmount, setCibcAmount] = useState(1500);
  
  // Loading states
  const [isRateLoading, setIsRateLoading] = useState(false);
  
  // Results state
  const [calculationResult, setCalculationResult] = useState({
    newRate: 0,
    inrConverted: 0,
    gst: 0,
    serviceCharge: 590,
    tcs: 0,
    flyWireCharge: 0,
    cibcCharge: 0,
    grandTotal: 0
  });
  
  // Debounced values for performance
  const [debouncedCurrencyType, setDebouncedCurrencyType] = useState(currencyType);
  
  useDebounce(() => {
    setDebouncedCurrencyType(currencyType);
  }, 500, [currencyType]);
  
  // Load AE margin from backend API on mount
  useEffect(() => {
    const fetchAeMargin = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'https://abroad-backend-gray.vercel.app/api'}/forex/admin/ae-margin`,
          getAuthConfig()
        );
        if (response.data && response.data.success && response.data.data) {
          setAeMargin(parseFloat(response.data.data.aeMargin) || 0);
        }
      } catch (error) {
        console.error('Error fetching AE margin:', error);
        // Default to 0 if fetch fails
        setAeMargin(0);
      }
    };
    fetchAeMargin();
  }, []);
  
  // Save AE margin to backend API
  const saveAeMargin = async () => {
    setIsSavingAeMargin(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'https://abroad-backend-gray.vercel.app/api'}/forex/admin/ae-margin`,
        { aeMargin: parseFloat(aeMargin) },
        getAuthConfig()
      );
      
      if (response.data && response.data.success) {
        toast({
          title: 'AE Margin Saved',
          description: `AE margin set to ₹${aeMargin}. This will be applied to all agent quotes.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(response.data?.message || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving AE margin:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save AE margin',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSavingAeMargin(false);
    }
  };
  
  // Fetch IBR rate from API when currency changes
  useEffect(() => {
    const fetchIbrRate = async () => {
      if (!debouncedCurrencyType) return;
      
      setIsRateLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL || 'https://abroad-backend-gray.vercel.app/api'}/forex/get-rate/${debouncedCurrencyType}`,
          getAuthConfig()
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
  const calculateResults = useCallback(() => {
    // Calculate new currency rate
    const newRate = parseFloat(ibrRate) + parseFloat(pmMargin) + parseFloat(aeMargin) + parseFloat(agentMargin);
    
    // Calculate INR converted amount
    const inrConverted = parseFloat(foreignAmount) * newRate;
    
    // Calculate GST
    // Formula: =(100000*0.18%)+((C9-100000)*0.09%) where C9 is INR Converted
    let gst = 0;
    if (inrConverted <= 100000) {
      gst = inrConverted * 0.0018; // 0.18%
    } else {
      gst = (100000 * 0.0018) + ((inrConverted - 100000) * 0.0009); // 0.18% for first 1L, then 0.09%
    }
    
    // Calculate TCS (Tax Collected at Source)
    // TCS is 5% on amounts over 10 lakhs
    const tcs = inrConverted > 1000000 ? (inrConverted - 1000000) * 0.05 : 0;
    
    // Calculate additional charges
    const flyWireCharge = includeFlyWire ? parseFloat(flyWireAmount) : 0;
    const cibcCharge = includeCIBC ? parseFloat(cibcAmount) : 0;
    
    // Calculate grand total
    const serviceCharge = 590; // Fixed service charge
    const grandTotal = inrConverted + gst + serviceCharge + tcs + flyWireCharge + cibcCharge;
    
    // Update calculation result
    setCalculationResult({
      newRate,
      inrConverted,
      gst,
      serviceCharge,
      tcs,
      flyWireCharge,
      cibcCharge,
      grandTotal
    });
    
  }, [
    ibrRate,
    pmMargin,
    aeMargin,
    agentMargin,
    foreignAmount,
    includeFlyWire,
    includeCIBC,
    flyWireAmount,
    cibcAmount
  ]);
  
  // Recalculate when inputs change
  useEffect(() => {
    calculateResults();
  }, [
    ibrRate,
    pmMargin,
    aeMargin,
    agentMargin,
    foreignAmount,
    includeFlyWire,
    includeCIBC,
    flyWireAmount,
    cibcAmount,
    calculateResults
  ]);
  
  // Format currency
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Handle number input change
  const handleNumberInput = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setter(value);
    }
  };

  return (
    <Box 
      p={6} 
      bgColor="white" 
      borderRadius="lg" 
      boxShadow="md"
      maxWidth="1200px"
      mx="auto"
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4} color="blue.600">
            Abrocare Forex Calculator
          </Text>
          <Text fontSize="md" color="gray.600" mb={6}>
            Calculate currency conversion with precise margins and charges
          </Text>
        </Box>
        
        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={8}>
          {/* Left Section - Inputs */}
          <GridItem>
            <VStack spacing={5} align="stretch">
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">Input Parameters</Text>
              
              {/* Currency Selection & Amount */}
              <FormControl>
                <FormLabel>Currency Type</FormLabel>
                <Select
                  value={currencyType}
                  onChange={(e) => setCurrencyType(e.target.value)}
                >
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Foreign Amount</FormLabel>
                <Input
                  type="number"
                  value={foreignAmount}
                  onChange={handleNumberInput(setForeignAmount)}
                  placeholder="Enter amount"
                />
                <FormHelperText>Amount in {currencyType}</FormHelperText>
              </FormControl>
              
              <Divider my={2} />
              
              {/* Rate & Margins */}
              <FormControl>
                <FormLabel>
                  IBR (Base Exchange Rate) 
                  {isRateLoading && <Spinner size="xs" ml={2} color="blue.500" />}
                </FormLabel>
                <Input
                  type="number"
                  value={ibrRate}
                  onChange={handleNumberInput(setIbrRate)}
                  placeholder="Base exchange rate"
                  step="0.01"
                />
                <FormHelperText>
                  Current rate: 1 {currencyType} = ₹{ibrRate}
                </FormHelperText>
              </FormControl>
              
              <FormControl>
                <FormLabel>PM Margin (Base ₹0.20)</FormLabel>
                <Input
                  type="number"
                  value={pmMargin}
                  onChange={handleNumberInput(setPmMargin)}
                  placeholder="Platform margin"
                  step="0.01"
                />
                <FormHelperText>Base platform margin (default ₹0.20 added to IBR)</FormHelperText>
              </FormControl>
              
              <FormControl>
                <FormLabel>Agent Margin</FormLabel>
                <Input
                  type="number"
                  value={agentMargin}
                  onChange={handleNumberInput(setAgentMargin)}
                  placeholder="Agent margin"
                  step="0.01"
                />
                <FormHelperText>Agent's additional margin</FormHelperText>
              </FormControl>
              
              <Divider my={2} />
              
              {/* Optional Charges */}
              {/* <FormControl>
                <HStack>
                  <Checkbox
                    isChecked={includeFlyWire}
                    onChange={(e) => setIncludeFlyWire(e.target.checked)}
                  >
                    Include FlyWire Charges
                  </Checkbox>
                  <Input
                    type="number"
                    value={flyWireAmount}
                    onChange={handleNumberInput(setFlyWireAmount)}
                    placeholder="FlyWire amount"
                    isDisabled={!includeFlyWire}
                    width="150px"
                  />
                </HStack>
              </FormControl> */}
              
              {/* <FormControl>
                <HStack>
                  <Checkbox
                    isChecked={includeCIBC}
                    onChange={(e) => setIncludeCIBC(e.target.checked)}
                  >
                    Include CIBC Charges
                  </Checkbox>
                  <Input
                    type="number"
                    value={cibcAmount}
                    onChange={handleNumberInput(setCibcAmount)}
                    placeholder="CIBC amount"
                    isDisabled={!includeCIBC}
                    width="150px"
                  />
                </HStack>
              </FormControl> */}
              
              {/* Rate Controls Section */}
              <Box p={4} borderRadius="md" bgColor="orange.50" borderWidth="1px" borderColor="orange.200">
                <Text fontWeight="medium" color="gray.600" mb={3}>Rate Controls</Text>
                <HStack spacing={4} flexWrap="wrap">
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      setDebouncedCurrencyType(currencyType);
                    }}
                    isLoading={isRateLoading}
                    loadingText="Fetching"
                    size="sm"
                  >
                    Refresh Currency Rate
                  </Button>
                  
                  {/* AE Margin Control - Visible to Admin Only */}
                  <HStack>
                    <FormControl width="120px">
                      <FormLabel fontSize="xs" color="gray.600" mb={1}>AE Margin (₹)</FormLabel>
                      <Input
                        type="number"
                        value={aeMargin}
                        onChange={handleNumberInput(setAeMargin)}
                        placeholder="0.00"
                        step="0.01"
                        size="sm"
                        bg="white"
                      />
                    </FormControl>
                    <Button
                      colorScheme="orange"
                      onClick={saveAeMargin}
                      isLoading={isSavingAeMargin}
                      loadingText="Saving"
                      size="sm"
                      mt={6}
                    >
                      Save AE Margin
                    </Button>
                  </HStack>
                </HStack>
                <Text fontSize="xs" color="gray.500" mt={2}>
                  AE Margin is added on top of IBR + ₹0.20 and applied to all agent calculations.
                </Text>
              </Box>
            </VStack>
          </GridItem>
          
          {/* Right Section - Results */}
          <GridItem>
            <Box
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              bgColor="gray.50"
              height="100%"
            >
              <VStack spacing={5} align="stretch">
                <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                  Calculation Results
                </Text>
                
                {/* New Currency Rate */}
                <Box p={4} borderRadius="md" bgColor="blue.50" borderWidth="1px" borderColor="blue.200">
                  <Text fontWeight="medium" color="gray.600">New Currency Rate</Text>
                  <HStack spacing={3}>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                      ₹{calculationResult.newRate.toFixed(2)}
                    </Text>
                    <Badge colorScheme="blue">
                      1 {currencyType} = ₹{calculationResult.newRate.toFixed(2)}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    IBR ({ibrRate}) + PM/Base ({pmMargin}) + AE ({aeMargin}) + Agent ({agentMargin})
                  </Text>
                </Box>
                
                {/* AE Margin Info Box - Admin Only */}
                <Box p={3} borderRadius="md" bgColor="orange.50" borderWidth="1px" borderColor="orange.200">
                  <HStack justify="space-between">
                    <Text fontSize="sm" fontWeight="medium" color="orange.700">Current AE Margin:</Text>
                    <Badge colorScheme="orange" fontSize="md">₹{parseFloat(aeMargin).toFixed(2)}</Badge>
                  </HStack>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Adjusted Base Rate: IBR + ₹0.20 = ₹{(parseFloat(ibrRate) + 0.20).toFixed(2)}
                  </Text>
                </Box>
                
                {/* Converted Amount */}
                <Stat>
                  <StatLabel>INR Converted Amount</StatLabel>
                  <StatNumber>
                    {formatCurrency(calculationResult.inrConverted)}
                  </StatNumber>
                  <StatHelpText>
                    {foreignAmount} {currencyType} × {calculationResult.newRate.toFixed(2)}
                  </StatHelpText>
                </Stat>
                
                <Divider />
                
                {/* Charges Breakdown */}
                <Text fontWeight="medium" color="gray.600">Additional Charges</Text>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Stat>
                    <StatLabel>GST</StatLabel>
                    <StatNumber>
                      {formatCurrency(calculationResult.gst)}
                    </StatNumber>
                  </Stat>
                  
                  <Stat>
                    <StatLabel>Service Charge</StatLabel>
                    <StatNumber>
                      {formatCurrency(calculationResult.serviceCharge)}
                    </StatNumber>
                  </Stat>
                  
                  <Stat>
                    <StatLabel>TCS (&gt;10L)</StatLabel>
                    <StatNumber>
                      {formatCurrency(calculationResult.tcs)}
                    </StatNumber>
                    <StatHelpText>
                      {calculationResult.tcs > 0 ? '5% on amount over ₹10,00,000' : 'Not Applicable'}
                    </StatHelpText>
                  </Stat>
                </Grid>
                
                {(includeFlyWire || includeCIBC) && (
                  <>
                    <Divider />
                    <Text fontWeight="medium" color="gray.600">Optional Charges</Text>
                    
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      {includeFlyWire && (
                        <Stat>
                          <StatLabel>FlyWire Charges</StatLabel>
                          <StatNumber>
                            {formatCurrency(calculationResult.flyWireCharge)}
                          </StatNumber>
                        </Stat>
                      )}
                      
                      {includeCIBC && (
                        <Stat>
                          <StatLabel>CIBC Charges</StatLabel>
                          <StatNumber>
                            {formatCurrency(calculationResult.cibcCharge)}
                          </StatNumber>
                        </Stat>
                      )}
                    </Grid>
                  </>
                )}
                
                <Divider />
                
                {/* Grand Total */}
                <Box p={4} borderRadius="md" bgColor="green.50" borderWidth="1px" borderColor="green.200">
                  <Text fontWeight="medium" color="gray.600">Grand Total (INR)</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="green.600">
                    {formatCurrency(calculationResult.grandTotal)}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Total amount including all charges
                  </Text>
                </Box>
                
                {/* Foreign Equivalent */}
                <Box p={4} borderRadius="md" bgColor="purple.50" borderWidth="1px" borderColor="purple.200">
                  <Text fontWeight="medium" color="gray.600">
                    Equivalent in {currencyType}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    {getCurrencySymbol(currencyType)}{(calculationResult.grandTotal / calculationResult.newRate).toFixed(2)}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default ForexCalculator;