const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // Dynamic schema to store all Excel columns
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  // Metadata
  emailSubject: String,
  emailDate: Date,
  fileName: String,
  fetchedAt: {
    type: Date,
    default: Date.now
  },
  // Simple date field for daily filtering (YYYY-MM-DD format)
  date: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true,
  strict: false // Allow dynamic fields
});

// Indexes for faster queries
leadSchema.index({ date: 1, fetchedAt: -1 });

// Export model with specific collection name 'mailing'
module.exports = mongoose.model('Lead', leadSchema, 'mailing');
