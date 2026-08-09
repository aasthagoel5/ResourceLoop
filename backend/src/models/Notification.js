const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["donation", "request", "verification", "resource", "general"],
    default: "general",
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  readStatus: {
    type: Boolean,
    default: false,
  },

  // NEW: tracks whether the email actually sent successfully
  emailStatus: {
    type: String,
    enum: ["sent", "failed", "not_attempted"],
    default: "not_attempted",
  },
  emailError: {
    type: String, // stores the actual error message, if any, for debugging
  },
}, {
  timestamps: true,

});

module.exports = mongoose.model("Notification", notificationSchema);