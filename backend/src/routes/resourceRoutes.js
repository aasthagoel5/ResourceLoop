const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

// Public routes — no login required to browse resources
router.get("/", getAllResources);
router.get("/:id", getResourceById);

// Protected routes — must be logged in
router.post("/", protect, createResource);
router.put("/:id", protect, updateResource);
router.delete("/:id", protect, deleteResource);

module.exports = router;

