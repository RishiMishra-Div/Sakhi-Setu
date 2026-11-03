import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meeting',
      required: true
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'excused'],
      default: 'present',
      required: true
    },
    note: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate attendance for the same member & meeting
attendanceSchema.index({ meetingId: 1, memberId: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
