import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Container } from '@mui/system';
import { Button, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box as Box1 } from '@chakra-ui/react';

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none', // Remove outer border
        },
        columnSeparator: {
          display: 'none', // Remove column separator lines
        },
        row: {
          borderBottom: '1px solid rgba(224, 224, 224, 1)', // Inner row borders
        },
        cell: {
          '&:focus': {
            outline: 'none', // Remove focus border
          },
          cursor: 'pointer',
        },
      },
    },
  },
});

export default function DataTable({ columns, rows, link }) {
  const location = useLocation();
  const navigate = useNavigate();

  const viewHandle = (params) => {
    navigate(`${location.pathname}/${params.id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth>
        <Box1 boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)">
          <Box sx={{  bgcolor: '#FAFCFE' }}>
            <Box
              sx={{
                height: 700,
                width: '100%',
                overflowX: 'auto', // Enable horizontal scrolling
                overflowY: 'auto', // Keep vertical scrolling as well
                '&::-webkit-scrollbar': {
                  height: '8px', // Horizontal scrollbar height
                  width: '8px', // Vertical scrollbar width
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 15]}
                rowHeight={70}
                onRowClick={viewHandle}
              />
            </Box>
            {/* <Box sx={{ padding: 2, textAlign: 'end' }}>
              <Link to={link}>
                <Button variant="contained" color="primary">
                  Add new data
                </Button>
              </Link>
            </Box> */}
          </Box>
        </Box1>
      </Container>
    </ThemeProvider>
  );
}
