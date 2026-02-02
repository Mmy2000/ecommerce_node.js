const VerificationEmail = (username , otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; } 
            h1 { color: #333; } 
            p { font-size: 16px; color: #555; } 
            h2 { color: #007BFF; }

        </style>
    </head>
    <body>
        <h1>Email Verification</h1>
        <p>Hi ${username},</p>
        <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
        <h2>${otp}</h2> 
        <p>This OTP is valid for the next 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br/>
        <p>Best regards,<br/>The Team</p>
    </body>
    </html>
    `
}

export default VerificationEmail;