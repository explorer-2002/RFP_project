import { Resend } from 'resend';
import dotenv from 'dotenv';
import { emailTemplateRequestingResend, getEmailTemplate, getEmailTemplateForPlacingOrder } from './sendingEmailTemplate.js';

dotenv.config();

// 2. Initialize Resend with your key
export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmails = async (emails, rfpObject) => {
  try {
    const emailTemplate = getEmailTemplate(rfpObject);

    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // MUST use this for testing
      to: emails, 
      subject: 'Request for Proposal',
      html: emailTemplate,
    });

  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendEmailForConfirmingOrder = async (senderName) => {
  try {
    const emailTemplate = getEmailTemplateForPlacingOrder(senderName);

    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // MUST use this for testing
      to: ['sanyamj924@gmail.com'], 
      subject: 'Order Confirmed 🎉',
      html: emailTemplate,
    });

  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendEmailForRequestingProposalResend = async () => {
  try {
    const emailTemplate = emailTemplateRequestingResend();

    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // MUST use this for testing
      to: ['sanyamj924@gmail.com'], 
      subject: 'Requesting Proposal Resend',
      html: emailTemplate,
    });

  } catch (error) {
    console.error('Error sending email:', error);
  }
};