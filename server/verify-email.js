const nodemailer = require('nodemailer');
require('dotenv').config();

async function verifyConnection() {
    console.log("🔍 Testing SMTP Connection...");
    console.log(`Host: ${process.env.EMAIL_HOST}`);
    console.log(`Port: ${process.env.EMAIL_PORT}`);
    console.log(`User: ${process.env.EMAIL_USER}`);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.verify();
        console.log("✅ Server is ready to take our messages");

        // Try sending one
        const info = await transporter.sendMail({
            from: '"Test Server" <test@example.com>',
            to: "test@example.com",
            subject: "Hello ✔",
            text: "Hello world?",
            html: "<b>Hello world?</b>",
        });
        console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.error("❌ Connection failed:", error);
    }
}

verifyConnection();
