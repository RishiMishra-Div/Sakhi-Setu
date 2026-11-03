import { SavingsTransaction } from '../models/Savings.js';
import { Member } from '../models/Member.js';

export const getSavings = async (req, res) => {
  try {
    const { memberId, monthYear, limit = 100 } = req.query;
    let query = {};

    if (memberId) query.memberId = memberId;
    if (monthYear) query.monthYear = monthYear;

    const transactions = await SavingsTransaction.find(query)
      .populate('memberId', 'name memberCode phone')
      .populate('createdBy', 'name')
      .sort({ transactionDate: -1 })
      .limit(Number(limit));

    const totalGroupSavingsResult = await SavingsTransaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const totalSavings = totalGroupSavingsResult[0]?.total || 0;
    const totalTransactions = totalGroupSavingsResult[0]?.count || 0;

    res.json({
      totalSavings,
      totalTransactions,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch savings records', error: error.message });
  }
};

export const createSavings = async (req, res) => {
  try {
    const { memberId, amount, transactionDate, paymentMode, monthYear, note } = req.body;

    if (!memberId || !amount) {
      return res.status(400).json({ message: 'Member and amount are required' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const date = transactionDate ? new Date(transactionDate) : new Date();
    const derivedMonthYear = monthYear || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const transaction = new SavingsTransaction({
      memberId,
      amount: numAmount,
      transactionDate: date,
      paymentMode: paymentMode || 'Cash / रोख',
      monthYear: derivedMonthYear,
      note: note || '',
      createdBy: req.user._id
    });

    await transaction.save();
    await transaction.populate('memberId', 'name memberCode');

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to record savings', error: error.message });
  }
};

export const getSavingsSummary = async (req, res) => {
  try {
    // Total group savings
    const groupTotal = await SavingsTransaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Member totals
    const memberTotals = await SavingsTransaction.aggregate([
      {
        $group: {
          _id: '$memberId',
          totalSaved: { $sum: '$amount' },
          lastTransaction: { $max: '$transactionDate' }
        }
      },
      {
        $lookup: {
          from: 'members',
          localField: '_id',
          foreignField: '_id',
          as: 'member'
        }
      },
      { $unwind: '$member' },
      { $sort: { 'member.memberCode': 1 } }
    ]);

    // Month totals for chart / trend
    const monthlyTrend = await SavingsTransaction.aggregate([
      {
        $group: {
          _id: '$monthYear',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      groupTotal: groupTotal[0]?.total || 0,
      memberTotals,
      monthlyTrend
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch savings summary', error: error.message });
  }
};
