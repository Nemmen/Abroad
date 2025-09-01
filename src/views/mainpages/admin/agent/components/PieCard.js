import React, { useState, useEffect, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Spinner,
  Center,
  Button,
  HStack,
  VStack,
  Badge,
  Tooltip,
  useBreakpointValue
} from "@chakra-ui/react";

const PieCard = ({ isLoading, users = [] }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const textColor = useColorModeValue("gray.700", "gray.50");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const cardBg = useColorModeValue("white", "gray.700");
  
  // Responsive adjustments
  const chartHeight = useBreakpointValue({ base: "220px", md: "260px" });
  const donutSize = useBreakpointValue({ base: "70%", md: "65%" });
  
  // Calculate agent distribution by status - memoized for performance
  const calculateDistribution = useCallback(() => {
    if (!users || users.length === 0) {
      return [1, 0, 0]; // Default values to show empty chart
    }
    
    const active = users.filter(u => u.userStatus === 'active').length;
    const pending = users.filter(u => u.userStatus === 'pending').length;
    const blocked = users.filter(u => u.userStatus === 'block' || u.userStatus === 'blocked').length;
    
    return [active, pending, blocked];
  }, [users]);
  
  // Calculate percentages for display
  const calculatePercentages = useCallback(() => {
    const [active, pending, blocked] = calculateDistribution();
    const total = active + pending + blocked;
    
    if (total === 0) return [0, 0, 0];
    
    return [
      Math.round((active / total) * 100),
      Math.round((pending / total) * 100),
      Math.round((blocked / total) * 100)
    ];
  }, [calculateDistribution]);

  const [chartData, setChartData] = useState({
    series: calculateDistribution(),
    options: {
      chart: {
        type: "donut",
        animations: {
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const statusIndex = config.dataPointIndex;
            setActiveFilter(activeFilter === statusIndex ? null : statusIndex);
          }
        }
      },
      colors: ["#38A169", "#DD6B20", "#E53E3E"],
      labels: ["Active", "Pending", "Blocked"],
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: donutSize,
            labels: {
              show: true,
              total: {
                show: true,
                fontSize: "22px",
                fontWeight: 600,
                color: textColor,
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                },
              },
              value: {
                fontSize: "16px",
                show: true,
                color: textColor,
                offsetY: 8,
              },
            },
          },
        },
      },
      stroke: {
        width: 2,
        colors: [cardBg]
      },
      tooltip: {
        enabled: true,
        theme: useColorModeValue("light", "dark"),
        y: {
          formatter: function(value, { seriesIndex, w }) {
            const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} agents (${percentage}%)`;
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 250
          }
        }
      }],
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.85
          }
        },
        active: {
          filter: {
            type: 'darken',
            value: 0.5
          }
        }
      }
    },
  });
  
  // Update chart when users data changes
  useEffect(() => {
    if (!isLoading) {
      setChartData(prev => ({
        ...prev,
        series: calculateDistribution()
      }));
    }
  }, [isLoading, calculateDistribution]);

  const legendItems = [
    { color: "#38A169", label: "Active", status: "active" },
    { color: "#DD6B20", label: "Pending", status: "pending" },
    { color: "#E53E3E", label: "Blocked", status: "blocked" },
  ];

  // Get the filtered users based on active filter
  const getFilteredUsers = () => {
    if (activeFilter === null) return users.length;
    
    const status = legendItems[activeFilter].status;
    return users.filter(u => {
      if (status === 'blocked') {
        return u.userStatus === 'block' || u.userStatus === 'blocked';
      }
      return u.userStatus === status;
    }).length;
  };

  // Percentages for display
  const percentages = calculatePercentages();

  return (
    <Box>
      {isLoading ? (
        <Center p={8}>
          <Spinner size="xl" color="blue.500" thickness="3px" speed="0.65s" />
        </Center>
      ) : (
        <>
          <VStack spacing={4}>
            <Box 
              height={chartHeight} 
              width="100%" 
              position="relative"
              aria-label="Agent status distribution chart"
            >
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="donut"
                width="100%"
                height="100%"
              />
              
              {activeFilter !== null && (
                <Button 
                  position="absolute" 
                  top={2} 
                  right={2}
                  size="xs"
                  colorScheme="gray"
                  onClick={() => setActiveFilter(null)}
                >
                  Clear
                </Button>
              )}
            </Box>
            
            <HStack 
              spacing={3} 
              flexWrap="wrap" 
              justify="center"
              mt={2}
            >
              {legendItems.map((item, index) => (
                <Tooltip 
                  key={index} 
                  label={`${item.label}: ${chartData.series[index]} agents (${percentages[index]}%)`}
                  hasArrow
                >
                  <Flex 
                    align="center" 
                    bg={activeFilter === index ? `${item.color}50` : 'transparent'} 
                    borderRadius="md"
                    px={2}
                    py={1}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ bg: `${item.color}30` }}
                    onClick={() => setActiveFilter(activeFilter === index ? null : index)}
                    role="button"
                    aria-pressed={activeFilter === index}
                    tabIndex={0}
                    aria-label={`Filter by ${item.label} agents`}
                  >
                    <Box
                      w={4}
                      h={4}
                      borderRadius="full"
                      bg={item.color}
                      mr={2}
                      boxShadow={activeFilter === index ? "0 0 0 2px white, 0 0 0 4px " + item.color : "none"}
                    />
                    <Text color={textColor} fontSize="sm" fontWeight={activeFilter === index ? "bold" : "normal"}>
                      {item.label}
                      <Text as="span" ml={1} color={subTextColor}>
                        ({percentages[index]}%)
                      </Text>
                    </Text>
                  </Flex>
                </Tooltip>
              ))}
            </HStack>
            
            {activeFilter !== null && (
              <Badge 
                colorScheme={activeFilter === 0 ? "green" : activeFilter === 1 ? "orange" : "red"}
                fontSize="md"
                borderRadius="full"
                px={3}
                py={1}
              >
                {getFilteredUsers()} {legendItems[activeFilter].label} Agents
              </Badge>
            )}
          </VStack>
        </>
      )}
    </Box>
  );
};

export default PieCard;