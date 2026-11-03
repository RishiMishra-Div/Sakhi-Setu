import mongoose from 'mongoose';

const repaymentSchema = new mongoose.Schema(
  {
    paymentDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Repayment amount must be positive']
    },
    principalPaid: {
      type: Number,
      default: 0
    },
    interestPaid: {
      type: Number,
      default: 0
    },
    paymentMode: {
      type: String,
      default: 'Cash / रोख'
    },
    note: {
      type: String
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

const loanSchema = new mongoose.Schema(
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
    loanNumber: {
      type: String,
      required: true,
      unique: true
    },
    principalAmount: {
      type: Number,
      required: true,
      min: [100, 'Principal amount must be at least ₹100']
    },
    monthlyInterestRate: {
      type: Number,
      default: 1.0 // 1% per month
    },
    agreedTerms: {
      type: String,
      default: '1% दरमहा व्याज (1% per month), 6 मासिक हप्ते'
    },
    purpose: {
      type: String,
      required: true,
      default: 'लहान व्यवसाय / शेती / कौटुंबिक गरज'
    },
    loanDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'repaid', 'overdue'],
      default: 'active'
    },
    repayments: [repaymentSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

// Virtual for calculating outstanding principal balance
loanSchema.virtual('totalPrincipalPaid').get(function () {
  return (this.repayments || []).reduce((acc, curr) => acc + (curr.principalPaid || curr.amount || 0), 0);
});

loanSchema.virtual('outstandingBalance').get(function () {
  const paid = (this.repayments || []).reduce((acc, curr) => acc + (curr.principalPaid || curr.amount || 0), 0);
  return Math.max(0, this.principalAmount - paid);
});

loanSchema.set('toJSON', { virtuals: true });
loanSchema.set('toObject', { virtuals: true });

export const Loan = mongoose.model('Loan', loanSchema);
