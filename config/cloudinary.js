const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "rabbit-ecommerce/products", // Organize uploads in folders
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit" }, // Optimize image size
      { quality: "auto" }, // Auto-optimize quality
      { fetch_format: "auto" }, // Auto-format (WebP when supported)
    ],
  },
});

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images."), false);
    }
  },
});

// Function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

// Function to extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  try {
    // Extract public ID from Cloudinary URL
    // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
    // Public ID: sample
    const urlParts = url.split("/");
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const fileName = fileNameWithExtension.split(".")[0];

    // If it's in a folder structure, include the folder
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex !== -1 && uploadIndex < urlParts.length - 2) {
      const pathParts = urlParts.slice(uploadIndex + 2); // Skip 'upload' and version
      pathParts[pathParts.length - 1] = fileName; // Replace last part with filename without extension
      return pathParts.join("/");
    }

    return fileName;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

module.exports = {
  cloudinary,
  upload,
  deleteImage,
  extractPublicId,
};
