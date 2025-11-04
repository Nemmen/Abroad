import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useTheme,
  Chip,
  Tooltip
} from '@mui/material';

const StudentsTable = ({ students, showForexDetails = false }) => {
  const theme = useTheme();
  // Safe access to theme mode with fallback
  const isLightMode = theme?.palette?.mode !== 'dark';
  
  // Format amount with commas
  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    
    // If amount is a string with commas already, return it
    if (typeof amount === 'string' && amount.includes(',')) return amount;
    
    // Try to convert to number and format
    try {
      const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : parseFloat(amount);
      return numAmount.toLocaleString('en-IN');
    } catch (e) {
      return amount.toString();
    }
  };

  // Get country flag emoji
  const getCountryFlag = (countryCode) => {
    if (!countryCode) return '';
    
    // Map country codes to emoji flags (limited selection)
    const countryMap = {
      'USD': '🇺🇸',
      'GBP': '🇬🇧',
      'EUR': '🇪🇺',
      'CAD': '🇨🇦',
      'AUD': '🇦🇺',
      'NZD': '🇳🇿',
      'SGD': '🇸🇬'
    };
    
    return countryMap[countryCode] || '';
  };
  
  return (
    <TableContainer 
      component={Paper} 
      elevation={1}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)'
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="students table">
        <TableHead>
          <TableRow sx={{ 
            backgroundColor: isLightMode ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)' 
          }}>
            <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
              Student Code
            </TableCell>
            <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
              Name
            </TableCell>
            {showForexDetails ? (
              <>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
                  Country
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
                  Currency
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
                  Amount Paid
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
                  <TableCell>
                  Latest Transaction
                </TableCell>
                <TableCell>
                  Transactions
                </TableCell>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
                  Created At
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {students?.map((student) => (
            <TableRow 
              key={student._id} 
              sx={{ 
                '&:hover': { 
                  backgroundColor: isLightMode ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)' 
                },
                borderBottom: `1px solid ${theme?.palette?.divider || '#e0e0e0'}`
              }}
            >
              <TableCell>{student.studentCode}</TableCell>
              <TableCell>{student.name}</TableCell>
              
              {showForexDetails ? (
                <>
                  <TableCell>
                    <Tooltip title={student.country || 'Unknown'}>
                      <span>{getCountryFlag(student.country)} {student.country || 'N/A'}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {student.currencyBooked ? (
                      <Chip 
                        label={student.currencyBooked}
                        size="small"
                        sx={{ 
                          bgcolor: isLightMode ? '#e3f2fd' : '#0d47a1',
                          color: isLightMode ? '#0d47a1' : 'white',
                          fontWeight: 500
                        }}
                      />
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>₹ {formatAmount(student.amount)}</TableCell>
                  <TableCell>
                    {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {student.transactionCount || 1}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {student.createdAt ? new Date(student.createdAt).toLocaleString() : 'N/A'}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
          {(!students || students.length === 0) && (
            <TableRow>
              <TableCell colSpan={showForexDetails ? 7 : 4} align="center" sx={{ py: 3 }}>
                No students found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentsTable;