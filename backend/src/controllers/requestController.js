const Request = require("../models/Request");

// @route  POST /api/requests
//@desc   create a new resiurce request
exports.createRequest = async (req, res) => {
  try {
    const { resourceType,
       title,
       description,
       quantity,
       bloodGroup,
       equipmentType,
       medicineName,
       urgency,
       location,
       } = req.body;

    // Validate required fields
    if (!resourceType || !title || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const request = await Request.create({
      requesterId: req.user.userId, //from JWT via "protect" middleware
      resourceType,
      title,
      description,
      quantity: quantity || 1,
      bloodGroup, 
      equipmentType,
      medicineName,
      urgency: urgency || "medium",
      location,
    });

    res.status(201).json({ message: "Request created successfully", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/requests
// @desc   Get all open requests (public — donors/hospitals/NGOs can browse these)
exports.getAllRequests = async (req, res) => {
  try {
    const { resourceType, location, urgency } = req.query;

    const filter = {}; 
    if (resourceType) filter.resourceType = resourceType;
    if (location) filter.location = location;
    if (urgency) filter.urgency = urgency;
    filter.status = "open"; // Only show open requests

    const requests = await Request.find(filter)
      .populate("requesterId", "name location") // include requester's name and location
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ count: requests.length, requests });
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/requests/:id
// @desc   Get a single request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("requesterId", "name location phone");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/requests/:id
// @desc   Update a request (only the requester can edit)
exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.requesterId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to edit this request" });
    }

    const allowedUpdates = [
      "title", "description", "quantity", "urgency",
      "location", "status", "bloodGroup", "equipmentType", "medicineName",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        request[field] = req.body[field];
      }
    });

    await request.save();

    res.status(200).json({ message: "Request updated successfully", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/requests/:id
// @desc   Delete/cancel a request (only the requester can delete)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.requesterId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to delete this request" });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

