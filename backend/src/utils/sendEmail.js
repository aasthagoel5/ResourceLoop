const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// This function sends an email using Brevo's API (HTTPS-based,
// works reliably from cloud hosts, and allows sending to any
// verified recipient once the sender itself is verified)
const sendEmail = async (to, subject, html) => {
  try {
    const sendSmtpEmail = {
      sender: { name: "ResourceLoop", email: "aasthagoel.as@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent to ${to}`, response.messageId);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;