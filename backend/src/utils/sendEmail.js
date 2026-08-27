const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// This function sends an email using Resend's API (HTTPS-based,
// works reliably from cloud hosts like Render, unlike SMTP which
// is often blocked on free tiers)
const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "ResourceLoop <onboarding@resend.dev>", // Resend's free testing sender
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email sending failed:", error);
      throw new Error(error.message || "Email sending failed");
    }

    console.log(`Email sent to ${to}`, data);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;