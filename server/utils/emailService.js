const nodemailer = require('nodemailer');

console.log('--- Email Service Config ---');
console.log('HOST:', process.env.EMAIL_HOST);
console.log('PORT:', process.env.EMAIL_PORT);
console.log('USER:', process.env.EMAIL_USER ? '(set)' : '(missing)');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Email Service Connection Error:', error);
    } else {
        console.log('✅ Email Service Connected: Ready to send');
    }
});

const sendEmail = async (options) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Email Error: Missing credentials. Cannot send email.');
        return;
    }

    const mailOptions = {
        from: `"Career Bridge" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent: ${info.messageId} to ${options.email}`);
    } catch (error) {
        console.error('❌ Email Send Error:', error);
    }
};

const sendInterviewConfirmation = async (student, interview, job, recruiter) => {
    const date = new Date(interview.scheduledDate).toLocaleDateString();
    const time = new Date(interview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Interview Scheduled! 🌉</h2>
            <p>Hello <strong>${student.name}</strong>,</p>
            <p>Congratulations! An interview has been scheduled for your application at <strong>${job.company}</strong> for the position of <strong>${job.title}</strong>.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p><strong>📅 Date:</strong> ${date}</p>
                <p><strong>🕒 Time:</strong> ${time} (${interview.duration} mins)</p>
                <p><strong>📍 Type:</strong> ${interview.meetingType}</p>
                ${interview.location ? `<p><strong>🏢 Location:</strong> ${interview.location}</p>` : ''}
                ${interview.meetingLink ? `<p><strong>🔗 Link:</strong> <a href="${interview.meetingLink}">${interview.meetingLink}</a></p>` : ''}
                <p><strong>👤 Recruiter:</strong> ${recruiter.name}</p>
            </div>

            ${interview.notes ? `<p><strong>📝 Notes from Recruiter:</strong> ${interview.notes}</p>` : ''}

            <p>Good luck with your preparation!</p>
            <br>
            <p>Best regards,<br>The Career Bridge Team</p>
        </div>
    `;

    await sendEmail({
        email: student.email,
        subject: `Interview Scheduled: ${job.title} at ${job.company}`,
        html
    });
};

const sendInterviewRescheduled = async (student, interview, job) => {
    const date = new Date(interview.scheduledDate).toLocaleDateString();
    const time = new Date(interview.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #f59e0b;">Interview Rescheduled 📅</h2>
            <p>Hello <strong>${student.name}</strong>,</p>
            <p>Your interview for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been rescheduled.</p>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p><strong>📅 New Date:</strong> ${date}</p>
                <p><strong>🕒 New Time:</strong> ${time} (${interview.duration} mins)</p>
                ${interview.meetingLink ? `<p><strong>🔗 Link:</strong> <a href="${interview.meetingLink}">${interview.meetingLink}</a></p>` : ''}
            </div>

            <p>Please update your calendar accordingly.</p>
            <br>
            <p>Best regards,<br>The Career Bridge Team</p>
        </div>
    `;

    await sendEmail({
        email: student.email,
        subject: `Rescheduled: Interview for ${job.title}`,
        html
    });
};

const sendInterviewCancelled = async (student, interview, job) => {
    const date = new Date(interview.scheduledDate).toLocaleDateString();

    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #ef4444;">Interview Cancelled ❌</h2>
            <p>Hello <strong>${student.name}</strong>,</p>
            <p>We regret to inform you that your interview for <strong>${job.title}</strong> at <strong>${job.company}</strong> (previously scheduled for ${date}) has been cancelled.</p>
            
            <p>If you have any questions, please contact the recruiter directly.</p>
            <br>
            <p>Best regards,<br>The Career Bridge Team</p>
        </div>
    `;

    await sendEmail({
        email: student.email,
        subject: `Cancelled: Interview for ${job.title}`,
        html
    });
};

const sendInterviewFeedback = async (student, interview, job) => {
    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #10b981;">Interview Feedback Available! 🌟</h2>
            <p>Hello <strong>${student.name}</strong>,</p>
            <p>Your interview for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been completed, and the recruiter has provided feedback.</p>
            
            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p><strong>📝 Recruiter Feedback:</strong></p>
                <p>${interview.feedback || 'Please check the portal for detailed feedback.'}</p>
            </div>

            <p>Log in to the Career Bridge portal to view your next steps.</p>
            <br>
            <p>Best regards,<br>The Career Bridge Team</p>
        </div>
    `;

    await sendEmail({
        email: student.email,
        subject: `Interview Feedback: ${job.title}`,
        html
    });
};

const sendApplicationConfirmation = async (student, job) => {
    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Application Received! 📝</h2>
            <p>Hello <strong>${student.name}</strong>,</p>
            <p>Thank you for applying for the position of <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>
            
            <p>Your application has been successfully received by the recruiter. We will notify you once there is an update on your status.</p>
            
            <p>You can track your application status in the Career Bridge portal.</p>
            <br>
            <p>Best regards,<br>The Career Bridge Team</p>
        </div>
    `;

    await sendEmail({
        email: student.email,
        subject: `Application Confirmation: ${job.title}`,
        html
    });
};

const sendStatusUpdate = async (student, job, status) => {
    const statusMap = {
        'applied': 'Applied',
        'shortlisted': 'Shortlisted 📄',
        'interview_scheduled': 'Interview Scheduled 📅',
        'rejected': 'Not Selected ❌',
        'hired': 'Hired! 🎉'
    };

    const friendlyStatus = statusMap[status] || status;
    const color = status === 'hired' ? '#10b981' : (status === 'rejected' ? '#ef4444' : '#2563eb');

    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: ${color};">Application Update: ${friendlyStatus}</h2>
            <p>Hello <strong>${student.name}</strong>,</p>
            <p>There has been an update to your application for <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Current Status:</strong> ${friendlyStatus}</p>
            </div>

            ${status === 'hired' ? '<p>Congratulations on your new role! The recruiter will contact you soon with next steps.</p>' : '<p>Log in to the Career Bridge portal for more details.</p>'}
            
            <br>
            <p>Best regards,<br>The Career Bridge Team</p>
        </div>
    `;

    await sendEmail({
        email: student.email,
        subject: `Update: Application for ${job.title}`,
        html
    });
};

module.exports = {
    sendInterviewConfirmation,
    sendInterviewRescheduled,
    sendInterviewCancelled,
    sendInterviewFeedback,
    sendApplicationConfirmation,
    sendStatusUpdate
};
