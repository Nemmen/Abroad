import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Select,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import ReactApexChart from "react-apexcharts"; // Import the new chart library
import axios from "axios";
import dayjs from "dayjs";

export default function Conversion(props) {
  const { ...rest } = props;

  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState({ approved: 0, pending: 0, blocked: 0 });
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [loading, setLoading] = useState(true); // Loading state

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/admin/getuser", {
          withCredentials: true,
        });
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length === 0) return;

    const filteredUsers = users.filter((user) => {
      const createdAt = dayjs(user.createdAt);
      if (timeFilter === "daily") {
        return createdAt.isSame(dayjs(), "day");
      } else if (timeFilter === "monthly") {
        return createdAt.isSame(dayjs(), "month");
      } else if (timeFilter === "yearly") {
        return createdAt.isSame(dayjs(), "year");
      }
      return true;
    });

    const userStatusCounts = filteredUsers.reduce(
      (acc, user) => {
        if (user.userStatus === "active") acc.approved += 1;
        if (user.userStatus === "pending") acc.pending += 1;
        if (user.userStatus === "block") acc.blocked += 1;
        return acc;
      },
      { approved: 0, pending: 0, blocked: 0 }
    );

    setFilteredData(userStatusCounts);
  }, [users, timeFilter]);

  // Prepare data for pie chart
  const pieChartData = [
    { name: "Approved", value: filteredData.approved || 0 },
    { name: "Pending", value: filteredData.pending || 0 },
    { name: "Blocked", value: filteredData.blocked || 0 },
  ];

  // Chart configuration for ReactApexChart
  const pieChartOptions = {
    chart: {
      type: "pie",
    },
    labels: pieChartData.map((data) => data.name),
    colors: ["#4318FF", "#6AD2FF", "#FF6A6A"],
    legend: {
      position: "bottom",
      labels: {
        useSeriesColors: true,
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  const pieChartSeries = pieChartData.map((data) => data.value); // Map values for the chart

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
          User Status Overview
        </Text>
        <Select
          fontSize="sm"
          variant="subtle"
          value={timeFilter}
          onChange={handleTimeFilterChange}
          fontWeight="700"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </Flex>

      {loading ? (
        <Flex justifyContent="center" alignItems="center" mt="20px">
          <Spinner size="lg" color={textColor} />
        </Flex>
      ) : (
        <ReactApexChart
          options={pieChartOptions}
          series={pieChartSeries}
          type="pie"
          height="300"
        />
      )}

      <Card
        bg={cardColor}
        boxShadow={cardShadow}
        w="100%"
        p="15px"
        px="20px"
        mt="15px"
        mx="auto"
      >
        <Flex justifyContent="center">
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
            {pieChartOptions.labels.map((label, index) => (
              <Flex key={index} direction="column" align="center" py="5px">
                <Flex align="center">
                  <Box
                    h="8px"
                    w="8px"
                    bg={pieChartOptions.colors[index]}
                    borderRadius="50%"
                    me="4px"
                  />
                  <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
                    {label}
                  </Text>
                </Flex>
                <Text fontSize="lg" color={textColor} fontWeight="700">
                  {pieChartData[index].value}
                </Text>
              </Flex>
            ))}
          </Box>
        </Flex>
      </Card>
    </Card>
  );
}
