const mongoose = require('mongoose');

const encryptionDataSchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  aesKey: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EncryptionData', encryptionDataSchema);