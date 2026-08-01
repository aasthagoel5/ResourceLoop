const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} = require("../controllers/requestController");

//Public routes - anyone can browse it
router.get("/", getAllRequests);
router.get("/:id", getRequestById);

//protected routes - must be logged in to create, update, or delete requests
router.post("/", protect, createRequest);
router.put("/:id", protect, updateRequest);
router.delete("/:id", protect, deleteRequest);

module.exports = router;
