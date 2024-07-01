
const mongoose = require('mongoose');

const InvalidatedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  ceratedAt: {
    type: Date,
    default: Date.now,
    expires: "3600",
  },
});

const InvalidToken = mongoose.model('InvalidToken',InvalidatedTokenSchema);

module.exports = InvalidToken;