import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    contact: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },

    emailSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const Vendor = mongoose.model('Vendor', vendorSchema);