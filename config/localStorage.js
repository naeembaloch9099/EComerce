const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Local storage configuration as fallback
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/products");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const localUpload = multer({
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

// Function to delete local image
const deleteLocalImage = async (filename) => {
  try {
    const filePath = path.join(__dirname, "../uploads/products", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { result: "ok" };
    }
    return { result: "not found" };
  } catch (error) {
    console.error("Error deleting local image:", error);
    throw error;
  }
};

module.exports = {
  localUpload,
  deleteLocalImage,
};
