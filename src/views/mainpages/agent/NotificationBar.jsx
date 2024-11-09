import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Modal } from '@mui/material';
import { IoAlert } from 'react-icons/io5';

const NotificationBar = ({ notifications, handleViewNotification }) => (
  <Box sx={{ p: 2, maxWidth: 300, bgcolor: '#fff', borderRadius: '8px', boxShadow: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Notifications ({notifications.length})
    </Typography>
    {notifications.map((notif) => (
      <Box
        key={notif.id}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          mb: 1,
          bgcolor: notif.viewed ? '#f0f0f0' : '#e8f4ff',
          borderRadius: '4px',
        }}
      >
        <Box display="flex" alignItems="center">
          <IoAlert style={{ color: 'red', marginRight: 8 }} />
          <Typography variant="body2">{notif.description}</Typography>
        </Box>
        <Button size="small" onClick={() => handleViewNotification(notif)}>
          View
        </Button>
      </Box>
    ))}
  </Box>
);

export default NotificationBar;
