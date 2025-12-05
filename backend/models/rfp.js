import mongoose from 'mongoose';

const rfpSchema = new mongoose.Schema({
  items: [
    {
      itemName: {
        type: String,
        required: true,
        trim: true     
      },
      quantity: {
        type: Number,
        required: true,
        min: 1         
      }
    }
  ],

  'budget_in_$': {
    type: Number,
    required: true,
    min: 0
  },
  expectedDeliveryDate: {
    type: Date,
    required: true
  },
  proposalIds: {
    type: [String],
    default: []
  },

  orderPlaced: {
    isPlaced: {
      type: Boolean,
      default: false
    },

    vendorName: {
      type: String
    },

    proposalId: {
      type: String
    }
  }
}, {
  timestamps: true 
});

export const Rfp = mongoose.model('Rfp', rfpSchema);