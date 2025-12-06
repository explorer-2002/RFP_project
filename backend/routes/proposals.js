import express from 'express';
import { Proposals } from '../models/proposals.js';
import { systemPromptForAnalyzingProposalEmail } from '../helpers/systemPrompts.js';
import { logtail } from '../helpers/logger.js';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { resend, sendEmailForConfirmingOrder, sendEmailForRequestingProposalResend } from '../helpers/sendEmails.js';
import { Rfp } from '../models/rfp.js';

dotenv.config();

const router = express.Router();

const fetchFullEmailFromResend = async (emailId) => {
    try {
        const { data } = await resend.emails.receiving.get(emailId);

        return data;

    } catch (error) {
        console.error('Error fetching email from Resend:', error);
        return {};
    }
};

const getProposalDetailsFromEmail = async (emailData, rfpDetails) => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    const systemInstruction = systemPromptForAnalyzingProposalEmail(rfpDetails)

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            thinkingConfig: {
                thinkingBudget: 0,
            },
            systemInstruction: systemInstruction
        },
        contents: emailData
    });

    return JSON.parse(result.text.substring(13, result.text.length - 3));
};

router.get('/', async (req, res) => {
    try {
        const proposalsForRfp = await Proposals.find({}).sort({ createdAt: -1 });

        return res.status(201).json({
            message: 'Vendors fetched successfully',
            data: proposalsForRfp
        });
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return res.status(500).json({
            message: 'Error fetching proposals for given RFP',
            error: error.message
        });
    }
});

// Endpoint to handle incoming emails from Resend
router.post('/', async (req, res) => {
    try {
        const payload = req.body;

        if (payload.type === 'email.received') {

            const email = payload?.data;

            const fullEmail = await fetchFullEmailFromResend(email?.email_id);

            const rfpDetails = await Rfp.findOne({});
            const proposalObject = await getProposalDetailsFromEmail(fullEmail?.html, rfpDetails);

            if (!proposalObject || Object.keys(proposalObject).length === 0) {
                await sendEmailForRequestingProposalResend()

                return res.status(200).json({
                    message: 'No proposal details found in the email',
                    data: []
                });

            }

            const existingProposal = await Proposals.findOne({ sender: proposalObject?.sender });

            if (existingProposal) {
                await Proposals.findOneAndUpdate(
                    { sender: proposalObject?.sender },
                    { emailBody: fullEmail?.text, ...proposalObject },
                    { new: true }
                );

                return res.status(200).json({
                    message: 'Proposal from this sender already exists',
                    data: []
                });
            }

            const savedProposal = await Proposals.create({
                emailBody: fullEmail?.text,
                ...proposalObject
            });

            if (savedProposal?.id) {
                await Rfp.findOneAndUpdate(
                    {},
                    {
                        $push: {
                            proposalIds: savedProposal.id.toString()
                        }
                    },
                    { new: true }
                );
            }

            return res.status(201).json({
                message: 'Proposal data saved successfully',
                data: []
            });
        }

    } catch (error) {
        console.error('Error fetching proposal:', error);
        return res.status(200).json({
            message: 'Error saving proposal data',
            error: error.message
        });
    }
});

router.post('/placeOrder/:rfpId/:proposalId', async (req, res) => {
    try {
        const { senderName } = req.body;
        const { rfpId, proposalId } = req.params;

        await sendEmailForConfirmingOrder(senderName);
        await Rfp.findByIdAndUpdate(
            rfpId,
            {
                orderPlaced: {
                    isPlaced: true,
                    vendorName: senderName,
                    proposalId: proposalId
                }
            },
            { new: true }
        );

        await Proposals.findOneAndUpdate(
            { id: proposalId },
            { orderConfirmed: true },
            { new: true }
        );

        return res.status(201).json({
            message: `Email for order confirmation sent successfully to ${senderName}`,
        });
    }

    catch (error) {
        console.error('Error sending email for proposal:', error);
        return res.status(500).json({
            message: 'Error sending email for proposal for placing order',
            error: error.message
        });
    }
})

export default router;