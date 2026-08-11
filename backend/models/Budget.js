import mongoose from 'mongoose';

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

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;