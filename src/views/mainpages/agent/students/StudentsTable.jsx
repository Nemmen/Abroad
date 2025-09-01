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
  useTheme
} from '@mui/material';

const StudentsTable = ({ students, agen }) => {
  const theme = useTheme();
  // Safe access to theme mode with fallback
  const isLightMode = theme?.palette?.mode !== 'dark';
  
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
            <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
              Email
            </TableCell>
            <TableCell sx={{ fontWeight: 600, py: 1.5 }}>
              Created At
            </TableCell>
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
              <TableCell>{student.email}</TableCell>
              <TableCell>
                {student.createdAt ? new Date(student.createdAt).toLocaleString() : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
          {(!students || students.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
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