import http from 'http';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS,
  },
});


export const sendEmail = async (to, subject, text, html ) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        })
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        return { success: false, error: error.message || error };
    }
}

export default sendEmail ;