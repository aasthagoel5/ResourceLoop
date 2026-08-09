const Donation = require("../models/Donation");
const Request = require("../models/Request");
const Resource = require("../models/Resources");
const notify = require("../utils/notify");

// @route  POST /api/donations
// @desc   Create a new donation record
exports.createDonation = async (req, res) => {
  try {
    const { requestId, resourceId, receiverId } = req.body;

    if ( !resourceId || !receiverId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //Fine the resource being donated
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    //Only the resource's owner can create a donation for it
    if (resource.donorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to donate this resource" });
    }

    //Resources must currenlty be available to be donated
    if (resource.status !== "available") {
      return res.status(400).json({ message: `This resource is currently "${resource.status}", not available.` });
    }

    //If this donation is fullfillng a specific request, validate it too
    let request ;
    if (requestId) {
      request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      if (request.status !== "open") {
        return res.status(400).json({ message: `This request is currently "${request.status}", not open .` });
      }
    }

    //Create the donation record
    const donation = await Donation.create({
      donorId: req.user.userId,
      resourceId,
      receiverId,
      requestId: requestId || undefined,
      status: "pending",
    });

    // Lock the resource so it can't be claimed by someone else simultaneously
    resource.status = "reserved";
    await resource.save();

    // If linked to a request, mark that as matched too
    if (request) {
      request.status = "matched";
      await request.save();
    }

    await notify({
      userId: receiverId,
      message: `${req.user.name || "A donor"} wants to donate "${resource.title}" to you.`,
      type: "donation",
      relatedId: donation._id,
      emailSubject: "You have a new donation offer on ResourceLoop",
    });

    res.status(201).json({ message: "Donation created successfully", donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/donations
// @desc   Get all donations involving the logged-in user (as donor or receiver)
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      $or: [{ donorId: req.user.userId }, { receiverId: req.user.userId }],
    })
      .populate("resourceId", "title category")
      .populate("donorId", "name")
      .populate("receiverId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/donations/:id/complete
// @desc   Mark a donation as completed (only the donor can confirm this)
exports.completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.donorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Only the donor can mark this donation as completed" });
    }

    if (donation.status !== "pending") {
      return res.status(400).json({ message: `Donation is already '${donation.status}'` });
    }

    donation.status = "completed";
    await donation.save();

    // Update the linked Resource
    const resource = await Resource.findById(donation.resourceId);
    if (resource) {
      resource.status = "completed";
      await resource.save();
    }

    // Update the linked Request, if any
    if (donation.requestId) {
      const request = await Request.findById(donation.requestId);
      if (request) {
        request.status = "fulfilled";
        await request.save();
      }
    }

    await notify({
      userId: donation.receiverId,
      message: `Your donation "${resource?.title || "item"}" has been marked as completed.`,
      type: "donation",
      relatedId: donation._id,
      emailSubject: "Your ResourceLoop donation is complete",
    });

    res.status(200).json({ message: "Donation marked as completed", donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/donations/:id/cancel
// @desc   Cancel a pending donation (either party can cancel)
exports.cancelDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    const userId = req.user.userId;
    if (donation.donorId.toString() !== userId && donation.receiverId.toString() !== userId) {
      return res.status(403).json({ message: "You are not part of this donation" });
    }

    if (donation.status !== "pending") {
      return res.status(400).json({ message: `Cannot cancel a donation that is already '${donation.status}'` });
    }

    donation.status = "cancelled";
    await donation.save();

    // Release the resource back to available
    const resource = await Resource.findById(donation.resourceId);
    if (resource) {
      resource.status = "available";
      await resource.save();
    }

    // Reopen the linked request, if any
    if (donation.requestId) {
      const request = await Request.findById(donation.requestId);
      if (request) {
        request.status = "open";
        await request.save();
      }
    }

    res.status(200).json({ message: "Donation cancelled", donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

