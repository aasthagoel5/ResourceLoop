const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Storage config for resource photos (equipment, etc.)
const resourceImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resourceloop/resources",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], // keeps file sizes reasonable
  },
});

// Storage config for hospital/NGO verification documents (can be images or PDFs)
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resourceloop/documents",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto", // lets Cloudinary handle both images and PDFs correctly
  },
});

// Up to 5 photos per resource listing
const uploadResourceImages = multer({ storage: resourceImageStorage });

// One verification document per hospital/NGO signup
const uploadDocument = multer({ storage: documentStorage });

module.exports = { uploadResourceImages, uploadDocument };