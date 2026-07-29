const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  // Links this Hospital profile to its corresponding User account
  // (where email, password, role="hospital" already live)
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // tells Mongoose this ID refers to a document in the "User" collection

    required: true,
    unique: true,  //one hospital profile per user account
  },
  hospitalName: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true, // no two hospitals should share the same registration number
  },
  address: {
    type: String,
    required: true,
  },

  // Extra fields from your Profile Management section (Section B)
  contactPerson: {
    type: String,
  },
  facilities: {
    type: String, // could later become an array like ["ICU", "Blood Bank"]
  },
  emergencyContact: {
    type: String,
  },
  verificationDocuments: {
    type: String, // will store a file URL once you add document upload later
  },

  // Admin approval workflow (from your Admin Panel section)
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending", // every new hospital starts unverified until admin approves
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Hospital", hospitalSchema);
