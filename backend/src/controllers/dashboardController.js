const User = require("../models/User");
const Resource = require("../models/Resources");
const Request = require("../models/Request");
const Donation = require("../models/Donation");
const Hospital = require("../models/Hospital");
const NGO = require("../models/NGO");

// @route  GET /api/dashboard/individual
// @desc   Dashboard summary for individual users
exports.getIndividualDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const[ donations, requests, user] = await Promise.all([
      Donation.find({ donorId: userId }).populate("resourceId", "title category"),
      Request.find({ requesterId: userId }),
      User.findById(userId).select("-password -refreshToken").populate("savedResources"),
    ]);

    res.status(200).json({
      profile: user,
      myDonations: { count: donations.length, items: donations },
      myRequests: { count: requests.length, items: requests },
      savedResources: { count: user.savedResources.length, items: user.savedResources },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/dashboard/hospital
// @desc   Dashboard summary for a hospital
exports.getHospitalDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

     const [hospitalProfile, inventory, receivedDonations, activeRequests] = await Promise.all([
      Hospital.findOne({ userId }),
      Resource.find({ donorId: userId }), // resources this hospital has listed
      Donation.find({ receiverId: userId }).populate("resourceId", "title category"),
      Request.find({ requesterId: userId, status: "open" }), // requests THIS hospital made that are still open
    ]);

    res.status(200).json({
      profile: hospitalProfile,
      inventory: { count: inventory.length, items: inventory },
      receivedDonations: { count: receivedDonations.length, items: receivedDonations },
      activeRequests: { count: activeRequests.length, items: activeRequests },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route  GET /api/dashboard/ngo
// @desc   Dashboard summary for an NGO
exports.getNGODashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [ngoProfile, resourcesManaged, donationsFacilitated] = await Promise.all([
      NGO.findOne({ userId }),
      Resource.find({ donorId: userId }),
      Donation.find({ $or: [{ donorId: userId }, { receiverId: userId }] }).populate("resourceId", "title category"),
    ]);

    res.status(200).json({
      profile: ngoProfile,
      resourcesManaged: { count: resourcesManaged.length, items: resourcesManaged },
      donationsFacilitated: { count: donationsFacilitated.length, items: donationsFacilitated },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/dashboard/admin
// @desc   Dashboard summary for an admin
exports.getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalIndividuals,
      totalHospitals,
      totalNGOs,
      pendingHospitals,
      pendingNGOs,
      pendingResources,
      totalResources,
      totalRequests,
      totalDonations,
      completedDonations,
    ]= await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "individual" }),
      User.countDocuments({ role: "hospital" }),
      User.countDocuments({ role: "ngo" }),
      Hospital.countDocuments({ verificationStatus: "pending" }),
      NGO.countDocuments({ verificationStatus: "pending" }),
      Resource.countDocuments({ status: "pending" }),
      Resource.countDocuments(),
      Request.countDocuments(),
      Donation.countDocuments(),
      Donation.countDocuments({ status: "completed" }),
    ]);

    res.status(200).json({
      users: {
        total: totalUsers,
        individuals: totalIndividuals,
        hospitals: totalHospitals,
        ngos: totalNGOs,
      },
      pendingVerifications: {
        hospitals: pendingHospitals,
        ngos: pendingNGOs,
        resources: pendingResources,
        total: pendingHospitals + pendingNGOs + pendingResources,
      },
      platformStats: {
        totalResources,
        totalRequests,
        totalDonations,
        completedDonations,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



