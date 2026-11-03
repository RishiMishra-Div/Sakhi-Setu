import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Meeting Notice / सभा सूचना', 'Government Scheme / शासकीय योजना', 'Financial / आर्थिक सूचना', 'Exhibition / प्रदर्शन व विक्री', 'General / सामान्य'],
      default: 'General / सामान्य'
    },
    priority: {
      type: String,
      enum: ['high', 'normal'],
      default: 'normal'
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active'
    },
    postedDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
