import transporter from '../config/emailConfig.js';

// Registration Email (Existing)
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
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333; background-color: #ffffff; border: 1px solid #dddddd; }
                    .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #333333; }
                    .header img { max-width: 150px; height: auto; }
                    .title { color: #fbbf24; font-size: 24px; margin-top: 10px; }
                    .body { margin-top: 20px; font-size: 16px; line-height: 1.6; color: #333; }
                    .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #dddddd; color: #666; font-size: 14px; text-align: center; }
                    .btn { display: inline-block; background-color: #333333; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
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

// Approval Email
export const sendApprovalEmail = async (userEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Account Approved',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Approved</title>
                <style>
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333; background-color: #ffffff; border: 1px solid #dddddd; }
                    .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #28a745; }
                    .header img { max-width: 150px; height: auto; }
                    .title { color: #28a745; font-size: 24px; margin-top: 10px; }
                    .body { margin-top: 20px; font-size: 16px; line-height: 1.6; color: #333; }
                    .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #dddddd; color: #666; font-size: 14px; text-align: center; }
                    .button-container { text-align: center; margin-top: 20px; }
                    .button { background-color: #28a745; color: #ffffff; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; }
                    .button:hover { background-color: #218838; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://logoipsum.com/logoipsum.png" alt="Logo">
                        <h1 class="title">Congratulations, Your Account is Approved!</h1>
                    </div>
                    <div class="body">
                        <p>Hello,</p>
                        <p>We are excited to let you know that your registration has been approved! You can now log in and start using our services.</p>
                        <div class="button-container">
                            <a href="http://localhost:3000/auth/login" class="button">Login to Your Account</a>
                        </div>
                        <p>If you have any questions or need support, feel free to contact our team.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
                        <p><a href="http://yourcompany.com" style="color: #28a745; text-decoration: none;">Visit our website</a></p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Approval email sent successfully');
    } catch (error) {
        console.error('Error sending approval email:', error);
    }
};


// Rejection Email
export const sendRejectionEmail = async (userEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Account Registration Rejected',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Rejected</title>
                <style>
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333; background-color: #ffffff; border: 1px solid #dddddd; }
                    .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #dc3545; }
                    .header img { max-width: 150px; height: auto; }
                    .title { color: #dc3545; font-size: 24px; margin-top: 10px; }
                    .body { margin-top: 20px; font-size: 16px; line-height: 1.6; color: #333; }
                    .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #dddddd; color: #666; font-size: 14px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://logoipsum.com/logoipsum.png" alt="Logo">
                        <h1 class="title">Your Account Registration was Rejected</h1>
                    </div>
                    <div class="body">
                        <p>Hello,</p>
                        <p>We regret to inform you that your registration has been rejected. For further details, please contact support.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Rejection email sent successfully');
    } catch (error) {
        console.error('Error sending rejection email:', error);
    }
};

// services/emailService.js
export const sendUnblockNotification = async (userEmail, userName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Account Unblocked Notification',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Unblocked</title>
                <style>
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333; }
                    .header { text-align: center; padding-bottom: 20px; }
                    .header img { max-width: 50px; }
                    .body { margin-top: 20px; font-size: 16px; line-height: 1.6; color: #333; }
                    .success { color: #38a169; }
                    .footer { margin-top: 20px; font-size: 14px; color: #666; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://img.icons8.com/color/48/000000/checked--v1.png" alt="Success Icon">
                        <h1 class="success">Account Unblocked</h1>
                    </div>
                    <div class="body">
                        <p>Hello ${userName},</p>
                        <p>We are pleased to inform you that your account has been unblocked. You can now log in and resume using our services.</p>
                        <p>Thank you,</p>
                        <p>Your Company Support Team</p>
                    </div>
                    <div class="footer">
                        &copy; 2024 Your Company Name. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Unblock notification email sent successfully');
    } catch (error) {
        console.error('Error sending unblock notification email:', error);
    }
};



export const sendBlockNotification = async (userEmail, userName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Account Blocked Notification',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Blocked</title>
                <style>
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333; }
                    .header { text-align: center; padding-bottom: 20px; }
                    .header img { max-width: 50px; }
                    .body { margin-top: 20px; font-size: 16px; line-height: 1.6; color: #333; }
                    .warning { color: #e3342f; }
                    .footer { margin-top: 20px; font-size: 14px; color: #666; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://img.icons8.com/color/48/000000/error--v1.png" alt="Warning Icon">
                        <h1 class="warning">Account Blocked</h1>
                    </div>
                    <div class="body">
                        <p>Hello ${userName},</p>
                        <p>We regret to inform you that your account has been blocked. If you have any questions, please contact support.</p>
                        <p>Thank you,</p>
                        <p>Your Company Support Team</p>
                    </div>
                    <div class="footer">
                        &copy; 2024 Your Company Name. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Block notification email sent successfully');
    } catch (error) {
        console.error('Error sending block notification email:', error);
    }
};
