const Hospital = require("../models/Hospital");
const NGO = require("../models/NGO");
const Resources = require("../models/Resources");


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

    res.status(200).json({ message: `NGO ${status} successfully`, ngo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/admin/resources/pending
// @desc   Get all resources awaiting admin approval
exports.getPendingResources = async (req, res) => {
  try {
    const resources = await Resources.find({ status: "pending" })
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

    const resource = await Resources.findById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    resource.status = status;
    await resource.save();

    res.status(200).json({ message: `Resource ${status} successfully`, resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
