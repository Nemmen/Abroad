import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  InputAdornment,
  TextField,
  InputBase,
  Paper,
  IconButton,
  Stack
} from '@mui/material';
import { useSelector } from 'react-redux';
import StudentsTable from './StudentsTable';
import SearchIcon from '@mui/icons-material/Search';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';

const StudentPage = () => {
  const { user } = useSelector((state) => state.Auth);
  const [students, setStudents] = useState([]);
  const { colorMode } = useColorMode();

  // Create MUI theme based on Chakra color mode
  const theme = createTheme({
    palette: {
      mode: colorMode,
      primary: {
        main: colorMode === 'light' ? '#3B82F6' : '#90CAF9',
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
  });

  const handleSearch = (e) => {
    const search = e.target.value;
    if (search === '') {
      setStudents(user?.students || []);
    } else {
      const filteredStudents = user?.students?.filter((student) => {
        return student?.name?.toLowerCase().includes(search.toLowerCase());
      });
      setStudents(filteredStudents || []);
    }
  };

  useEffect(() => {
    setStudents(user?.students || []);
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          spacing={2}
          mb={3}
        >
          <Typography variant="h5" fontWeight="600" mb={{ xs: 2, sm: 0 }}>
            Manage Students
          </Typography>

          <Paper
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
              p: '2px 8px',
              borderRadius: '30px',
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)'
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search students..."
              onChange={handleSearch}
              inputProps={{ 'aria-label': 'search students' }}
            />
            <IconButton type="button" sx={{ p: '8px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Stack>

        <Box sx={{ mt: 3 }}>
          <StudentsTable students={students} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default StudentPage;