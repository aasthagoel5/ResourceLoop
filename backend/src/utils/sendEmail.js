const nodemailer = require("nodemailer");

// This function sends an email using Gmail's SMTP service.
// It's reusable — we'll use it for both Email Verification and Forgot Password later.
const sendEmail = async (to, subject, html) => {
  try {
    // Create a transporter object using Gmail's SMTP service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail password or App Password
      },
    }); 

    //Define what the email looks like
    const mailoptions ={
      from :`"ResourceLoop" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    };

    // Actually send the email
    await transporter.sendMail(mailoptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;