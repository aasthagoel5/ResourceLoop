const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getPendingHospitals,
  verifyHospital,
  getPendingNGOs,
  verifyNGO,
} = require("../controllers/adminController");

// Every route below requires:
// 1. protect       -> user must be logged in (valid JWT)
// 2. authorizeRoles -> user's role must be "admin"
// Both middlewares run in order, left to right, before the actual controller

router.get("/hospitals/pending", protect, authorizeRoles("admin"), getPendingHospitals);
router.put("/hospitals/:id/verify", protect, authorizeRoles("admin"), verifyHospital);

router.get("/ngos/pending", protect, authorizeRoles("admin"), getPendingNGOs);
router.put("/ngos/:id/verify", protect, authorizeRoles("admin"), verifyNGO);

module.exports = router;