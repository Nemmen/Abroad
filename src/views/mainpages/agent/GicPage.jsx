import React, { useState } from 'react';
import { Box, Button, IconButton, ThemeProvider, createTheme, Typography, Modal } from '@mui/material';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useColorMode } from '@chakra-ui/react';
import Banner from './Banner';
import CreateGICModal from './CreateGICModal';
import NotificationBar from './NotificationBar';
import { DataGrid } from '@mui/x-data-grid';

const GicPage = () => {
  const { colorMode } = useColorMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // State to hold rows (data for the table)
  const [rows, setRows] = useState([
    { id: 1, sNo: 1, vendor: 'Vendor 1', gicOpeningMonth: 'January', date: '2024-01-15', agency: 'Agency 1', studentName: 'John Doe', contact: '1234567890', email: 'john@example.com', poc: 'Point of Contact 1', payout: '$1000' },
    { id: 2, sNo: 2, vendor: 'Vendor 2', gicOpeningMonth: 'February', date: '2024-02-10', agency: 'Agency 2', studentName: 'Jane Smith', contact: '9876543210', email: 'jane@example.com', poc: 'Point of Contact 2', payout: '$1500' },
    { id: 3, sNo: 3, vendor: 'Vendor 3', gicOpeningMonth: 'March', date: '2024-03-05', agency: 'Agency 3', studentName: 'Sam Brown', contact: '1231231234', email: 'sam@example.com', poc: 'Point of Contact 3', payout: '$1200' },
    { id: 4, sNo: 4, vendor: 'Vendor 4', gicOpeningMonth: 'April', date: '2024-04-20', agency: 'Agency 4', studentName: 'Emily Green', contact: '5555555555', email: 'emily@example.com', poc: 'Point of Contact 4', payout: '$1100' },
    { id: 5, sNo: 5, vendor: 'Vendor 5', gicOpeningMonth: 'May', date: '2024-05-25', agency: 'Agency 5', studentName: 'Michael White', contact: '4444444444', email: 'michael@example.com', poc: 'Point of Contact 5', payout: '$1300' },
  ]);

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
          background: {
            default: colorMode === 'light' ? '#ffffff' : '#121212',
          },
          text: {
            primary: colorMode === 'light' ? '#000000' : '#ffffff',
          },
        },
      }),
    [colorMode]
  );

  // Handle opening and closing the modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Handle creating a new GIC
  const handleCreateGic = (newGic) => {
    const newRow = {
      id: rows.length + 1, // Unique ID for each new row
      sNo: rows.length + 1,
      vendor: newGic.name, // Assuming the GIC name is treated as the vendor
      gicOpeningMonth: newGic.gicOpeningMonth, // Add more fields as needed
      date: newGic.date, // You can generate a date or pass it from the form
      agency: newGic.agency, // Add corresponding form fields
      studentName: newGic.studentName, // Add corresponding form fields
      contact: newGic.contact, // Add corresponding form fields
      email: newGic.email, // Add corresponding form fields
      poc: newGic.poc, // Add corresponding form fields
      payout: newGic.payout, // Add corresponding form fields
    };
    setRows((prevRows) => [...prevRows, newRow]);
    handleCloseModal(); // Close modal after submission
  };

  // Pagination settings for the table
  const paginationModel = { page: 0, pageSize: 5 };

  // Column definitions for the table
  const columns = [
    { field: 'sNo', headerName: 'S.No.', width: 100 },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
    { field: 'gicOpeningMonth', headerName: 'GIC OPENING MONTH', width: 180 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'agency', headerName: 'Agency', width: 150 },
    { field: 'studentName', headerName: 'Student Name', width: 180 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'poc', headerName: 'POC', width: 150 },
    { field: 'payout', headerName: 'Payout', width: 120 },
  ];

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ mt: 10, width: '100%' }}>
        {/* Banner */}
        <Banner />

        {/* Create GIC Button */}
        <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ mb: 2 }}>
          Create a New GIC
        </Button>

        {/* Notification Icon */}
        <IconButton color="inherit" onClick={() => setIsNotificationOpen(!isNotificationOpen)} sx={{ ml: 'auto', mb: 2 }}>
          <IoNotificationsOutline />
        </IconButton>

        {/* Notifications */}
        {isNotificationOpen && (
          <NotificationBar
            notifications={[{ id: 1, description: 'New applicant for Software Engineer', viewed: false }, { id: 2, description: 'New applicant for Data Analyst', viewed: false }]}
            handleViewNotification={(notification) => setSelectedNotification(notification)}
          />
        )}

        {/* Modals */}
        <CreateGICModal isOpen={isModalOpen} handleClose={handleCloseModal} handleCreateGic={handleCreateGic} />

        {/* DataGrid Table */}
        <Box sx={{ height: 400, width: '100%', mt: 3 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default GicPage;
