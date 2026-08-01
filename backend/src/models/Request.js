const mongoose = require ('mongoose');

const requestSchema = new mongoose.Schema({
  //Who is making the request
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  //what kind of resorce they need - mirrors Resource's category structure
  resourceType: {
    type: String,
    enum: ["blood", "medicine", "equipment"],
    required: true,
  },

  title:{
    type: String,
    required: true,  // e.g. "Wheelchair", "O+ Blood", "Hospital Bed"
  },
  description: {
    type: String,
  },

  quantity: {
    type: Number,
    required: true,
    default: 1,
  },

  //Ctaegory-specific fields - same pattern as resources
  bloodGroup: {
    type: String, // e.g. "O+", "B-" — only used when resourceType === "blood"
  },
  equipmentType: {
    type: String, // e.g. "Wheelchair", "Hospital Bed" — only used when resourceType === "equipment"
  },
  medicineName: {
    type: String, // only used when resourceType === "medicine"
  },

  urgency: {
    type: String,
    enum: ["low", "medium", "high", "emergency"],
    default: "medium",
  },

  location: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["open", "matched", "fulfilled", "cancelled"],
    default: "open",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Request", requestSchema);
