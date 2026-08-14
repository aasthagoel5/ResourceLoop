const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  // Links this NGO profile to its corresponding User account
  // (where email, password, role="ngo" already live)
  userId: {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true,
    unique : true,  //one ngo profile per user account
  },

  organizationName: {
    type: String,
    required: true,
  },

  registrationId: {
    type: String,
    required: true,
    unique: true, //no two ngos should share the same registration ID
  },

  address: {
    type: String,
    reuired: true,
  },

  contactPerson: {
    type: String,
  },

  //Admin approval workflow(same pattern as hospital)
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  verificationDocuments: {
  type: String, // Cloudinary URL to the uploaded document
},
}, {
  timestamps: true,
});

module.exports = mongoose.model("NGO", ngoSchema);

