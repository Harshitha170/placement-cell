const { sendApplicationConfirmation, sendInterviewConfirmation } = require('./utils/emailService');
require('dotenv').config({ path: './.env' });

const testEmail = async () => {
    // 1. Mock Data
    const mockStudent = {
        name: "Harshitha TestUser",
        email: "student@example.com" // This will go to Mailtrap inbox
    };

    const mockJob = {
        title: "Software Engineer Intern",
        company: "Google"
    };

    const mockRecruiter = {
        name: "Recruiter Bob",
        email: "recruiter@google.com"
    };

    const mockInterview = {
        scheduledDate: new Date(),
        duration: 45,
        meetingType: "Video Call",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        notes: "Please be ready with your resume."
    };

    console.log("🚀 Starting Email Test...");

    try {
        // 2. Test Application Confirmation Email
        console.log("📨 Sending Application Confirmation...");
        await sendApplicationConfirmation(mockStudent, mockJob);
        console.log("✅ Application Email Sent!");

        // 3. Test Interview Scheduled Email
        console.log("📨 Sending Interview Scheduled...");
        await sendInterviewConfirmation(mockStudent, mockInterview, mockJob, mockRecruiter);
        console.log("✅ Interview Email Sent!");

        console.log("\n🎉 TEST COMPLETE! Check your Mailtrap Inbox now.");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

testEmail();
