const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getMyProfile,
  updateMyProfile,
  getMyDonationHistory,
  getMyRequestHistory,
  saveResource,
  unsaveResource,
  getSavedResources,
} = require("../controllers/userController");

// All routes here are about "my own" data — always require login
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

router.get("/me/donations", protect, getMyDonationHistory);
router.get("/me/requests", protect, getMyRequestHistory);

router.get("/me/saved-resources", protect, getSavedResources);
router.post("/me/saved-resources/:resourceId", protect, saveResource);
router.delete("/me/saved-resources/:resourceId", protect, unsaveResource);

module.exports = router;