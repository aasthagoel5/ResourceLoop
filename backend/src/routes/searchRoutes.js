const express = require('express');
const router = express.Router();

const{
  searchNearbyResources,
  searchNearbyRequests,
  findMatchesForRequest,
} = require ("../controllers/searchController");

// @route  GET /api/search/resources
// @desc   Find available resources near a given location, optionally filtered
router.get("/resources", searchNearbyResources);
router.get("/requests", searchNearbyRequests);
router.get("/match/:requestId", findMatchesForRequest);

module.exports = router;