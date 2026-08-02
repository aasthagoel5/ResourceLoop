const Resource = require("../models/Resources");
const Request = require("../models/Request");
const Resources = require("../models/Resources");

// @route  GET /api/search/resources
// @desc   Find available resources near a given location, optionally filtered
exports.searchNearbyResources = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance, category, bloodGroup } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // maxDistance is in meters; default to 10km if not specified
    const distance = maxDistance ? Number(maxDistance)*1000 : 10000;

    const filter = {
      status: "available",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: distance,
        },
      },
    };

    if (category) filter.category = category;
    if (bloodGroup) filter.bloodGroup = bloodGroup;

    const resources = await Resources.find(filter)
    .populate("donorId", "name")
    .limit(50);

    res.status(200).json({ count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/search/requests
// @desc   Find open requests near a given location (useful for donors browsing "who needs help nearby")
exports.searchNearbyRequests = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance, resourceType, urgency } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "latitude and longitude are required" });
    }

    const distanceInMeters = maxDistance ? Number(maxDistance) * 1000 : 10000;

    const filter = {
      status: "open",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: distanceInMeters,
        },
      },
    };

    if (resourceType) filter.resourceType = resourceType;
    if (urgency) filter.urgency = urgency;

    const requests = await Request.find(filter)
      .populate("requesterId", "name")
      .limit(50);

    res.status(200).json({ count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/search/match/:requestId
// @desc   Given a specific request, find the best-matching available resources nearby
//         (this is the "possible donors" feature from your PPT)
exports.findMatchesForRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const filter = {
      status: "available",
      category: request.resourceType, // match the same resource type
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: request.location.coordinates, // use the REQUEST's location as the center point
          },
          $maxDistance: 20000, // 20km radius for matching
        },
      },
    };

    // Extra precision for blood requests — must match blood group too
    if (request.resourceType === "blood" && request.bloodGroup) {
      filter.bloodGroup = request.bloodGroup;
    }

    const matches = await Resource.find(filter)
      .populate("donorId", "name phone")
      .limit(20);

    res.status(200).json({
      request: { title: request.title, resourceType: request.resourceType, urgency: request.urgency },
      matchCount: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

