const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createDonation,
  getMyDonations,
  acceptDonation,
  completeDonation,
  cancelDonation,
} = require("../controllers/donationController");

//All the donation routes require login -  donations are personal transactions not public browsing
router.post("/",protect, createDonation);
router.get("/",protect, getMyDonations);

router.put("/:id/complete",protect, completeDonation);
router.put("/:id/cancel",protect, cancelDonation);

router.put("/:id/accept", protect, acceptDonation);

module.exports = router;
