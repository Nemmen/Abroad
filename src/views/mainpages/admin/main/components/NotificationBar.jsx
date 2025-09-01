import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  CardHeader,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  useMediaQuery
} from '@mui/material';
import { IoSettingsOutline, IoCloseCircleOutline, IoAlertCircle } from 'react-icons/io5';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@chakra-ui/react';

const NotificationBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
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
      error: {
        main: '#EF4444',
      }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
          },
        },
      },
      // Remove default padding from CardHeader
      MuiCardHeader: {
        styleOverrides: {
          root: {
            padding: '16px 16px 16px',
          }
        }
      }
    },
  });

  // Use direct media query for responsiveness
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const usersResponse = await axios.get(
          'https://abroad-backend-gray.vercel.app/admin/getuser',
          { withCredentials: true },
        );
        const filteredNotifications = usersResponse.data.users
          .filter((user) => user.userStatus === 'pending')
          .sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
        setNotifications(filteredNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
  }, []);

  const handleView = (notification, event) => {
    event.preventDefault(); // Prevent Link navigation
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        elevation={1}
        sx={{
          height: '100%', 
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // Prevents any unexpected spacing
        }}
      >
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={600}>
              Notifications ({notifications.length})
            </Typography>
          }
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}>
                <IoSettingsOutline />
              </IconButton>
              <IconButton size="small" sx={{ 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}>
                <IoCloseCircleOutline />
              </IconButton>
            </Box>
          }
          sx={{
            backgroundImage: 'linear-gradient(135deg, #11047A 0%, #4D1DB3 100%)',
            color: 'white',
            borderRadius: 0, // Remove any border radius from header
            mb: 0, // Remove bottom margin
            pb: 2, // Add padding at bottom for spacing
          }}
        />
        
        <CardContent 
          sx={{ 
            flexGrow: 1,
            // p: 2,
            // pt: 2, // Consistent padding at top
            overflowY: 'auto',
            maxHeight: '300px',
            minHeight: '200px',
            mt: 0, // Remove top margin
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: colorMode === 'light' ? '#f1f1f1' : '#333',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#3B82F6',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#2563EB',
            },
            // Firefox scrollbar styling
            scrollbarWidth: 'thin',
            scrollbarColor: '#3B82F6 transparent',
          }}
        >
          <List sx={{ p: 0 }}>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <Link 
                  to={`/admin/agent/userdetail/${notif._id}`} 
                  key={notif._id}
                  style={{ textDecoration: 'none' }}
                >
                  <ListItem 
                    sx={{
                      mb: 1,
                      bgcolor: colorMode === 'light' ? 'rgba(243, 244, 246, 0.8)' : 'rgba(38, 39, 48, 0.8)',
                      borderRadius: 1,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: colorMode === 'light' ? 'rgba(243, 244, 246, 1)' : 'rgba(48, 49, 58, 1)',
                      },
                    }}
                    secondaryAction={
                      <Button 
                        size="small" 
                        color="primary" 
                        onClick={(e) => handleView(notif, e)}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        View
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'error.main' }}>
                        <IoAlertCircle color="white" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{notif.name}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">{notif.email}</Typography>
                          <Typography variant="body2" color="text.secondary">Organization: {notif.organization}</Typography>
                          <Typography variant="body2" color="text.secondary">Role: {notif.role}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Link>
              ))
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '200px'
              }}>
                <Typography color="text.secondary">No new notifications</Typography>
              </Box>
            )}
          </List>
        </CardContent>
      </Card>

      <Dialog 
        open={!!selectedNotification} 
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xs"
      >
        {selectedNotification && (
          <>
            <DialogTitle>{selectedNotification.name}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                Email: {selectedNotification.email}
              </Typography>
              <Typography variant="body1" paragraph>
                Organization: {selectedNotification.organization}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Role: {selectedNotification.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {selectedNotification.userStatus}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created At: {new Date(selectedNotification.createdAt).toLocaleString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </ThemeProvider>
  );
};

export default NotificationBar;