const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  // Who's listing this resource
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title:{
    type: String,
    required: true,  // e.g. "Wheelchair", "O+ Blood", "Hospital Bed"
  },
  description:{
    type: String,
  },

  category:{
    type: String,
    enum: ["blood","medicine","equipment"],
    required: true,
  },

  // How this resource is being offered
  listingType: {
    type: String,
    enum: ["donate", "lend", "sell"],
    required: true,
  },

  // Only relevant if listingType === "lend"
  securityDeposit: {
    type: Number,
    default: 0,
  },

  // Only relevant if listingType === "sell"
  price: {
    type: Number,
    default: 0,
  },


  quantity: {
    type: Number,
    required: true,
    default: 1,
  },

  // Category-specific fields (only relevant depending on "category")
  bloodGroup: {
    type: String, // e.g. "O+", "B-" — only used when category === "blood"
  },
  condition: {
    type: String, // e.g. "Good", "Fair" — only used when category === "equipment"
  },
  expiryDate: {
    type: Date, // only used when category === "medicine"
  },

  location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number], // [longitude, latitude] — MongoDB requires this exact order
    required: true,
  },
  address: {
    type: String, // human-readable text, e.g. "Jaipur, Rajasthan" — for display purposes
  },
},

  status: {
    type: String,
    enum: ["pending", "available", "reserved", "completed", "rejected"],
    default: "pending", //every resource starts pending admin approval
  },
  images: [
  {
    type: String, // Cloudinary URLs
  },
],
}, {
  timestamps: true,
});

resourceSchema.index({ location: "2dsphere" }); // enables geospatial queries
module.exports = mongoose.model("Resource", resourceSchema);

