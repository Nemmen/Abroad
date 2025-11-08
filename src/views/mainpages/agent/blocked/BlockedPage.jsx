import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Tooltip
} from '@mui/material';
import DataTable from 'components/DataTable';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';

// Define the columns
const columns = [
  { field: 'sNo', headerName: 'SNo', width: 70 },
  { field: 'accOpeningMonth', headerName: 'Acc Opening Month', width: 150 },
  { field: 'studentName', headerName: 'Student Name', width: 150 },
  { field: 'passportNo', headerName: 'Passport No.', width: 130 },
  { field: 'studentPhoneNo', headerName: 'Student Contact', width: 130 },
  { field: 'bankVendor', headerName: 'Bank Vendor', width: 150 },
  { field: 'accFundingMonth', headerName: 'Acc Funding Month', width: 160 },
  { field: 'commissionAmt', headerName: 'Commission Amt', width: 140 },
  { field: 'tds', headerName: 'TDS', width: 100 },
  { field: 'netPayable', headerName: 'Net Payable', width: 140 },
  { field: 'commissionStatus', headerName: 'Commission Status', width: 160 },
];

const BlockedPage = () => {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();

  // Create MUI theme based on Chakra color mode
  const theme = createTheme({
    palette: {
      mode: colorMode,
      primary: {
        main: colorMode === 'light' ? '#3B82F6' : '#90CAF9',
      },
      secondary: {
        main: colorMode === 'light' ? '#10B981' : '#5CDB95',
      },
      background: {
        default: colorMode === 'light' ? '#ffffff' : '#121212',
        paper: colorMode === 'light' ? '#f9fafc' : '#1E1E1E',
      },
      text: {
        primary: colorMode === 'light' ? '#111827' : '#f3f4f6',
        secondary: colorMode === 'light' ? '#4B5563' : '#9CA3AF',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/agent/blocked', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_auth")}`,
          },
          withCredentials: true
        });
        
        if (response.data && response.data.success) {
          const blockedForms = response.data.gicForms || [];
          setData(blockedForms);
          
          const formattedRows = blockedForms.map((form, index) => ({
            id: form._id || index, // Ensure each row has a unique id
            sNo: index + 1,
            accOpeningMonth: form.accOpeningMonth || 'N/A',
            studentName: form.studentName || 'N/A',
            passportNo: form.studentPassportNo || 'N/A',
            studentPhoneNo: form.studentPhoneNo || 'N/A',
            bankVendor: form.bankVendor || 'N/A',
            accFundingMonth: form.fundingMonth || 'N/A',
            commissionAmt: form.commissionAmt || 0,
            tds: form.tds || '0',
            netPayable: form.netPayable || 0,
            commissionStatus: form.commissionStatus || 'N/A',
          }));
          
          setRows(formattedRows);
        }
      } catch (error) {
        console.error("Error fetching blocked data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadExcel = () => {
    const cleanData = data.map((item) => {
      // Remove _id, __v, id, and agentRef fields from root level
      const { _id, __v, id, agentRef, ...cleanedItem } = item;
  
      // Format date if present
      if (cleanedItem.date) {
        cleanedItem.date = new Date(cleanedItem.date).toLocaleDateString();
      }
  
      // Flatten studentDocuments into a single string
      if (cleanedItem.studentDocuments) {
        cleanedItem.studentDocuments = Object.entries(cleanedItem.studentDocuments)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      }
  
      return cleanedItem;
    });
  
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gic Data');
  
    // Export workbook as Excel file
    XLSX.writeFile(workbook, 'GicData.xlsx');
  };
  
  // Memoize columns and rows to prevent re-renders
  const memoizedColumns = useMemo(() => columns, []);
  const memoizedRows = useMemo(() => rows, [rows]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, maxWidth: '1400px', mx: 'auto' }}>
        <Card elevation={1} sx={{ overflow: 'visible' }}>
          <Box 
            sx={{ 
              p: 3, 
              backgroundImage: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Typography variant="h5" fontWeight="600" color="white">
              Blocked Registrations
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Tooltip title="Download as Excel">
                <Button
                  onClick={handleDownloadExcel}
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { 
                      borderColor: 'white', 
                      backgroundColor: 'rgba(255,255,255,0.1)' 
                    } 
                  }}
                >
                  Export to Excel
                </Button>
              </Tooltip>
              
              <Button
                component={Link}
                to="/agent/gic/form"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.2)'
                  } 
                }}
              >
                Add New
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress />
              </Box>
            ) : memoizedRows.length === 0 ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 10,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No blocked registration records found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Blocked registrations will appear here when they are created
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                height: '100%', 
                width: '100%',
                '& .MuiDataGrid-root': {
                  border: 'none',
                  minHeight: '400px',
                }
              }}>
                <DataTable 
                  columns={memoizedColumns} 
                  rows={memoizedRows} 
                />
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default BlockedPage;