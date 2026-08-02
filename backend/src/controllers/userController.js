const User = require("../models/User");
const Resource = require("../models/Resources"); 
const Request = require("../models/Request");
const Donation = require("../models/Donation");

// @route  GET /api/users/me
// @desc   Get the logged-in user's own profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -refreshToken -verificationToken -resetPasswordToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/users/me
// @desc   Update the logged-in user's own profile
exports.updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedUpdates = ["name", "phone", "location", "profileImage"];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    // Re-fetch without sensitive fields before sending back the response
    const safeUser = await User.findById(user._id).select(
      "-password -refreshToken -verificationToken -resetPasswordToken"
    );

    res.status(200).json({ message: "Profile updated successfully", user: safeUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/users/me/donations
// @desc   Get the logged-in user's donation history (as donor)
exports.getMyDonationHistory = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.userId })
      .populate("resourceId", "title category")
      .populate("receiverId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/users/me/requests
// @desc   Get the logged-in user's request history
exports.getMyRequestHistory = async (req, res) => {
  try {
    const requests = await Request.find({ requesterId: req.user.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/users/me/saved-resources/:resourceId
// @desc   Save a resource to the user's wishlist
exports.saveResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const user = await User.findById(req.user.userId);

    // Avoid saving the same resource twice
    if (user.savedResources.includes(resourceId)) {
      return res.status(400).json({ message: "Resource already saved" });
    }

    user.savedResources.push(resourceId);
    await user.save();

    res.status(200).json({ message: "Resource saved to wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/users/me/saved-resources/:resourceId
// @desc   Remove a resource from the user's wishlist
exports.unsaveResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const user = await User.findById(req.user.userId);

    user.savedResources = user.savedResources.filter(
      (id) => id.toString() !== resourceId
    );
    await user.save();

    res.status(200).json({ message: "Resource removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/users/me/saved-resources
// @desc   Get the user's full wishlist with resource details
exports.getSavedResources = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("savedResources");

    res.status(200).json({ count: user.savedResources.length, savedResources: user.savedResources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};