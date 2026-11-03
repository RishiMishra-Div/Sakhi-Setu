import { Member } from '../models/Member.js';
import { SavingsTransaction } from '../models/Savings.js';
import { Loan } from '../models/Loan.js';
import { Attendance } from '../models/Attendance.js';
import { Meeting } from '../models/Meeting.js';

export const getMembers = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { memberCode: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const members = await Member.find(query).sort({ memberCode: 1 }).lean();

    // Calculate aggregated savings and loans for each member
    const memberIds = members.map((m) => m._id);

    const savingsAgg = await SavingsTransaction.aggregate([
      { $match: { memberId: { $in: memberIds } } },
      { $group: { _id: '$memberId', totalSavings: { $sum: '$amount' } } }
    ]);
    const savingsMap = {};
    savingsAgg.forEach((s) => {
      savingsMap[s._id.toString()] = s.totalSavings;
    });

    const loansAgg = await Loan.find({ memberId: { $in: memberIds } }).lean();
    const loanMap = {};
    loansAgg.forEach((loan) => {
      const mId = loan.memberId.toString();
      if (!loanMap[mId]) loanMap[mId] = { activeLoansCount: 0, totalOutstanding: 0 };
      if (loan.status === 'active') {
        loanMap[mId].activeLoansCount += 1;
        const paid = (loan.repayments || []).reduce((sum, r) => sum + (r.principalPaid || r.amount || 0), 0);
        loanMap[mId].totalOutstanding += Math.max(0, loan.principalAmount - paid);
      }
    });

    const enriched = members.map((m) => ({
      ...m,
      totalSavings: savingsMap[m._id.toString()] || 0,
      activeLoansCount: loanMap[m._id.toString()]?.activeLoansCount || 0,
      totalOutstandingLoan: loanMap[m._id.toString()]?.totalOutstanding || 0
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members', error: error.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const savings = await SavingsTransaction.find({ memberId: member._id }).sort({ transactionDate: -1 });
    const loans = await Loan.find({ memberId: member._id }).sort({ loanDate: -1 });
    const attendanceRecords = await Attendance.find({ memberId: member._id }).populate('meetingId', 'title meetingDate');

    const totalSavings = savings.reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate attendance percentage
    const totalMeetingsAttended = attendanceRecords.filter((a) => a.status === 'present').length;
    const totalMeetingsRecorded = attendanceRecords.length;
    const attendanceRate = totalMeetingsRecorded > 0 ? Math.round((totalMeetingsAttended / totalMeetingsRecorded) * 100) : 100;

    res.json({
      member,
      totalSavings,
      attendanceRate,
      savings,
      loans,
      attendanceRecords
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch member details', error: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const { name, memberCode, phone, roleInGroup, joinDate, address, bankAccount } = req.body;

    if (!name || !memberCode) {
      return res.status(400).json({ message: 'Member name and Member Code are required' });
    }

    const existing = await Member.findOne({ memberCode: memberCode.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: `Member with code ${memberCode} already exists` });
    }

    const member = new Member({
      name: name.trim(),
      memberCode: memberCode.trim().toUpperCase(),
      phone: phone ? phone.trim() : '',
      roleInGroup: roleInGroup || 'सदस्य (Member)',
      joinDate: joinDate ? new Date(joinDate) : new Date(),
      address,
      bankAccount,
      status: 'active'
    });

    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create member', error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update member', error: error.message });
  }
};

export const toggleMemberStatus = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    member.status = member.status === 'active' ? 'inactive' : 'active';
    await member.save();

    res.json({ message: `Member marked as ${member.status}`, member });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle status', error: error.message });
  }
};
