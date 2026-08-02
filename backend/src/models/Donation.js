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
},{ timestamps: true 
}
);

module.exports = mongoose.model("Donation", donationSchema);