import { Meeting } from '../models/Meeting.js';
import { Attendance } from '../models/Attendance.js';
import { Member } from '../models/Member.js';

export const getMeetings = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const meetings = await Meeting.find(query).sort({ meetingDate: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch meetings', error: error.message });
  }
};

export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Fetch existing attendance records
    const attendanceRecords = await Attendance.find({ meetingId: meeting._id }).populate('memberId', 'name memberCode phone status');

    // Fetch all active members to ensure every member has a row
    const allMembers = await Member.find({ status: 'active' }).sort({ memberCode: 1 });

    const attendanceMap = {};
    attendanceRecords.forEach((a) => {
      if (a.memberId) {
        attendanceMap[a.memberId._id.toString()] = {
          _id: a._id,
          status: a.status,
          note: a.note || ''
        };
      }
    });

    const fullAttendanceList = allMembers.map((member) => ({
      memberId: member._id,
      name: member.name,
      memberCode: member.memberCode,
      phone: member.phone,
      attendanceId: attendanceMap[member._id.toString()]?._id || null,
      status: attendanceMap[member._id.toString()]?.status || 'present',
      note: attendanceMap[member._id.toString()]?.note || ''
    }));

    res.json({
      meeting,
      attendance: fullAttendanceList
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch meeting details', error: error.message });
  }
};

export const createMeeting = async (req, res) => {
  try {
    const { title, meetingDate, startTime, location, agenda, notes } = req.body;

    if (!title || !meetingDate || !location) {
      return res.status(400).json({ message: 'Title, date, and location are required' });
    }

    const meeting = new Meeting({
      title,
      meetingDate: new Date(meetingDate),
      startTime: startTime || '04:00 PM',
      location,
      agenda: agenda ? (Array.isArray(agenda) ? agenda : agenda.split('\n').filter(Boolean)) : [],
      notes,
      createdBy: req.user._id,
      status: new Date(meetingDate) >= new Date() ? 'upcoming' : 'completed'
    });

    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create meeting', error: error.message });
  }
};

export const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update meeting', error: error.message });
  }
};

export const saveMeetingAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { records } = req.body; // array of { memberId, status, note }

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Attendance records must be an array' });
    }

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Upsert attendance for each member to prevent duplicate entries
    const bulkOps = records.map((rec) => ({
      updateOne: {
        filter: { meetingId: id, memberId: rec.memberId },
        update: {
          $set: {
            status: rec.status,
            note: rec.note || ''
          }
        },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await Attendance.bulkWrite(bulkOps);
    }

    // If meeting was upcoming, mark it as completed now that attendance is recorded
    if (meeting.status === 'upcoming') {
      meeting.status = 'completed';
      await meeting.save();
    }

    res.json({ message: 'Attendance saved successfully', totalSaved: records.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save attendance', error: error.message });
  }
};
