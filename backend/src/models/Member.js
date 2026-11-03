import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    },
    memberCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    roleInGroup: {
      type: String,
      default: 'सदस्य (Member)'
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    address: {
      type: String
    },
    bankAccount: {
      type: String
    },
    emergencyContact: {
      type: String
    }
  },
  { timestamps: true }
);

export const Member = mongoose.model('Member', memberSchema);
