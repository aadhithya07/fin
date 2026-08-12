const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other'],
    },
    limit: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      required: true,
      enum: ['Monthly', 'Yearly'],
      default: 'Monthly',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);