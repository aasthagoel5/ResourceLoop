const Resource = require("../models/Resources");
const Hospital = require("../models/Hospital");
const NGO = require("../models/NGO");

// @route  POST /api/resources
// @desc   Create a new resource listing
exports.createResource = async (req, res) => {
  try{
    const{
      title,
      description,
      category,
      listingType,
      securityDeposit,
      price,
      quantity,
      bloodGroup,
      condition,
      expiryDate,
      latitude,
      longitude,
      address,
    }=req.body;

    //Basic Validation
    if (!title || !category || !listingType || !quantity || !latitude || !longitude ){
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // Business rule: medicines can only be listed by VERIFIED hospitals or NGOs
    // (never by individuals, per your earlier product decision on safety/legal concerns)
    if (category === "medicine") {
      const userRole = req.user.role;

      if (userRole !== "hospital" && userRole !== "ngo") {
        return res.status(403).json({
          message: "Only verified hospitals or NGOs can list medicines",
        });
      }     
  
  // Check that this specific hospital/NGO is actually verified,
      // not just that their role says "hospital"/"ngo"
      let profile;
      if (userRole === "hospital") {
        profile = await Hospital.findOne({ userId: req.user.userId });
      } else {
        profile = await NGO.findOne({ userId: req.user.userId });
      }

      if (!profile || profile.verificationStatus !== "verified") {
        return res.status(403).json({
          message: "Your account must be verified by an admin before listing medicines",
        });
      }
    }
      // Business rule: sell listings need a price, lend listings need a deposit
    if (listingType === "sell" && (!price || price <= 0)) {
      return res.status(400).json({ message: "A valid price is required for sell listings" });
    }
    if (listingType === "lend" && (securityDeposit === undefined || securityDeposit < 0)) {
      return res.status(400).json({ message: "A valid security deposit is required for lend listings" });
    }
    

    const resource = await Resource.create({
      donorId: req.user.userId, // comes from the JWT via "protect" middleware
      title,
      description,
      category,
      listingType,
      securityDeposit: listingType === "lend" ? securityDeposit : 0,
      price: listingType === "sell" ? price : 0,
      quantity: quantity || 1,
      bloodGroup,
      condition,
      expiryDate,
      location:{
        type: "Point",
        coordinates: ["latitude", "longitude"],
        address,
      }
    });

    res.status(201).json({ message: "Resource listed successfully", resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

    
// @route  GET /api/resources
// @desc   Get all available resources (public — no login required)
exports.getAllResources = async (req, res) => {
  try {
    // Optional filters via query params, e.g. /api/resources?category=blood&location=Jaipur
    const { category, listingType, status } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (listingType) filter.listingType = listingType;
    filter.status = status || "available"; // default to only showing available resources

    const resources = await Resource.find(filter)
    .populate("donorId", "name location") // include donor's name and role in the response
    .sort({ createdAt: -1 }); // newest first

    res.status(200).json({count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/resources/:id
// @desc   Get a single resource by ID (public)
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("donorId", "name location phone");

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({ resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route  PUT /api/resources/:id
// @desc   Update a resource (only the owner can edit)
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Ownership check — only the person who created this listing can edit it
    if (resource.donorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to edit this resource" });
    }

    // Only allow updating specific fields (avoid letting someone sneak in donorId changes, etc.)
    const allowedUpdates = [
      "title", "description", "quantity", "condition",
      "expiryDate", "location", "status", "price", "securityDeposit",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        resource[field] = req.body[field];
      }
    });

    await resource.save();

    res.status(200).json({ message: "Resource updated successfully", resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @route  DELETE /api/resources/:id
// @desc   Delete a resource (only the owner can delete)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Ownership check — same pattern as update
    if (resource.donorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to delete this resource" });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

