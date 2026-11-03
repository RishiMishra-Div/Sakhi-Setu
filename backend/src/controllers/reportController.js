import { Member } from '../models/Member.js';
import { Meeting } from '../models/Meeting.js';
import { Attendance } from '../models/Attendance.js';
import { SavingsTransaction } from '../models/Savings.js';
import { Loan } from '../models/Loan.js';
import { Announcement } from '../models/Announcement.js';
import { Group } from '../models/Group.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'active' });

    // Savings sum
    const savingsAgg = await SavingsTransaction.aggregate([
      { $group: { _id: null, totalSavings: { $sum: '$amount' } } }
    ]);
    const totalSavings = savingsAgg[0]?.totalSavings || 0;

    // Loans and outstanding balance
    const loans = await Loan.find().lean();
    let totalLoanPrincipal = 0;
    let totalOutstandingLoans = 0;
    let activeLoansCount = 0;

    loans.forEach((loan) => {
      totalLoanPrincipal += loan.principalAmount;
      if (loan.status === 'active') {
        activeLoansCount += 1;
        const paid = (loan.repayments || []).reduce((acc, r) => acc + (r.principalPaid || r.amount || 0), 0);
        totalOutstandingLoans += Math.max(0, loan.principalAmount - paid);
      }
    });

    // Next upcoming meeting
    const nextMeeting = await Meeting.findOne({
      meetingDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      status: { $ne: 'cancelled' }
    }).sort({ meetingDate: 1 });

    // Recent announcements
    const recentAnnouncements = await Announcement.find({ status: 'active' })
      .sort({ postedDate: -1 })
      .limit(3);

    // Recent savings transactions
    const recentTransactions = await SavingsTransaction.find()
      .populate('memberId', 'name memberCode')
      .sort({ transactionDate: -1 })
      .limit(5);

    // Group info
    const group = await Group.findOne() || {
      name: 'Sakhi Mahila Bachat Gat',
      registrationNumber: 'MH/PUN/SHG/2023/0489',
      village: 'Shivaji Nagar',
      district: 'Pune, Maharashtra'
    };

    res.json({
      group,
      totalMembers,
      activeMembers,
      totalSavings,
      totalLoanPrincipal,
      totalOutstandingLoans,
      activeLoansCount,
      nextMeeting,
      recentAnnouncements,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

export const getMonthlyReport = async (req, res) => {
  try {
    const { month = '2026-10', type = 'all' } = req.query;

    // Parse month (YYYY-MM)
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    let reportData = {
      month,
      period: { startDate, endDate },
      savings: {},
      loans: {},
      attendance: {},
      consolidated: {}
    };

    // 1. Savings data
    const savingsTransactions = await SavingsTransaction.find({
      transactionDate: { $gte: startDate, $lte: endDate }
    }).populate('memberId', 'name memberCode');

    const totalSavingsPeriod = savingsTransactions.reduce((acc, t) => acc + t.amount, 0);

    reportData.savings = {
      totalAmount: totalSavingsPeriod,
      count: savingsTransactions.length,
      transactions: savingsTransactions
    };

    // 2. Loans data
    const loansInPeriod = await Loan.find({
      loanDate: { $gte: startDate, $lte: endDate }
    }).populate('memberId', 'name memberCode');

    const newLoansDisbursed = loansInPeriod.reduce((acc, l) => acc + l.principalAmount, 0);

    // Repayments received during this month across all loans
    const allLoans = await Loan.find().populate('memberId', 'name memberCode').lean();
    let repaymentsInPeriod = [];
    let totalRepaymentsAmount = 0;

    allLoans.forEach((loan) => {
      (loan.repayments || []).forEach((rep) => {
        const rDate = new Date(rep.paymentDate);
        if (rDate >= startDate && rDate <= endDate) {
          repaymentsInPeriod.push({
            loanNumber: loan.loanNumber,
            member: loan.memberId,
            ...rep
          });
          totalRepaymentsAmount += rep.amount;
        }
      });
    });

    reportData.loans = {
      newLoansDisbursed,
      newLoansCount: loansInPeriod.length,
      newLoans: loansInPeriod,
      repaymentsReceived: totalRepaymentsAmount,
      repaymentsCount: repaymentsInPeriod.length,
      repayments: repaymentsInPeriod
    };

    // 3. Attendance data for meetings in month
    const meetings = await Meeting.find({
      meetingDate: { $gte: startDate, $lte: endDate }
    }).sort({ meetingDate: 1 });

    const meetingIds = meetings.map((m) => m._id);
    const attendanceRecords = await Attendance.find({
      meetingId: { $in: meetingIds }
    }).populate('memberId', 'name memberCode');

    const totalMembers = await Member.countDocuments({ status: 'active' });
    const presentCount = attendanceRecords.filter((a) => a.status === 'present').length;
    const totalPossibleAttendances = meetings.length * totalMembers;
    const attendanceRate = totalPossibleAttendances > 0 ? Math.round((presentCount / totalPossibleAttendances) * 100) : 0;

    reportData.attendance = {
      meetingsHeld: meetings.length,
      meetings,
      totalPossibleAttendances,
      presentCount,
      attendanceRate,
      records: attendanceRecords
    };

    // 4. Consolidated Summary
    reportData.consolidated = {
      totalSavingsCollected: totalSavingsPeriod,
      loansDisbursed: newLoansDisbursed,
      loanRepaymentsReceived: totalRepaymentsAmount,
      netCashFlow: totalSavingsPeriod + totalRepaymentsAmount - newLoansDisbursed
    };

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};
