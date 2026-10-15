import transporter from "../config/nodemailer.js"

export const sendOtpEmail = async (toEmail, otp, name = '') => {
  const mailOptions = {
    from: `"CivicConnect" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    replyTo: process.env.EMAIL_USER,
    subject: 'Your CivicConnect Password Reset Code',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #1e293b;">Reset your password</h2>
            <p style="color: #475569;">Hi ${name || 'there'},</p>
            <p style="color: #475569;">Use the code below to reset your CivicConnect password. This code expires in 10 minutes.</p>
            <div style="background: #f1f5f9; text-align: center; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #2563eb;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
        `
    }

  await transporter.sendMail(mailOptions)
}