import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';

const ReceiveEmail = () => {
  const [loading, setLoading] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDecryptedMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post('/api/receive-email', {
        receiverEmail: e.target.receiverEmail.value,
        receiverPassword: e.target.receiverPassword.value,
        subject: e.target.subject.value
      });

      if (response.data.success) {
        setDecryptedMessage(response.data.message);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Receive and Decrypt Email
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box component="div" mb={2}>
          <TextField
            fullWidth
            label="Your Email"
            name="receiverEmail"
            required
            variant="outlined"
          />
        </Box>
        <Box component="div" mb={2}>
          <TextField
            fullWidth
            label="App Password"
            name="receiverPassword"
            type="password"
            required
            variant="outlined"
          />
        </Box>
        <Box component="div" mb={2}>
          <TextField
            fullWidth
            label="Email Subject"
            name="subject"
            required
            variant="outlined"
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Retrieve and Decrypt'}
        </Button>
      </form>

      {errorMessage && <Alert severity="error" mt={2}>{errorMessage}</Alert>}
      {decryptedMessage && (
        <Box mt={2}>
          <Typography variant="h6">Decrypted Message:</Typography>
          <pre>{decryptedMessage}</pre>
        </Box>
      )}
    </Container>
  );
};

export default ReceiveEmail;