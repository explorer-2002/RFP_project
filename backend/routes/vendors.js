import express from 'express';
import { Vendor } from '../models/vendors.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const vendors = await Vendor.find().sort({ createdAt: -1 });

        return res.status(201).json({
            message: 'Vendors fetched successfully',
            data: vendors
        });
    } catch (error) {
        console.error('Error fetching Vendors:', error);
        return res.status(500).json({
            message: 'Error fetching vendor data',
            error: error.message
        });
    }
});

export default router;