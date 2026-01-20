import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendPasswordResetEmail = async (email: string, otp: string) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Reset your password - OpinionHub",
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Someone requested a password reset for your OpinionHub account. Use the following 6-digit code to reset your password:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 25px 0;">
          <h1 style="letter-spacing: 5px; color: #000; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">&copy; 2026 OpinionHub Survey Platform</p>
      </div>
    `,
    });
};
