import express from 'express';
import { GoogleGenAI } from "@google/genai";
import { Rfp } from '../models/rfp.js';
import { sendEmails } from '../helpers/sendEmails.js';
import { Vendor } from '../models/vendors.js';
import { systemPromptForExtractingRfpDetails } from '../helpers/systemPrompts.js';

const router = express.Router();

const getRfpJsonFromUserPrompt = async (userPrompt) => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            thinkingConfig: {
                thinkingBudget: 0,
            },
            systemInstruction: systemPromptForExtractingRfpDetails
        },
        contents: userPrompt
    });

    return JSON.parse(result.text.substring(13, result.text.length - 3));
};

async function updateEmailStatus(emails) {
    await Vendor.updateMany(
  { email: { $in: emails } },
  { $set: { emailSent: true } }
);
}

router.post('/', async (req, res) => {
    const { userPrompt, emails } = req.body;

    const rfpObject = await getRfpJsonFromUserPrompt(userPrompt);
    console.log('Generated RFP Object:', rfpObject);

    await Rfp.create(rfpObject);

    if(emails && emails.length > 0) {
        await sendEmails(emails, rfpObject);
        updateEmailStatus(emails);
    }

    return res.status(201).json({
        message: 'RPF creation successful',
    });
});

router.get('/', async (req, res) => {
    try {
        const rfps = await Rfp.find().sort({ createdAt: -1 });

        return res.status(201).json({
            message: 'RFP data fetched successfully',
            data: rfps
        });
    } catch (error) {
        console.error('Error fetching RFPs:', error);
        return res.status(500).json({
            message: 'Error fetching RFP data',
            error: error.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rfp = await Rfp.findById(id) || {};

        return res.status(201).json({
            message: 'RFP data fetched successfully',
            data: rfp
        });
    } catch (error) {
        console.error('Error fetching RFP with given id:', error);
        return res.status(500).json({
            message: 'Error fetching RFP data',
            error: error.message
        });
    }
});

export default router;