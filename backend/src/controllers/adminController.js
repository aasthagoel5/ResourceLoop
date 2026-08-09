const Hospital = require("../models/Hospital");
const NGO = require("../models/NGO");
const Resource = require("../models/Resources");
const User = require("../models/User");
const Donation = require("../models/Donation");
const notify = require("../utils/notify");
const Report = require("../models/Report");


// @route  GET /api/admin/hospitals/pending
// @desc   Get all hospitals awaiting verification
exports.getPendingHospitals = async (req, res) => {
  try{
    const hospitals = await Hospital.find({ verificationStatus: "pending"})
      .populate("userId", "name email phone");  //pulls in basic user info alongside hospital data

      res.status(200).json({count: hospitals.length , hospitals});
  }catch (error){
    res.status(500).json({message: error.message });
  }
};

// @route  PUT /api/admin/hospitals/:id/verify
// @desc   Approve or reject a hospital's verification
exports.verifyHospital = async (req, res) => {
  try{
    const { id } = req.params;
    const { status } = req.body; // expected: "verified" or "rejected"

    if(!["verified", "rejected"].includes(status)){
      return res.status(400).json({ message: "Status must be 'verified' or 'rejected'" });
    }
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.verificationStatus = status;
    await hospital.save();

    await notify({
      userId: hospital.userId,
      message: `Your hospital account has been ${status} by an admin.`,
      type: "verification",
      relatedId: hospital._id,
      emailSubject: `Your ResourceLoop hospital account was ${status}`,
  });

    res.status(200).json({ message: `Hospital ${status} successfully`, hospital });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route  GET /api/admin/ngos/pending
// @desc   Get all NGOs awaiting verification
exports.getPendingNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({ verificationStatus: "pending" })
      .populate("userId", "name email phone");

    res.status(200).json({ count: ngos.length, ngos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/admin/ngos/:id/verify
// @desc   Approve or reject an NGO's verification
exports.verifyNGO = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'verified' or 'rejected'" });
    }

    const ngo = await NGO.findById(id);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    ngo.verificationStatus = status;
    await ngo.save();

    await notify({
      userId: ngo.userId,
      message: `Your NGO account has been ${status} by an admin.`,
      type: "verification",
      relatedId: ngo._id,
      emailSubject: `Your ResourceLoop NGO account was ${status}`,
    });

    res.status(200).json({ message: `NGO ${status} successfully`, ngo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/admin/resources/pending
// @desc   Get all resources awaiting admin approval
exports.getPendingResources = async (req, res) => {
  try {
    const resources = await Resource.find({ status: "pending" })
      .populate("donorId", "name email phone");

      res.status(200).json({ count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/admin/resources/:id/verify
// @desc   Approve or reject a resource listing
exports.verifyResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;  //expected: "available" or "rejected"

    if (!["available", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'available' or 'rejected'" });
    }

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    resource.status = status;
    await resource.save();

    await notify({
      userId: resource.donorId,
      message: `Your resource listing "${resource.title}" has been ${status} by an admin.`,
      type: "resource",
      relatedId: resource._id,
      emailSubject: `Your ResourceLoop listing was ${status}`,
    });

    res.status(200).json({ message: `Resource ${status} successfully`, resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password -refreshToken -verificationToken -resetPasswordToken");
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete an admin account" });

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route  GET /api/admin/reports
exports.getReports = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : { status: "pending" };
    const reports = await Report.find(filter).populate("reportedBy", "name email").sort({ createdAt: -1 });
    res.status(200).json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route  PUT /api/admin/reports/:id
exports.resolveReport = async (req, res) => {
  try {
    const { status } = req.body; // "reviewed" or "dismissed"
    if (!["reviewed", "dismissed"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'reviewed' or 'dismissed'" });
    }
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = status;
    await report.save();
    res.status(200).json({ message: `Report ${status}`, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route  GET /api/admin/activity
exports.getRecentActivity = async (req, res) => {
  try {
    const [recentUsers, recentResources, recentDonations] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(10).select("name email role createdAt"),
      Resource.find().sort({ createdAt: -1 }).limit(10).select("title category status createdAt"),
      Donation.find().sort({ createdAt: -1 }).limit(10).populate("resourceId", "title"),
    ]);
    res.status(200).json({ recentUsers, recentResources, recentDonations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
