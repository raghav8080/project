import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';

const SendEmail = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/send-email', {
        senderEmail: e.target.senderEmail.value,
        senderPassword: e.target.senderPassword.value,
        recipient: e.target.recipient.value,
        subject: e.target.subject.value,
        body: e.target.body.value
      });

      if (response.data.success) {
        alert('Email sent successfully!');
      } else {
        alert('Error sending email: ' + response.data.message);
      }
    } catch (error) {
      alert('Error: ' + error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Send Encrypted Email
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box component="div" mb={2}>
          <TextField
            fullWidth
            label="Your Email"
            name="senderEmail"
            required
            variant="outlined"
          />
        </Box>
        <Box component="div" mb={2}>
          <TextField
            fullWidth
            label="App Password"
            name="senderPassword"
            type="password"
            required
            variant="outlined"
            helperText="Generate from Google Account > Security > App Passwords"
          />
        </Box>
        <Box component="div" mb={2}>
          <TextField
            fullWidth
            label="Recipient Email"
            name="recipient"
            required
            variant="outlined"
          />
        </Box>
        <Box component="div" mb={2}>
          <TextField
            fullWidth
            label="Subject"
            name="subject"
            required
            variant="outlined"
          />
        </Box>
        <Box component="div" mb={2}>
          <TextField
            fullWidth
            label="Email Body"
            name="body"
            multiline
            rows={6}
            required
            variant="outlined"
          />
        </Box>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: '16px' }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Send Email'}
        </Button>
      </form>
    </Container>
  );
};

export default SendEmail;