const Notification = require("../models/Notification");
const User = require("../models/User");
const sendEmail = require("./sendEmail");

const notify =  async({ userId, message, type = "general", relatedId, emailSubject }) => {
  // Create the in-app notification first — this should basically never fail
  const notification = await Notification.create({ userId, message, type, relatedId });

  // Now attempt the email separately, and record the outcome on the notification
  try{
    const user = await User.findById(userId);

    if (!user || !user.email) {
      notification.emailStatus = "failed";
      notification.emailError = "User has no valid email address on file";
      await notification.save();
      console.error(`Notification email skipped for user ${userId}: no email on file`);
      return notification;
    }

    await sendEmail(
      user.email,
      emailSubject || "ResourceLoop Notification",
      `<p>${message}</p>`
    );

    notification.emailStatus = "sent";
    await notification.save();
  } catch (error) {
    // Email failed (e.g. invalid address, Gmail rejected it, network issue) —
    // record it clearly, but don't throw, so the main action isn't blocked
    notification.emailStatus = "failed";
    notification.emailError = error.message;
    await notification.save();
    console.error(`Notification email failed for user ${userId}:`, error.message);
  }
  
  return Notification;
};

module.exports = notify;
