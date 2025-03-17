const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { senderEmail, senderPassword, recipient, subject, body } = req.body;

    // Generate encryption keys
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Encrypt the email body
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let encrypted = cipher.update(body, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Store encryption data in MongoDB
    const encryptionData = new EncryptionData({
      senderEmail,
      recipient,
      subject,
      aesKey: aesKey.toString('hex'),
      iv: iv.toString('hex'),
      timestamp: new Date()
    });
    await encryptionData.save();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword
      }
    });

    // Send email with encrypted content
    const mailOptions = {
      from: senderEmail,
      to: recipient,
      subject: subject,
      text: encrypted,
      headers: {
        'X-Encryption-Iv': iv.toString('hex')
      }
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Email decryption endpoint
app.post('/api/receive-email', async (req, res) => {
  try {
    const { receiverEmail, receiverPassword, subject } = req.body;

    // Find the encryption data from MongoDB
    const encryptionData = await EncryptionData.findOne({ recipient: receiverEmail, subject });
    if (!encryptionData) {
      return res.status(404).json({ success: false, message: 'No matching encryption data found' });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: receiverEmail,
        pass: receiverPassword
      }
    });

    // Fetch the encrypted email
    const mailOptions = {
      from: receiverEmail,
      to: receiverEmail,
      subject: subject
    };

    // This is a simplified version - actual implementation would need to fetch the email content
    // In a real application, you would use an IMAP client to fetch the email content

    // Decrypt the email content
    const decipher = crypto.createDecipheriv('aes-256-cbc', 
      Buffer.from(encryptionData.aesKey, 'hex'),
      Buffer.from(encryptionData.iv, 'hex')
    );
    let decrypted = decipher.update(encryptionData.encryptedContent, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    res.status(200).json({ success: true, message: decrypted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});