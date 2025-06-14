import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Grid, 
  GridItem, 
  Container, 
  useColorModeValue,
  Heading,
  Flex,
  Divider,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Badge,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
  Progress
} from '@chakra-ui/react';
import { 
  MdPeople, 
  MdAttachMoney, 
  MdTrendingUp, 
  MdAssignment,
  MdDateRange,
  MdBusinessCenter,
  MdAccountBalance,
  MdMoneyOff
} from 'react-icons/md';

// Custom components
import Banner from 'views/admin/marketplace/components/Banner';
import NotificationBar from './components/NotificationBar';
import ForexcurrentMonth from './components/ForexcurrentMonth';
import GICcurrentMonth from './components/GicCurrent';
import { ForexYearStatus } from './components/ForexYearStatus';
import GICYearlyStatus from './components/GICYearlyStatus';
import GICForexStatus from './components/GICForexStatus';

// Constants
const API_BASE_URL = 'http://localhost:4000/api/admin/analytics';

export default function AdminDashboard() {
  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const sectionBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('gray.700', 'gray.100');
  const statBgPositive = useColorModeValue('green.50', 'green.900');
  const statBgNeutral = useColorModeValue('blue.50', 'blue.900');
  const statBgNegative = useColorModeValue('red.50', 'red.900');
  
  // Icon background colors
  const blueIconBg = useColorModeValue('blue.50', 'blue.900');
  const purpleIconBg = useColorModeValue('purple.50', 'purple.900');
  const cyanIconBg = useColorModeValue('cyan.50', 'cyan.900');
  const greenIconBg = useColorModeValue('green.50', 'green.900');
  const orangeIconBg = useColorModeValue('orange.50', 'orange.900');
  const redIconBg = useColorModeValue('red.50', 'red.900');
  
  // States for data
  const [dashboardStats, setDashboardStats] = useState(null);
  const [forexData, setForexData] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyGICData, setMonthlyGICData] = useState(null);
  const [monthlyForexData, setMonthlyForexData] = useState(null);
  const [yearlyGICData, setYearlyGICData] = useState(null);
  const [yearlyForexData, setYearlyForexData] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage
        const token = localStorage.getItem('token_auth');
        
        if (!token) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }
        
        // Set up headers with the token
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        // Parallel API calls for better performance
        const [statsRes, entriesRes, agentsRes, forexGicRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/dashboard-stats`, { headers }),
          axios.get(`${API_BASE_URL}/getRecentEntries?limit=5`, { headers }),
          axios.get(`${API_BASE_URL}/agent-comparison`, { headers }),
          axios.get(`${API_BASE_URL}/getForexAndGicData`, { headers })
        ]);
        
        // Set state with API responses
        setDashboardStats(statsRes.data.stats);
        setRecentEntries(entriesRes.data.entries);
        setTopAgents(agentsRes.data.topByTransactions);
        setForexData(forexGicRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // More detailed error handling
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch chart data separately
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setChartLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token_auth');
        
        if (!token) return;
        
        // Set up headers with the token
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        // Fetch chart data in parallel
        const [monthlyGICRes, monthlyForexRes, yearlyGICRes, yearlyForexRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/getCurrentMonthGICs`, { headers }),
          axios.get(`${API_BASE_URL}/getCurrentMonthForex`, { headers }),
          axios.get(`${API_BASE_URL}/getYearlyGICData`, { headers }),
          axios.get(`${API_BASE_URL}/getYearlyForexData`, { headers })
        ]);
        
        setMonthlyGICData(monthlyGICRes.data);
        setMonthlyForexData(monthlyForexRes.data);
        setYearlyGICData(yearlyGICRes.data);
        setYearlyForexData(yearlyForexRes.data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box
      bg={bgColor}
      minH="100vh"
      pt={{ base: 3, md: 5 }}
      px={{ base: 2, md: 5 }}
      pb={{ base: 5, md: 8 }}
    >
      <Container maxW="1600px" p={0}>
        {/* Top Section - Banner and Notifications */}
        <Grid 
          templateColumns={{ base: '1fr', lg: '3fr 1fr' }}
          gap={{ base: 4, md: 6 }}
          mb={{ base: 6, md: 8 }}
        >
          <GridItem>
            <Box 
              borderRadius="xl"
              overflow="hidden"
              boxShadow="sm"
            >
              <Banner />
            </Box>
          </GridItem>
          
          <GridItem>
            <Box 
              borderRadius="xl"
              overflow="hidden"
              boxShadow="sm"
              height="100%"
            >
              <NotificationBar />
            </Box>
          </GridItem>
        </Grid>
        
        {/* Key Stats Overview Section */}
        <Box mb={{ base: 6, md: 8 }}>
          <Flex 
            align="center"
            mb={4}
          >
            <Heading 
              size="md" 
              color={headingColor}
              fontWeight="600"
            >
              Dashboard Overview
            </Heading>
            <Divider ml={4} flex="1" />
          </Flex>
          
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 3, md: 5 }}>
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} height="120px" borderRadius="xl" />
              ))}
            </SimpleGrid>
          ) : error ? (
            <Card bg={statBgNegative} borderRadius="xl" p={3}>
              <CardBody>
                <Text color="red.500">{error}</Text>
              </CardBody>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 3, md: 5 }}>
              {/* Agents Card */}
              <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
                <Box bg="blue.500" h={1} w="full" />
                <CardBody p={5}>
                  <Flex align="center" justify="space-between">
                    <Stack>
                      <Stat>
                        <StatLabel fontSize="sm" color="gray.500">Total Agents</StatLabel>
                        <StatNumber>{dashboardStats?.agents?.total || 0}</StatNumber>
                        <Flex mt={1} gap={3}>
                          <Badge colorScheme="green" px={2} py={0.5}>
                            Active: {dashboardStats?.agents?.active || 0}
                          </Badge>
                          <Badge colorScheme="yellow" px={2} py={0.5}>
                            Pending: {dashboardStats?.agents?.pending || 0}
                          </Badge>
                        </Flex>
                      </Stat>
                    </Stack>
                    <Box 
                      p={2} 
                      bg={blueIconBg} 
                      borderRadius="md"
                    >
                      <Icon as={MdPeople} boxSize={10} color="blue.500" />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              {/* GIC Card */}
              <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
                <Box bg="purple.500" h={1} w="full" />
                <CardBody p={5}>
                  <Flex align="center" justify="space-between">
                    <Stack>
                      <Stat>
                        <StatLabel fontSize="sm" color="gray.500">Total GIC</StatLabel>
                        <StatNumber>{dashboardStats?.transactions?.totalGIC || 0}</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {dashboardStats?.transactions?.currentMonthGIC || 0} this month
                        </StatHelpText>
                      </Stat>
                    </Stack>
                    <Box 
                      p={2} 
                      bg={purpleIconBg} 
                      borderRadius="md"
                    >
                      <Icon as={MdAssignment} boxSize={10} color="purple.500" />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              {/* Forex Card */}
              <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
                <Box bg="cyan.500" h={1} w="full" />
                <CardBody p={5}>
                  <Flex align="center" justify="space-between">
                    <Stack>
                      <Stat>
                        <StatLabel fontSize="sm" color="gray.500">Total Forex</StatLabel>
                        <StatNumber>{dashboardStats?.transactions?.totalForex || 0}</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {dashboardStats?.transactions?.currentMonthForex || 0} this month
                        </StatHelpText>
                      </Stat>
                    </Stack>
                    <Box 
                      p={2} 
                      bg={cyanIconBg} 
                      borderRadius="md"
                    >
                      <Icon as={MdBusinessCenter} boxSize={10} color="cyan.500" />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              {/* Commission Card */}
              <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
                <Box bg="green.500" h={1} w="full" />
                <CardBody p={5}>
                  <Flex align="center" justify="space-between">
                    <Stack>
                      <Stat>
                        <StatLabel fontSize="sm" color="gray.500">Total Commission</StatLabel>
                        <StatNumber>{formatCurrency(dashboardStats?.commission?.total || 0)}</StatNumber>
                        <Flex mt={1} gap={2}>
                          <Text fontSize="xs" color="gray.500">
                            Paid: {formatCurrency(dashboardStats?.commission?.paid || 0)}
                          </Text>
                          <Text fontSize="xs" color="orange.500">
                            Pending: {formatCurrency(dashboardStats?.commission?.pending || 0)}
                          </Text>
                        </Flex>
                      </Stat>
                    </Stack>
                    <Box 
                      p={2} 
                      bg={greenIconBg} 
                      borderRadius="md"
                    >
                      <Icon as={MdAttachMoney} boxSize={10} color="green.500" />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}
        </Box>
        
        {/* Forex Detailed Stats */}
        <Box mb={{ base: 6, md: 8 }}>
          <Flex 
            align="center"
            mb={4}
          >
            <Heading 
              size="md" 
              color={headingColor}
              fontWeight="600"
            >
              Forex Financial Metrics
            </Heading>
            <Divider ml={4} flex="1" />
          </Flex>
          
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 3, md: 5 }}>
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} height="120px" borderRadius="xl" />
              ))}
            </SimpleGrid>
          ) : error ? (
            <Card bg={statBgNegative} borderRadius="xl" p={3}>
              <CardBody>
                <Text color="red.500">{error}</Text>
              </CardBody>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 3, md: 5 }}>
              {/* Agent Commission Card */}
              <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
                <Box bg="teal.500" h={1} w="full" />
                <CardBody p={5}>
                  <Flex align="center" justify="space-between">
                    <Stack>
                      <Stat>
                        <StatLabel fontSize="sm" color="gray.500">Agent Commission</StatLabel>
                        <StatNumber>{formatCurrency(dashboardStats?.forex?.agentCommission?.total || 0)}</StatNumber>
                        <Flex mt={1} gap={2}>
                          <Text fontSize="xs" color="green.500">
                            Paid: {formatCurrency(dashboardStats?.forex?.agentCommission?.paid || 0)}
                          </Text>
                          <Text fontSize="xs" color="orange.500">
                            Pending: {formatCurrency(dashboardStats?.forex?.agentCommission?.pending || 0)}
                          </Text>
                        </Flex>
                      </Stat>
                    </Stack>
                    <Box 
                      p={2} 
                      bg={greenIconBg} 
                      borderRadius="md"
                    >
                      <Icon as={MdPeople} boxSize={10} color="teal.500" />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              {/* AE Commission Card */}
              <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
                <Box bg="green.500" h={1} w="full" />
                <CardBody p={5}>
                  <Flex align="center" justify="space-between">
                    <Stack>
                      <Stat>
                        <StatLabel fontSize="sm" color="gray.500">AE Commission</StatLabel>
                        <StatNumber>{formatCurrency(dashboardStats?.forex?.aeCommission || 0)}</StatNumber>
                        <StatHelpText>
                          From forex transactions
                        </StatHelpText>
                      </Stat>
                    </Stack>
                    <Box 
                      p={2} 
                      bg={greenIconBg} 
                      borderRadius="md"
                    >
                      <Icon as={MdAttachMoney} boxSize={10} color="green.500" />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              {/* TDS Card */}
              <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
                <Box bg="orange.500" h={1} w="full" />
                <CardBody p={5}>
                  <Flex align="center" justify="space-between">
                    <Stack>
                      <Stat>
                        <StatLabel fontSize="sm" color="gray.500">Total TDS</StatLabel>
                        <StatNumber>{formatCurrency(dashboardStats?.forex?.tds || 0)}</StatNumber>
                        <StatHelpText>
                          Deducted from commissions
                        </StatHelpText>
                      </Stat>
                    </Stack>
                    <Box 
                      p={2} 
                      bg={orangeIconBg} 
                      borderRadius="md"
                    >
                      <Icon as={MdMoneyOff} boxSize={10} color="orange.500" />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>

              {/* Net Payable Card */}
              <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
                <Box bg="blue.500" h={1} w="full" />
                <CardBody p={5}>
                  <Flex align="center" justify="space-between">
                    <Stack>
                      <Stat>
                        <StatLabel fontSize="sm" color="gray.500">Net Payable</StatLabel>
                        <StatNumber>{formatCurrency(dashboardStats?.forex?.netPayable || 0)}</StatNumber>
                        <StatHelpText>
                          Total after deductions
                        </StatHelpText>
                      </Stat>
                    </Stack>
                    <Box 
                      p={2} 
                      bg={blueIconBg} 
                      borderRadius="md"
                    >
                      <Icon as={MdAccountBalance} boxSize={10} color="blue.500" />
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}
        </Box>
        
        {/* GIC and Forex Stats */}
        <Box mb={{ base: 6, md: 8 }}>
          <Box 
            borderRadius="xl"
            overflow="hidden"
            boxShadow="sm"
          >
            <GICForexStatus
              data={forexData}
              loading={loading}
            />
          </Box>
        </Box>
        
        {/* Recent Activities and Top Agents */}
        <Grid 
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={{ base: 4, md: 6 }}
          mb={{ base: 6, md: 8 }}
        >
          {/* Recent Activities */}
          <GridItem>
            <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden" h="100%">
              <CardHeader 
                backgroundImage="linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)"
                color="white"
                py={3}
              >
                <Heading size="md" fontWeight={600}>Recent Activities</Heading>
              </CardHeader>
              <CardBody p={0}>
                {loading ? (
                  <Stack p={4}>
                    {[1, 2, 3].map((item) => (
                      <Skeleton key={item} height="60px" />
                    ))}
                  </Stack>
                ) : error ? (
                  <Box p={4}>
                    <Text color="red.500">{error}</Text>
                  </Box>
                ) : recentEntries.length === 0 ? (
                  <Box p={4} textAlign="center">
                    <Text color="gray.500">No recent activities found</Text>
                  </Box>
                ) : (
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Type</Th>
                        <Th>Date</Th>
                        <Th>Agent</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {recentEntries.map((entry) => (
                        <Tr key={entry.id}>
                          <Td>
                            <Badge 
                              colorScheme={entry.type === 'GIC' ? 'purple' : 'cyan'}
                              px={2}
                              py={1}
                              borderRadius="full"
                            >
                              {entry.type}
                            </Badge>
                          </Td>
                          <Td>{formatDate(entry.date)}</Td>
                          <Td>{entry.agent?.name || 'Unknown'}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                entry.commissionStatus === 'Paid' ? 'green' :
                                entry.commissionStatus === 'Under Processing' ? 'yellow' : 'red'
                              }
                              variant="subtle"
                            >
                              {entry.commissionStatus}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </GridItem>
          
          {/* Top Agents */}
          <GridItem>
            <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden" h="100%">
              <CardHeader 
                backgroundImage="linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)"
                color="white"
                py={3}
              >
                <Heading size="md" fontWeight={600}>Top Performing Agents</Heading>
              </CardHeader>
              <CardBody p={0}>
                {loading ? (
                  <Stack p={4}>
                    {[1, 2, 3].map((item) => (
                      <Skeleton key={item} height="60px" />
                    ))}
                  </Stack>
                ) : error ? (
                  <Box p={4}>
                    <Text color="red.500">{error}</Text>
                  </Box>
                ) : topAgents.length === 0 ? (
                  <Box p={4} textAlign="center">
                    <Text color="gray.500">No agent data available</Text>
                  </Box>
                ) : (
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Agent</Th>
                        <Th>Code</Th>
                        <Th>Transactions</Th>
                        <Th>Performance</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {topAgents.map((agent) => (
                        <Tr key={agent._id}>
                          <Td fontWeight="medium">{agent.name}</Td>
                          <Td>{agent.agentCode}</Td>
                          <Td isNumeric>
                            <Badge colorScheme="blue">
                              {agent.totalTransactions}
                            </Badge>
                          </Td>
                          <Td>
                            <Flex align="center">
                              <Progress
                                value={(agent.totalTransactions / (topAgents[0]?.totalTransactions || 1)) * 100}
                                size="sm"
                                colorScheme="green"
                                borderRadius="full"
                                width="80px"
                                mr={2}
                              />
                              <Text fontSize="xs">
                                {Math.round((agent.totalTransactions / (topAgents[0]?.totalTransactions || 1)) * 100)}%
                              </Text>
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
        
        {/* Monthly Charts */}
        <Grid 
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={{ base: 4, md: 6 }}
          mb={{ base: 6, md: 8 }}
        >
          <GridItem>
            <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
              <CardHeader py={3} px={4}>
                <Heading size="md" fontWeight={600}>Current Month GIC</Heading>
              </CardHeader>
              <CardBody>
                {chartLoading ? (
                  <Skeleton height="300px" />
                ) : (
                  <GICcurrentMonth data={monthlyGICData} />
                )}
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
              <CardHeader py={3} px={4}>
                <Heading size="md" fontWeight={600}>Current Month Forex</Heading>
              </CardHeader>
              <CardBody>
                {chartLoading ? (
                  <Skeleton height="300px" />
                ) : (
                  <ForexcurrentMonth data={monthlyForexData} />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
        
        {/* Yearly Charts */}
        <Grid 
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={{ base: 4, md: 6 }}
          mb={{ base: 6, md: 8 }}
        >
          <GridItem>
            <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
              <CardHeader py={3} px={4}>
                <Heading size="md" fontWeight={600}>Yearly GIC Trend</Heading>
              </CardHeader>
              <CardBody>
                {chartLoading ? (
                  <Skeleton height="300px" />
                ) : (
                  <GICYearlyStatus data={yearlyGICData} />
                )}
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card borderRadius="xl" boxShadow="sm" bg={sectionBg} overflow="hidden">
              <CardHeader py={3} px={4}>
                <Heading size="md" fontWeight={600}>Yearly Forex Trend</Heading>
              </CardHeader>
              <CardBody>
                {chartLoading ? (
                  <Skeleton height="300px" />
                ) : (
                  <ForexYearStatus data={yearlyForexData} />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}