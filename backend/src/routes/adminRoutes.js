const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getPendingHospitals,
  verifyHospital,
  getPendingNGOs,
  verifyNGO,
  getPendingResources,
  verifyResource,
  getAllUsers,
  deleteUser,
  getReports,
  resolveReport,
  getRecentActivity,
} = require("../controllers/adminController");

// Every route below requires:
// 1. protect       -> user must be logged in (valid JWT)
// 2. authorizeRoles -> user's role must be "admin"
// Both middlewares run in order, left to right, before the actual controller

router.get("/hospitals/pending", protect, authorizeRoles("admin"), getPendingHospitals);
router.put("/hospitals/:id/verify", protect, authorizeRoles("admin"), verifyHospital);

router.get("/ngos/pending", protect, authorizeRoles("admin"), getPendingNGOs);
router.put("/ngos/:id/verify", protect, authorizeRoles("admin"), verifyNGO);

router.get("/resources/pending", protect, authorizeRoles("admin"), getPendingResources);
router.put("/resources/:id/verify", protect, authorizeRoles("admin"), verifyResource);

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);
router.get("/reports", protect, authorizeRoles("admin"), getReports);
router.put("/reports/:id", protect, authorizeRoles("admin"), resolveReport);
router.get("/activity", protect, authorizeRoles("admin"), getRecentActivity);

module.exports = router;