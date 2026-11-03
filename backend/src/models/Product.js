import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Food / खाद्यपदार्थ', 'Handicrafts / हस्तकला', 'Spices / मसाले', 'Textiles / कापड व पिशव्या', 'Cosmetics / घरगुती साबण व उत्पादने', 'Other / इतर'],
      default: 'Food / खाद्यपदार्थ'
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [1, 'Price must be greater than 0']
    },
    unit: {
      type: String,
      default: 'piece'
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
    },
    makerName: {
      type: String,
      default: 'सखी बचत गट सदस्य (Sakhi Member)'
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    },
    contactPhone: {
      type: String,
      default: '9822012345'
    },
    availability: {
      type: String,
      enum: ['available', 'made_to_order', 'out_of_stock'],
      default: 'available'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
