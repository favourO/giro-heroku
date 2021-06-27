const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: 'ojiakufavour@gmail.com',
            pass: '789&God.'
        }
    });

    let message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
}

module.exports = sendEmail;