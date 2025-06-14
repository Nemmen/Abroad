import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Chakra imports
import { 
  Box, 
  Flex, 
  Grid, 
  GridItem,
  SimpleGrid,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardHeader,
  CardBody,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  useDisclosure
} from '@chakra-ui/react';

// Icons
import { 
  MdPeople, 
  MdSearch, 
  MdTrendingUp, 
  MdAssignment, 
  MdBusinessCenter,
  MdPerson,
  MdAttachMoney,
  MdGroup
} from 'react-icons/md';

// Custom components
import PieCard from 'views/mainpages/admin/agent/components/PieCard';
import UserDataTable from './components/UserDataTable';
import AgentDetailView from './components/AgentDetailView';

// API base URL
const API_BASE_URL = 'http://localhost:4000/api/admin/analytics';

export default function Agent() {
  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const iconBgBlue = useColorModeValue('blue.50', 'blue.900');
  const iconBgPurple = useColorModeValue('purple.50', 'purple.900');
  const iconBgGreen = useColorModeValue('green.50', 'green.900');
  const headingColor = useColorModeValue('gray.700', 'gray.100');
  
  // States
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [agentStats, setAgentStats] = useState({
    totalGIC: 0,
    totalForex: 0,
    lastMonthGIC: 0,
    lastMonthForex: 0
  });
  const [topAgents, setTopAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentDetailLoading, setAgentDetailLoading] = useState(false);
  const [yearlyGicData, setYearlyGicData] = useState({ xAxis: [], series: [] });
  const [yearlyForexData, setYearlyForexData] = useState({ xAxis: [], series: [] });
  
  // Modal control
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate percentage increase safely
  const calculatePercentage = (current, total) => {
    if (!current || !total || total === 0) return 0;
    return Math.round((current / total) * 100);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token_auth');
        
        // Set up headers with the token
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        // Parallel API calls for better performance
        const [
          usersRes, 
          statsRes, 
          comparisonRes,
          yearlyGicRes,
          yearlyForexRes
        ] = await Promise.all([
          axios.get('http://localhost:4000/admin/getuser', { headers }),
          axios.get(`${API_BASE_URL}/agent-analytics`, { headers }),
          axios.get(`${API_BASE_URL}/agent-comparison`, { headers }),
          axios.get(`${API_BASE_URL}/getYearlyGICData`, { headers }),
          axios.get(`${API_BASE_URL}/getYearlyForexData`, { headers })
        ]);
        
        // Process users data
        const filteredUsers = usersRes.data.users.filter(user => user.role === 'user');
        setUsers(filteredUsers);
        
        // Process agent stats
        if (statsRes.data && statsRes.data.success) {
          setAgentStats(statsRes.data);
        }
        
        // Process top agents
        if (comparisonRes.data && comparisonRes.data.topByTransactions) {
          setTopAgents(comparisonRes.data.topByTransactions);
        }

        // Process yearly data
        if (yearlyGicRes.data && yearlyGicRes.data.success) {
          setYearlyGicData(yearlyGicRes.data);
        }

        if (yearlyForexRes.data && yearlyForexRes.data.success) {
          setYearlyForexData(yearlyForexRes.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        
        // Enhanced error handling
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError('Failed to load agent data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle agent click for details view
  async function handleUserRowClick(userData) {
    try {
      setSelectedAgent(null);
      setAgentDetailLoading(true);
      onOpen();
      
      // Get token from localStorage
      const token = localStorage.getItem('token_auth');
      
      // Set up headers with the token
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      // Fetch detailed agent data
      const response = await axios.get(`${API_BASE_URL}/agent/${userData._id}`, { headers });
      
      if (response.data && response.data.success) {
        setSelectedAgent(response.data.agent);
      }
    } catch (err) {
      console.error('Error fetching agent details:', err);
      setError('Failed to load agent details. Please try again.');
    } finally {
      setAgentDetailLoading(false);
    }
  }

  // Calculate stats safely
  const activeAgents = users.filter(u => u.userStatus === 'active').length || 0;
  const pendingAgents = users.filter(u => u.userStatus === 'pending').length || 0;
  const totalGIC = agentStats?.totalGIC || 0;
  const totalForex = agentStats?.totalForex || 0;
  const lastMonthGIC = agentStats?.lastMonthGIC || 0;
  const lastMonthForex = agentStats?.lastMonthForex || 0;
  const gicPercentage = calculatePercentage(lastMonthGIC, totalGIC);
  const forexPercentage = calculatePercentage(lastMonthForex, totalForex);

  return (
    <Box pt={4} px={4} bg={bgColor} minH="100vh">
      {/* Page Heading */}
      <Flex 
        justifyContent="space-between" 
        alignItems="center" 
        mb={6}
      >
        <Heading size="lg" color={textColor}>Agent Management</Heading>
        
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <Icon as={MdSearch} color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Search agents..." 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)} 
            borderRadius="lg"
          />
        </InputGroup>
      </Flex>
      
      {error && (
        <Alert status="error" borderRadius="lg" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Agent Statistics */}
      <Box mb={6}>
        <Flex 
          align="center"
          mb={4}
        >
          <Heading 
            size="md" 
            color={headingColor}
            fontWeight="600"
          >
            Agent Statistics
          </Heading>
          <Divider ml={4} flex="1" />
        </Flex>
        
        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {[1, 2, 3].map(i => (
              <Box key={i} p={5} borderRadius="xl" bg={cardBg} boxShadow="sm">
                <Spinner size="md" />
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {/* Total Agents */}
            <Card borderRadius="xl" boxShadow="sm">
              <CardBody p={5}>
                <Flex align="center" justify="space-between">
                  <Stat>
                    <StatLabel color="gray.500">Total Agents</StatLabel>
                    <StatNumber>{users.length}</StatNumber>
                    <StatHelpText>
                      <Flex mt={2} gap={2}>
                        <Badge colorScheme="green" px={2} py={0.5}>
                          Active: {activeAgents}
                        </Badge>
                        <Badge colorScheme="yellow" px={2} py={0.5}>
                          Pending: {pendingAgents}
                        </Badge>
                      </Flex>
                    </StatHelpText>
                  </Stat>
                  <Box p={3} borderRadius="lg" bg={iconBgBlue}>
                    <Icon as={MdPeople} boxSize={8} color="blue.500" />
                  </Box>
                </Flex>
              </CardBody>
            </Card>
            
            {/* GIC Transactions */}
            <Card borderRadius="xl" boxShadow="sm">
              <CardBody p={5}>
                <Flex align="center" justify="space-between">
                  <Stat>
                    <StatLabel color="gray.500">Total GIC Transactions</StatLabel>
                    <StatNumber>
                      {totalGIC}
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      {gicPercentage}% this month
                    </StatHelpText>
                  </Stat>
                  <Box p={3} borderRadius="lg" bg={iconBgPurple}>
                    <Icon as={MdAssignment} boxSize={8} color="purple.500" />
                  </Box>
                </Flex>
              </CardBody>
            </Card>
            
            {/* Forex Transactions */}
            <Card borderRadius="xl" boxShadow="sm">
              <CardBody p={5}>
                <Flex align="center" justify="space-between">
                  <Stat>
                    <StatLabel color="gray.500">Total Forex Transactions</StatLabel>
                    <StatNumber>
                      {totalForex}
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      {forexPercentage}% this month
                    </StatHelpText>
                  </Stat>
                  <Box p={3} borderRadius="lg" bg={iconBgGreen}>
                    <Icon as={MdBusinessCenter} boxSize={8} color="green.500" />
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}
      </Box>
      
      {/* Top Performing Agents & Analytics */}
      <Grid
        templateColumns={{ base: "1fr", xl: "2fr 1fr" }}
        gap={6}
        mb={6}
      >
        <GridItem>
          <Card borderRadius="xl" boxShadow="sm" overflow="hidden">
            <CardHeader 
              backgroundImage="linear-gradient(135deg, #047857 0%, #10B981 100%)"
              py={4}
            >
              <Heading size="md" color="white">Top Performing Agents</Heading>
            </CardHeader>
            <CardBody p={0}>
              {loading ? (
                <Flex justify="center" align="center" p={6}>
                  <Spinner size="lg" />
                </Flex>
              ) : topAgents.length === 0 ? (
                <Text p={4} textAlign="center">No agent data available</Text>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Agent Name</Th>
                      <Th>GIC</Th>
                      <Th>Forex</Th>
                      <Th>Total</Th>
                      <Th>Commission</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {topAgents.map((agent) => (
                      <Tr key={agent._id} 
                        _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                        onClick={() => handleUserRowClick(agent)}
                      >
                        <Td>
                          <Text fontWeight="medium">{agent.name}</Text>
                          <Text fontSize="xs" color="gray.500">{agent.agentCode}</Text>
                        </Td>
                        <Td>{agent.gicCount}</Td>
                        <Td>{agent.forexCount}</Td>
                        <Td>
                          <Badge colorScheme="green" variant="solid">
                            {agent.totalTransactions}
                          </Badge>
                        </Td>
                        <Td>{formatCurrency(agent.totalCommission || 0)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card borderRadius="xl" boxShadow="sm" overflow="hidden">
            <CardHeader 
              backgroundImage="linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)"
              py={4}
            >
              <Heading size="md" color="white">Agent Distribution</Heading>
            </CardHeader>
            <CardBody>
              <PieCard isLoading={loading} users={users} />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
      
      {/* All Agents Table */}
      <Box mb={6}>
        <Flex 
          align="center"
          mb={4}
        >
          <Heading 
            size="md" 
            color={headingColor}
            fontWeight="600"
          >
            All Agents
          </Heading>
          <Divider ml={4} flex="1" />
        </Flex>
        
        <Card borderRadius="xl" boxShadow="sm" overflow="hidden">
          <CardBody p={0}>
            <UserDataTable 
              tableData={users} 
              searchValue={searchValue} 
              setSearchValue={setSearchValue} 
              onRowClick={handleUserRowClick} 
              isLoading={loading}
            />
          </CardBody>
        </Card>
      </Box>

      {/* Agent Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Agent Details
            {selectedAgent && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                {selectedAgent.agentCode}
              </Text>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {agentDetailLoading ? (
              <Flex justify="center" align="center" h="400px">
                <Spinner size="xl" />
              </Flex>
            ) : selectedAgent ? (
              <AgentDetailView agent={selectedAgent} formatCurrency={formatCurrency} />
            ) : (
              <Text>No agent details available</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}