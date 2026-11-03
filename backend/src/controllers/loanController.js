import { Loan } from '../models/Loan.js';
import { Member } from '../models/Member.js';

export const getLoans = async (req, res) => {
  try {
    const { status, memberId } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (memberId) {
      query.memberId = memberId;
    }

    const loans = await Loan.find(query)
      .populate('memberId', 'name memberCode phone')
      .populate('createdBy', 'name')
      .sort({ loanDate: -1 });

    const totalPrincipalResult = await Loan.aggregate([
      { $group: { _id: null, total: { $sum: '$principalAmount' } } }
    ]);

    // Calculate total outstanding balance across all active loans
    let totalOutstanding = 0;
    let activeLoansCount = 0;
    loans.forEach((loan) => {
      if (loan.status === 'active') {
        totalOutstanding += loan.outstandingBalance;
        activeLoansCount += 1;
      }
    });

    res.json({
      loans,
      totalPrincipal: totalPrincipalResult[0]?.total || 0,
      totalOutstanding,
      activeLoansCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch loans', error: error.message });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('memberId', 'name memberCode phone address')
      .populate('repayments.recordedBy', 'name');

    if (!loan) {
      return res.status(404).json({ message: 'Loan record not found' });
    }

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch loan details', error: error.message });
  }
};

export const createLoan = async (req, res) => {
  try {
    const { memberId, principalAmount, monthlyInterestRate, agreedTerms, purpose, loanDate, dueDate } = req.body;

    if (!memberId || !principalAmount || !purpose) {
      return res.status(400).json({ message: 'Member, principal amount, and purpose are required' });
    }

    const amount = Number(principalAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Principal amount must be a positive number' });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const year = new Date().getFullYear();
    const count = await Loan.countDocuments();
    const loanNumber = `LN-${year}-${String(count + 1).padStart(3, '0')}`;

    const loan = new Loan({
      memberId,
      loanNumber,
      principalAmount: amount,
      monthlyInterestRate: monthlyInterestRate !== undefined ? Number(monthlyInterestRate) : 1.0,
      agreedTerms: agreedTerms || `${monthlyInterestRate || 1}% दरमहा व्याज (1% per month), 6 मासिक हप्ते`,
      purpose,
      loanDate: loanDate ? new Date(loanDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      status: 'active',
      repayments: [],
      createdBy: req.user._id
    });

    await loan.save();
    await loan.populate('memberId', 'name memberCode phone');

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create loan', error: error.message });
  }
};

export const recordRepayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, principalPaid, interestPaid, paymentDate, paymentMode, note } = req.body;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Repayment amount must be positive' });
    }

    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const repaymentEntry = {
      amount: numAmount,
      principalPaid: principalPaid !== undefined ? Number(principalPaid) : numAmount,
      interestPaid: interestPaid !== undefined ? Number(interestPaid) : 0,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      paymentMode: paymentMode || 'Cash / रोख',
      note: note || '',
      recordedBy: req.user._id
    };

    loan.repayments.push(repaymentEntry);

    // Calculate new total principal paid
    const totalPrincipalPaid = loan.repayments.reduce((acc, curr) => acc + (curr.principalPaid || curr.amount || 0), 0);

    if (totalPrincipalPaid >= loan.principalAmount) {
      loan.status = 'repaid';
    }

    await loan.save();
    await loan.populate('memberId', 'name memberCode');

    res.json({
      message: 'Repayment recorded successfully',
      loan
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record repayment', error: error.message });
  }
};
