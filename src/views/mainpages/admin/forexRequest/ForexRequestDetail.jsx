import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid2,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Cancel,
  AccessTime,
  Phone,
  AttachMoney,
  Receipt,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

// Status chip color mapping
const statusColors = {
  pending: 'warning',
  contacted: 'info',
  completed: 'success',
  cancelled: 'error',
};

// Status icon mapping
const statusIcons = {
  pending: <AccessTime fontSize="small" />,
  contacted: <Phone fontSize="small" />,
  completed: <CheckCircle fontSize="small" />,
  cancelled: <Cancel fontSize="small" />,
};

const ForexRequestDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { requestId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [request, setRequest] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [notifyAgent, setNotifyAgent] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Fetch request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/api/forex/all-requests?_id=${requestId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.data.requests.length > 0) {
          setRequest(response.data.data.requests[0]);
        } else {
          setError('Request not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  // Update request status
  const handleUpdateStatus = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:4000/api/forex/update-status/${requestId}`,
        { status: newStatus, notes, notifyAgent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRequest(response.data.data);
      setUpdateSuccess(true);
      setStatusDialogOpen(false);
      
      // Show success message briefly
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Open status update dialog
  const openStatusDialog = (status) => {
    setNewStatus(status);
    setNotes('');
    setStatusDialogOpen(true);
  };

  // Format currency with 2 decimal places
  const formatCurrency = (amount, currency = '') => {
    return `${currency} ${parseFloat(amount).toFixed(2)}`;
  };

  // Get human-readable date
  const formatDate = (dateString) => {
    return moment(dateString).format('MMM DD, YYYY [at] h:mm A');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={3}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/admin/forex-requests')}
        >
          Back to Requests
        </Button>
      </Box>
    );
  }

  if (!request) {
    return (
      <Box m={3}>
        <Alert severity="info">Request not found</Alert>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/admin/forex-requests')}
        >
          Back to Requests
        </Button>
      </Box>
    );
  }

  // Destructure request data for easier access
  const {
    _id,
    agent,
    status,
    purpose,
    adminNotes,
    createdAt,
    contactedAt,
    completedAt,
    requestDetails,
  } = request;

  return (
    <Box p={isMobile ? 2 : 3}>
      {/* Success message for status update */}
      {updateSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Status updated successfully
        </Alert>
      )}
      
      {/* Error message for status update */}
      {updateError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {updateError}
        </Alert>
      )}

      {/* Header with actions */}
      <Grid2 container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid2 item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom>
            Forex Request #{_id.substring(_id.length - 6).toUpperCase()}
          </Typography>
          <Chip
            icon={statusIcons[status]}
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            color={statusColors[status]}
            sx={{ mr: 1 }}
          />
          <Chip
            icon={<CalendarToday fontSize="small" />}
            label={`Created: ${formatDate(createdAt)}`}
            variant="outlined"
          />
        </Grid2>
        <Grid2 item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/forex-requests')}
            sx={{ mr: 1, mb: { xs: 1, md: 0 } }}
          >
            Back to List
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => window.print()}
            sx={{ mr: 1, mb: { xs: 1, md: 0 } }}
          >
            Print Details
          </Button>
        </Grid2>
      </Grid2>

      {/* Main content Grid2 */}
      <Grid2 container spacing={3}>
        {/* Left Column */}
        <Grid2 item xs={12} md={8}>
          {/* Request Summary Card */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Request Summary" />
            <Divider />
            <CardContent>
              <Grid2 container spacing={2}>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    From Currency
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {requestDetails.sourceCurrency} {formatCurrency(requestDetails.foreignCurrencyAmount)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    To Currency
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {requestDetails.targetCurrency} {formatCurrency(requestDetails.convertedAmountInINR)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Effective Rate
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatCurrency(requestDetails.effectiveRate)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Grand Total (with charges)
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {requestDetails.targetCurrency} {formatCurrency(requestDetails.grandTotal)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Purpose
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {purpose || 'Not specified'}
                  </Typography>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {/* Rate Breakdown Card */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Rate Breakdown" />
            <Divider />
            <CardContent>
              <Grid2 container spacing={2}>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    IBR Rate
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatCurrency(requestDetails.ibrRate)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    PM Margin
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatCurrency(requestDetails.margins.pm)} 
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    AE Margin
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatCurrency(requestDetails.margins.ae)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Agent Margin
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatCurrency(requestDetails.margins.agent)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    Effective Rate: {formatCurrency(requestDetails.effectiveRate)}
                  </Typography>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {/* Charges Breakdown Card */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Charges Breakdown" />
            <Divider />
            <CardContent>
              <Grid2 container spacing={2}>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Service Charge
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {requestDetails.targetCurrency} {formatCurrency(requestDetails.serviceCharge.amount)}
                    <Typography variant="caption" display="block" color="textSecondary">
                      Base: {formatCurrency(requestDetails.serviceCharge.withoutGST)} + GST
                    </Typography>
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    GST
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {requestDetails.targetCurrency} {formatCurrency(requestDetails.gst.amount)}
                    <Typography variant="caption" display="block" color="textSecondary">
                      {requestDetails.gst.calculationNote}
                    </Typography>
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    TCS
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {requestDetails.targetCurrency} {formatCurrency(requestDetails.tcs.amount)}
                    <Typography variant="caption" display="block" color="textSecondary">
                      {requestDetails.tcs.calculationNote}
                    </Typography>
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Additional Charges
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {requestDetails.targetCurrency} {
                      formatCurrency(
                        Object.values(requestDetails.additionalCharges).reduce((sum, val) => sum + val, 0)
                      )
                    }
                  </Typography>
                </Grid2>
                <Grid2 item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    Grand Total: {requestDetails.targetCurrency} {formatCurrency(requestDetails.grandTotal)}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Net Amount: {requestDetails.targetCurrency} {formatCurrency(requestDetails.netAmount)}
                  </Typography>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {/* Margin Calculations (Collapsible) */}
          <Accordion sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Margin Calculations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid2 container spacing={2}>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Agent Margin Value
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {requestDetails.targetCurrency} {formatCurrency(requestDetails.marginCalculations.agentMarginValue)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    AE Margin Value
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {requestDetails.targetCurrency} {formatCurrency(requestDetails.marginCalculations.aeMarginValue)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    PM Margin Value
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {requestDetails.targetCurrency} {formatCurrency(requestDetails.marginCalculations.pmMarginValue)}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Margin Value
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {requestDetails.targetCurrency} {formatCurrency(requestDetails.marginCalculations.totalMarginValue)}
                  </Typography>
                </Grid2>
              </Grid2>
            </AccordionDetails>
          </Accordion>
        </Grid2>

        {/* Right Column */}
        <Grid2 item xs={12} md={4}>
          {/* Agent Information Card */}
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Agent Information" 
              avatar={<Person color="primary" />} 
            />
            <Divider />
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {agent?.name || 'Not available'}
              </Typography>
              
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {agent?.email || 'Not available'}
              </Typography>
              
              <Typography variant="subtitle2" color="textSecondary">
                Phone
              </Typography>
              <Typography variant="body1" gutterBottom>
                {agent?.phoneNumber || 'Not available'}
              </Typography>
              
              <Typography variant="subtitle2" color="textSecondary">
                Agent Code
              </Typography>
              <Typography variant="body1" gutterBottom>
                {agent?.agentCode || 'Not assigned'}
              </Typography>
              
              {agent?.organization && (
                <>
                  <Typography variant="subtitle2" color="textSecondary">
                    Organization
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {agent.organization}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>

          {/* Status Management Card */}
          <Card sx={{ mb: 3 }}>
            <CardHeader 
              title="Status Management" 
              avatar={statusIcons[status]} 
            />
            <Divider />
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Current Status
              </Typography>
              <Typography variant="body1" gutterBottom>
                <Chip
                  size="small"
                  icon={statusIcons[status]}
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  color={statusColors[status]}
                  sx={{ my: 1 }}
                />
              </Typography>
              
              <Typography variant="subtitle2" color="textSecondary">
                Admin Notes
              </Typography>
              <Typography variant="body2" paragraph sx={{ minHeight: '40px' }}>
                {adminNotes || 'No notes added'}
              </Typography>
              
              <Typography variant="subtitle2" color="textSecondary">
                Timeline
              </Typography>
              <Box sx={{ ml: 1, borderLeft: '1px dashed #ccc', pl: 2, py: 1 }}>
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Created
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(createdAt)}
                  </Typography>
                </Box>
                
                {contactedAt && (
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Contacted
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(contactedAt)}
                    </Typography>
                  </Box>
                )}
                
                {completedAt && (
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {status === 'completed' ? 'Completed' : 'Cancelled'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(completedAt)}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Update Status
              </Typography>
              
              <Grid2 container spacing={1}>
                {status !== 'pending' && (
                  <Grid2 item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="warning"
                      onClick={() => openStatusDialog('pending')}
                      startIcon={<AccessTime />}
                    >
                      Pending
                    </Button>
                  </Grid2>
                )}
                
                {status !== 'contacted' && (
                  <Grid2 item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="info"
                      onClick={() => openStatusDialog('contacted')}
                      startIcon={<Phone />}
                    >
                      Contacted
                    </Button>
                  </Grid2>
                )}
                
                {status !== 'completed' && (
                  <Grid2 item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      onClick={() => openStatusDialog('completed')}
                      startIcon={<CheckCircle />}
                    >
                      Complete
                    </Button>
                  </Grid2>
                )}
                
                {status !== 'cancelled' && (
                  <Grid2 item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => openStatusDialog('cancelled')}
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                  </Grid2>
                )}
              </Grid2>
            </CardContent>
          </Card>

          {/* Margin Card */}
          <Card>
            <CardHeader 
              title="Margin Information" 
              avatar={<AttachMoney color="primary" />} 
            />
            <Divider />
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Margin Points
              </Typography>
              <Grid2 container>
                <Grid2 item xs={8}>
                  <Typography variant="body2" color="textSecondary">PM Margin:</Typography>
                </Grid2>
                <Grid2 item xs={4} textAlign="right">
                  <Typography variant="body2">{requestDetails.margins.pm.toFixed(2)}</Typography>
                </Grid2>
                
                <Grid2 item xs={8}>
                  <Typography variant="body2" color="textSecondary">AE Margin:</Typography>
                </Grid2>
                <Grid2 item xs={4} textAlign="right">
                  <Typography variant="body2">{requestDetails.margins.ae.toFixed(2)}</Typography>
                </Grid2>
                
                <Grid2 item xs={8}>
                  <Typography variant="body2" color="textSecondary">Agent Margin:</Typography>
                </Grid2>
                <Grid2 item xs={4} textAlign="right">
                  <Typography variant="body2">{requestDetails.margins.agent.toFixed(2)}</Typography>
                </Grid2>
                
                <Grid2 item xs={8}>
                  <Typography variant="subtitle2" color="primary">Total Margin:</Typography>
                </Grid2>
                <Grid2 item xs={4} textAlign="right">
                  <Typography variant="subtitle2" color="primary">
                    {(requestDetails.margins.pm + requestDetails.margins.ae + requestDetails.margins.agent).toFixed(2)}
                  </Typography>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Status to {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to change the status of this forex request?
          </DialogContentText>
          
          <TextField
            autoFocus
            label="Admin Notes"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="dense"
            variant="outlined"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="notify-agent-label">Notify Agent</InputLabel>
            <Select
              labelId="notify-agent-label"
              value={notifyAgent}
              label="Notify Agent"
              onChange={(e) => setNotifyAgent(e.target.value)}
            >
              <MenuItem value={true}>Yes, send email notification</MenuItem>
              <MenuItem value={false}>No, don't notify</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            color="primary"
            variant="contained"
            disabled={updateLoading}
          >
            {updateLoading ? <CircularProgress size={24} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ForexRequestDetail;