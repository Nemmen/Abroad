import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const CreateGICModal = ({ isOpen, handleClose, handleCreateGic }) => {
  const [gicName, setGicName] = useState('');
  const [gicOpeningMonth, setGicOpeningMonth] = useState('');
  const [date, setDate] = useState(''); // Date field as a string
  const [agency, setAgency] = useState('');
  const [studentName, setStudentName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [poc, setPoc] = useState('');
  const [payout, setPayout] = useState('');

  const handleSubmit = () => {
    if (gicName && gicOpeningMonth && date && agency && studentName && contact && email && poc && payout) {
      handleCreateGic({ gicName, gicOpeningMonth, date, agency, studentName, contact, email, poc, payout });
    } else {
      alert('Please fill all the required fields');
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create a New GIC
        </Typography>

        {/* GIC Name */}
        <TextField
          label="GIC Name"
          fullWidth
          value={gicName}
          onChange={(e) => setGicName(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        {/* GIC Opening Month */}
        <TextField
          label="GIC Opening Month"
          fullWidth
          value={gicOpeningMonth}
          onChange={(e) => setGicOpeningMonth(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        {/* Date Picker (HTML input type="date") */}
        <TextField
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true, // Ensures the label stays above the input
          }}
          required
        />

        {/* Agency */}
        <TextField
          label="Agency"
          fullWidth
          value={agency}
          onChange={(e) => setAgency(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        {/* Student Name */}
        <TextField
          label="Student Name"
          fullWidth
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        {/* Contact */}
        <TextField
          label="Contact"
          fullWidth
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        {/* Email */}
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        {/* POC */}
        <TextField
          label="POC"
          fullWidth
          value={poc}
          onChange={(e) => setPoc(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        {/* Payout */}
        <TextField
          label="Payout"
          fullWidth
          value={payout}
          onChange={(e) => setPayout(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        {/* Submit Button */}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateGICModal;
