import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    },
    title: {
      type: String,
      required: true,
      default: 'मासिक बैठक (Monthly Bachat Meeting)'
    },
    meetingDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      default: '04:00 PM'
    },
    location: {
      type: String,
      required: true,
      default: 'Community Hall / समाज मंदिर, शिवाजी नगर'
    },
    agenda: {
      type: [String],
      default: [
        'मासिक बचत गोळा करणे (Monthly savings collection)',
        'कर्ज वाटप व परतफेड आढावा (Loan disbursal & repayment review)',
        'नवीन उद्योग / उत्पादने चर्चा (New business/products discussion)'
      ]
    },
    notes: {
      type: String
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

export const Meeting = mongoose.model('Meeting', meetingSchema);
