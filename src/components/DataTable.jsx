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
          '& .row-non-claimable': {
            backgroundColor: '#ffebee !important',
            '&:hover': {
              backgroundColor: '#ffcdd2 !important',
            },
          },
          '& .row-under-processing': {
            backgroundColor: '#fff8e1 !important',
            '&:hover': {
              backgroundColor: '#ffecb3 !important',
            },
          },
          '& .row-paid': {
            backgroundColor: '#e8f5e8 !important',
            '&:hover': {
              backgroundColor: '#c8e6c9 !important',
            },
          },
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

export default function DataTable({ 
  columns, 
  rows = [], 
  link, 
  sx, 
  onSelectionChange, 
  checkboxSelection = false, 
  getRowClassName,
  loading = false,
  pagination,
  getRowId,
  onRowClick
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const viewHandle = (params) => {
    // If custom onRowClick is provided, use it
    if (onRowClick) {
      onRowClick(params);
    } else {
      // Default behavior
      navigate(`${location.pathname}/${params.id}`);
    }
  };

  const handleSelectionChange = (newSelection) => {
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
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
                ...sx
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                getRowId={getRowId}
                pageSizeOptions={[10, 15, 25]}
                paginationMode={pagination ? 'server' : 'client'}
                rowCount={pagination?.total || rows.length}
                paginationModel={{
                  pageSize: pagination?.pageSize || 10,
                  page: (pagination?.page || 1) - 1, // DataGrid uses 0-based indexing
                }}
                onPaginationModelChange={(model) => {
                  if (pagination?.onPageChange) {
                    pagination.onPageChange(model.page + 1); // Convert back to 1-based
                  }
                  if (pagination?.onPageSizeChange && model.pageSize !== pagination.pageSize) {
                    pagination.onPageSizeChange(model.pageSize);
                  }
                }}
                rowHeight={70}
                onRowClick={viewHandle}
                checkboxSelection={checkboxSelection}
                onRowSelectionModelChange={handleSelectionChange}
                disableRowSelectionOnClick={checkboxSelection}
                getRowClassName={getRowClassName}
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
