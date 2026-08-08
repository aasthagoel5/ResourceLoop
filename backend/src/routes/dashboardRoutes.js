const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getIndividualDashboard,
  getHospitalDashboard,
  getNGODashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");

router.get("/individual", protect, authorizeRoles("individual"), getIndividualDashboard);
router.get("/hospital", protect, authorizeRoles("hospital"), getHospitalDashboard);
router.get("/ngo", protect, authorizeRoles("ngo"), getNGODashboard);
router.get("/admin", protect, authorizeRoles("admin"), getAdminDashboard);

module.exports = router;

