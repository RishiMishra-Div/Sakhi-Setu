import mongoose from 'mongoose';

const savingsTransactionSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    transactionDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Savings amount must be positive']
    },
    paymentMode: {
      type: String,
      enum: ['Cash / रोख', 'UPI / फोनपे/गुगलपे', 'Bank Transfer / बँक ट्रान्सफर'],
      default: 'Cash / रोख'
    },
    monthYear: {
      type: String, // e.g. "2026-10" or "October 2026"
      required: true
    },
    note: {
      type: String,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

export const SavingsTransaction = mongoose.model('SavingsTransaction', savingsTransactionSchema);
