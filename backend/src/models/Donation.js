const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: false,
  },

  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
    required: true,
  },

  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },

  date: {
    type: Date,
    default: Date.now,
  },

  // A simple free-text note either party can add — stands in for OLX-style
  // chat coordination (meetup time/place), without building full messaging
  coordinationNote: {
    type: String,
  },

  // Timeline of every status change, so we can show real history
  // (e.g. "Accepted on Aug 14, 3:15 PM") instead of just the current state
  timeline: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
},{ timestamps: true 
}
);

module.exports = mongoose.model("Donation", donationSchema);