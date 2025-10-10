import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Paper,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from "axios";
import { useSelector } from "react-redux";
import { format, startOfWeek, startOfMonth, startOfYear, eachWeekOfInterval, eachMonthOfInterval, subWeeks, subMonths, subYears } from 'date-fns';

const DashboardCharts = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.Auth);
  
  // States
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('monthly'); // weekly, monthly, yearly
  const [chartType, setChartType] = useState('line'); // line, bar, pie
  const [dataRange, setDataRange] = useState('6'); // 6 weeks/months/years
  
  // Data states
  const [forexData, setForexData] = useState([]);
  const [gicData, setGicData] = useState([]);
  const [blockedData, setBlockedData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalForex: 0,
    totalGic: 0,
    totalBlocked: 0,
    totalEarnings: 0,
  });

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token_auth");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all data
        const [forexResponse, gicResponse, blockedResponse, earningsResponse] = await Promise.all([
          axios.get("https://abroad-backend-gray.vercel.app/auth/getForexByAgent", { headers }),
          axios.get("https://abroad-backend-gray.vercel.app/auth/getGicByAgent", { headers }),
          axios.get("https://abroad-backend-gray.vercel.app/auth/getBlockedByAgent", { headers }),
          axios.get("https://abroad-backend-gray.vercel.app/auth/getAgentCommission", { headers }),
        ]);

        setForexData(forexResponse.data);
        setGicData(gicResponse.data);
        setBlockedData(blockedResponse.data);
        setEarningsData(earningsResponse.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data based on time period
  const processedData = useMemo(() => {
    if (!forexData.length && !gicData.length && !blockedData.length) return [];

    const now = new Date();
    let intervals = [];
    let formatString = '';

    // Generate time intervals based on selected period
    switch (timePeriod) {
      case 'weekly':
        const weeksAgo = subWeeks(now, parseInt(dataRange));
        intervals = eachWeekOfInterval({ start: weeksAgo, end: now });
        formatString = 'MMM dd';
        break;
      case 'monthly':
        const monthsAgo = subMonths(now, parseInt(dataRange));
        intervals = eachMonthOfInterval({ start: monthsAgo, end: now });
        formatString = 'MMM yyyy';
        break;
      case 'yearly':
        const yearsAgo = subYears(now, parseInt(dataRange));
        intervals = [];
        for (let i = parseInt(dataRange); i >= 0; i--) {
          intervals.push(subYears(now, i));
        }
        formatString = 'yyyy';
        break;
      default:
        return [];
    }

    // Process each interval
    const result = intervals.map(intervalStart => {
      let intervalEnd;
      switch (timePeriod) {
        case 'weekly':
          intervalEnd = new Date(intervalStart);
          intervalEnd.setDate(intervalEnd.getDate() + 6);
          break;
        case 'monthly':
          intervalEnd = new Date(intervalStart.getFullYear(), intervalStart.getMonth() + 1, 0);
          break;
        case 'yearly':
          intervalEnd = new Date(intervalStart.getFullYear(), 11, 31);
          break;
        default:
          intervalEnd = intervalStart;
      }

      const periodLabel = format(intervalStart, formatString);

      // Count items in this period
      const forexCount = forexData.filter(item => {
        const itemDate = new Date(item.createdAt || item.date);
        return itemDate >= intervalStart && itemDate <= intervalEnd;
      }).length;

      const gicCount = gicData.filter(item => {
        const itemDate = new Date(item.createdAt || item.accOpeningMonth);
        return itemDate >= intervalStart && itemDate <= intervalEnd;
      }).length;

      const blockedCount = blockedData.filter(item => {
        const itemDate = new Date(item.createdAt || item.date);
        return itemDate >= intervalStart && itemDate <= intervalEnd;
      }).length;

      // Calculate earnings for this period
      const forexEarnings = forexData
        .filter(item => {
          const itemDate = new Date(item.createdAt || item.date);
          return itemDate >= intervalStart && itemDate <= intervalEnd && 
                 item.commissionStatus === 'received';
        })
        .reduce((sum, item) => sum + (parseFloat(item.agentCommission) || 0), 0);

      const gicEarnings = gicData
        .filter(item => {
          const itemDate = new Date(item.createdAt || item.accOpeningMonth);
          return itemDate >= intervalStart && itemDate <= intervalEnd && 
                 item.commissionStatus === 'received';
        })
        .reduce((sum, item) => sum + (parseFloat(item.commissionAmt) || 0), 0);

      return {
        period: periodLabel,
        forex: forexCount,
        gic: gicCount,
        blocked: blockedCount,
        forexEarnings: forexEarnings,
        gicEarnings: gicEarnings,
        totalEarnings: forexEarnings + gicEarnings,
        totalTransactions: forexCount + gicCount + blockedCount,
      };
    });

    // Calculate summary stats
    const totalStats = result.reduce((acc, curr) => ({
      totalForex: acc.totalForex + curr.forex,
      totalGic: acc.totalGic + curr.gic,
      totalBlocked: acc.totalBlocked + curr.blocked,
      totalEarnings: acc.totalEarnings + curr.totalEarnings,
    }), { totalForex: 0, totalGic: 0, totalBlocked: 0, totalEarnings: 0 });

    setSummaryStats(totalStats);
    return result;
  }, [forexData, gicData, blockedData, timePeriod, dataRange]);

  // Chart colors
  const colors = {
    forex: '#3B82F6',
    gic: '#10B981', 
    blocked: '#F59E0B',
    earnings: '#8B5CF6',
  };

  // Render different chart types
  const renderChart = () => {
    if (chartType === 'pie') {
      const pieData = [
        { id: 0, value: summaryStats.totalForex, label: 'Forex', color: colors.forex },
        { id: 1, value: summaryStats.totalGic, label: 'GIC', color: colors.gic },
        { id: 2, value: summaryStats.totalBlocked, label: 'Blocked', color: colors.blocked },
      ];

      return (
        <PieChart
          series={[
            {
              data: pieData,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={400}
        />
      );
    }

    const xLabels = processedData.map(item => item.period);
    const forexValues = processedData.map(item => item.forex);
    const gicValues = processedData.map(item => item.gic);
    const blockedValues = processedData.map(item => item.blocked);

    const chartProps = {
      xAxis: [{ scaleType: 'point', data: xLabels }],
      series: [
        { data: forexValues, label: 'Forex', color: colors.forex },
        { data: gicValues, label: 'GIC', color: colors.gic },
        { data: blockedValues, label: 'Blocked', color: colors.blocked },
      ],
      height: 400,
      margin: { left: 50, right: 50, top: 50, bottom: 50 },
    };

    return chartType === 'bar' ? <BarChart {...chartProps} /> : <LineChart {...chartProps} />;
  };

  // Render earnings chart
  const renderEarningsChart = () => {
    const xLabels = processedData.map(item => item.period);
    const forexEarnings = processedData.map(item => item.forexEarnings);
    const gicEarnings = processedData.map(item => item.gicEarnings);

    return (
      <BarChart
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        series={[
          { data: forexEarnings, label: 'Forex Earnings', color: colors.forex },
          { data: gicEarnings, label: 'GIC Earnings', color: colors.gic },
        ]}
        height={300}
        margin={{ left: 50, right: 50, top: 50, bottom: 50 }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Forex', value: summaryStats.totalForex, color: colors.forex },
          { label: 'Total GIC', value: summaryStats.totalGic, color: colors.gic },
          { label: 'Total Blocked', value: summaryStats.totalBlocked, color: colors.blocked },
          { label: 'Total Earnings', value: `₹${summaryStats.totalEarnings.toLocaleString()}`, color: colors.earnings },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
          {/* Time Period Toggle */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Time Period</Typography>
            <ToggleButtonGroup
              value={timePeriod}
              exclusive
              onChange={(e, value) => value && setTimePeriod(value)}
              size="small"
            >
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Chart Type Toggle */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Chart Type</Typography>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(e, value) => value && setChartType(value)}
              size="small"
            >
              <ToggleButton value="line">Line</ToggleButton>
              <ToggleButton value="bar">Bar</ToggleButton>
              <ToggleButton value="pie">Pie</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Data Range Select */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Range</InputLabel>
            <Select
              value={dataRange}
              label="Range"
              onChange={(e) => setDataRange(e.target.value)}
            >
              <MenuItem value="3">Last 3 {timePeriod === 'yearly' ? 'years' : timePeriod === 'monthly' ? 'months' : 'weeks'}</MenuItem>
              <MenuItem value="6">Last 6 {timePeriod === 'yearly' ? 'years' : timePeriod === 'monthly' ? 'months' : 'weeks'}</MenuItem>
              <MenuItem value="12">Last 12 {timePeriod === 'yearly' ? 'years' : timePeriod === 'monthly' ? 'months' : 'weeks'}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Main Transaction Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Transaction Overview ({timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)})
          </Typography>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Earnings Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Earnings Overview ({timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)})
          </Typography>
          {renderEarningsChart()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardCharts;