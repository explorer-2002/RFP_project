import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const proposalSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4()
    },

    sender: {
        type: String,
        required: true,
        unique: true
    },

    deliveryDate: {
        type: Date,
        required: true
    },

    dateForPayment: {
        type: Date
    },

    cost: {
        type: Number,
        required: true
    },

    emailBody: {
        type: String,
        required: true
    },

    attachmentsData: [{
        filename: String,
        extractedText: String
    }],

    aiAnalysis: {
        score: Number,
        summary: String
    },

    orderConfirmed: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

export const Proposals = mongoose.model('Proposal', proposalSchema);