const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendFeedbackEmail = async ({ name, phone, email, location, comment }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #f1f0f5; padding: 32px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="background: linear-gradient(135deg, #d4a853, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 24px; margin: 0;">Marbine Feedback</h1>
        <p style="color: #8a8a9a; font-size: 13px; margin-top: 4px;">New message from the contact form</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 0; color: #8a8a9a; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04);">Name</td><td style="padding: 10px 0; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04);">${name}</td></tr>
        <tr><td style="padding: 10px 0; color: #8a8a9a; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04);">Phone</td><td style="padding: 10px 0; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04);">${phone || '—'}</td></tr>
        <tr><td style="padding: 10px 0; color: #8a8a9a; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04);">Email</td><td style="padding: 10px 0; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04);"><a href="mailto:${email}" style="color: #ec4899; text-decoration: none;">${email}</a></td></tr>
        <tr><td style="padding: 10px 0; color: #8a8a9a; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04);">Location</td><td style="padding: 10px 0; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04);">${location || '—'}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 16px; border-radius: 12px; background: rgba(236,72,153,0.04); border: 1px solid rgba(236,72,153,0.08);">
        <p style="color: #8a8a9a; font-size: 12px; margin: 0 0 8px;">MESSAGE</p>
        <p style="font-size: 13px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${comment}</p>
      </div>
      <p style="text-align: center; color: #555; font-size: 11px; margin-top: 24px;">Sent via Marbine Contact Form</p>
    </div>
  `;

  const to = [
    process.env.FEEDBACK_EMAIL_1 || 'marcniyomugabo1@gmail.com',
    process.env.FEEDBACK_EMAIL_2 || 'blandineingabire050@gmail.com',
  ].filter(Boolean);

  await transporter.sendMail({
    from: `"Marbine Contact" <${process.env.SMTP_USER}>`,
    to: to.join(', '),
    subject: `New Feedback from ${name}`,
    html,
  });
};

module.exports = { transporter, sendFeedbackEmail };
