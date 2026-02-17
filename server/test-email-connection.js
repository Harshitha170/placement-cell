const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('--- Email Connection Tester ---');
console.log('Checking environment variables...');

const HOST = process.env.EMAIL_HOST;
const PORT = process.env.EMAIL_PORT;
const USER = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS ? '********' : '(not set)';

console.log(`HOST: ${HOST}`);
console.log(`PORT: ${PORT}`);
console.log(`USER: ${USER}`);
console.log(`PASS: ${PASS}`);

if (!HOST || !PORT || !USER || !process.env.EMAIL_PASS) {
    console.error('\n❌ ERROR: Missing one or more email environment variables.');
    console.error('Ensure EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS are set.');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

console.log('\nAttempting to connect to SMTP server...');

transporter.verify(function (error, success) {
    if (error) {
        console.error('\n❌ Connection failed!');
        console.error(error);
    } else {
        console.log('\n✅ Connection successful!');
        console.log('Server is ready to take our messages');
    }
});
