// services/emailService.js
import transporter from '../config/emailConfig.js';

export const sendRegistrationEmail = async (userEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Account Registration Pending Authorization',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Registration Pending Authorization</title>
                <style>
                    /* Main container styling */
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                        color: #333;
                        background-color: #ffffff;
                        border: 1px solid #dddddd;
                    }
                    
                    /* Header styling */
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #333333;
                    }

                    /* Logo styling */
                    .header img {
                        max-width: 150px;
                        height: auto;
                    }

                    /* Title styling */
                    .title {
                        color: #fbbf24; /* Tailwind yellow-500 */
                        font-size: 24px;
                        margin-top: 10px;
                    }

                    /* Message body styling */
                    .body {
                        margin-top: 20px;
                        font-size: 16px;
                        line-height: 1.6;
                        color: #333;
                    }

                    /* Footer styling */
                    .footer {
                        margin-top: 20px;
                        padding-top: 10px;
                        border-top: 1px solid #dddddd;
                        color: #666;
                        font-size: 14px;
                        text-align: center;
                    }

                    /* Button styling */
                    .btn {
                        display: inline-block;
                        background-color: #333333; /* Black */
                        color: #ffffff;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://logoipsum.com/logoipsum.png" alt="Logo">
                        <h1 class="title">Account Registration Pending</h1>
                    </div>
                    <div class="body">
                        <p>Hello,</p>
                        <p>Thank you for registering with us!</p>
                        <p>Your account registration request has been received and is currently pending authorization by an admin. You will receive an update as soon as your account is approved.</p>
                        <p>In the meantime, feel free to reach out if you have any questions.</p>
                        <a href="mailto:support@example.com" class="btn">Contact Support</a>
                    </div>
                    <div class="footer">
                        <p>Thank you for your patience!</p>
                        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Registration email sent successfully');
    } catch (error) {
        console.error('Error sending registration email:', error);
    }
};
