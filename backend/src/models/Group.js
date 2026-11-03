import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Sakhi Mahila Bachat Gat (सखी महिला बचत गट)'
    },
    registrationNumber: {
      type: String,
      default: 'MH/PUN/SHG/2023/0489'
    },
    village: {
      type: String,
      default: 'Shivaji Nagar / शिवाजी नगर'
    },
    taluka: {
      type: String,
      default: 'Haveli / हवेली'
    },
    district: {
      type: String,
      default: 'Pune, Maharashtra / पुणे, महाराष्ट्र'
    },
    leaderName: {
      type: String,
      default: 'Sunita Patil (अध्यक्ष - सुनिता पाटील)'
    },
    leaderPhone: {
      type: String,
      default: '9822012345'
    },
    secretaryName: {
      type: String,
      default: 'Meera Deshmukh (सचिव - मीरा देशमुख)'
    },
    treasurerName: {
      type: String,
      default: 'Asha Shinde (खजिनदार - आशा शिंदे)'
    },
    monthlyContribution: {
      type: Number,
      default: 500
    },
    defaultInterestRate: {
      type: Number,
      default: 1.0 // 1% per month standard for SHGs
    },
    meetingSchedule: {
      type: String,
      default: 'Every month on 26th at 4:00 PM (प्रत्येक महिन्याच्या २६ तारखेला दुपारी ४ वा.)'
    },
    bankDetails: {
      bankName: { type: String, default: 'Bank of Maharashtra (बँक ऑफ महाराष्ट्र)' },
      accountNumber: { type: String, default: '60123456789' },
      ifscCode: { type: String, default: 'MAHB0000123' },
      branch: { type: String, default: 'Shivaji Nagar Branch, Pune' }
    }
  },
  { timestamps: true }
);

export const Group = mongoose.model('Group', groupSchema);
