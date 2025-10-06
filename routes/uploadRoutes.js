const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

// Try to use Cloudinary, fallback to local storage
let upload,
  deleteImage,
  extractPublicId,
  isCloudinaryConfigured = false;

try {
  // Check if Cloudinary is properly configured
  const cloudinaryConfig = require("../config/cloudinary");

  // Verify credentials are not placeholder values
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== "democloud" &&
    process.env.CLOUDINARY_API_KEY !== "demo_key" &&
    process.env.CLOUDINARY_API_SECRET !== "demo_secret"
  ) {
    upload = cloudinaryConfig.upload;
    deleteImage = cloudinaryConfig.deleteImage;
    extractPublicId = cloudinaryConfig.extractPublicId;
    isCloudinaryConfigured = true;
    console.log("✅ Using Cloudinary for image storage");
  } else {
    throw new Error("Cloudinary not configured");
  }
} catch (error) {
  console.log("⚠️ Cloudinary not available, using local storage");
  const localConfig = require("../config/localStorage");
  upload = localConfig.localUpload;
  deleteImage = localConfig.deleteLocalImage;
  isCloudinaryConfigured = false;
}

// @desc    Upload single image
// @route   POST /api/upload/single
// @access  Private/Admin
router.post(
  "/single",
  protect,
  authorize("admin"),
  upload.single("image"),
  asyncHandler(async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No image file provided",
        });
      }

      console.log("✅ Image uploaded successfully:", {
        url: isCloudinaryConfigured
          ? req.file.path
          : `/uploads/products/${req.file.filename}`,
        publicId: isCloudinaryConfigured
          ? req.file.filename
          : req.file.filename,
        originalName: req.file.originalname,
        isCloudinary: isCloudinaryConfigured,
      });

      res.status(200).json({
        status: "success",
        message: "Image uploaded successfully",
        data: {
          url: isCloudinaryConfigured
            ? req.file.path
            : `/uploads/products/${req.file.filename}`,
          publicId: isCloudinaryConfigured
            ? req.file.filename
            : req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          isCloudinary: isCloudinaryConfigured,
        },
      });
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      res.status(500).json({
        status: "error",
        message: "Error uploading image",
        error: error.message,
      });
    }
  })
);

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post(
  "/multiple",
  protect,
  authorize("admin"),
  upload.array("images", 10), // Max 10 images
  asyncHandler(async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "No image files provided",
        });
      }

      const uploadedImages = req.files.map((file) => ({
        url: isCloudinaryConfigured
          ? file.path
          : `/uploads/products/${file.filename}`,
        publicId: isCloudinaryConfigured ? file.filename : file.filename,
        originalName: file.originalname,
        size: file.size,
        isCloudinary: isCloudinaryConfigured,
      }));

      console.log(`✅ ${req.files.length} images uploaded successfully`);

      res.status(200).json({
        status: "success",
        message: `${req.files.length} images uploaded successfully`,
        data: {
          images: uploadedImages,
        },
      });
    } catch (error) {
      console.error("❌ Error uploading images:", error);
      res.status(500).json({
        status: "error",
        message: "Error uploading images",
        error: error.message,
      });
    }
  })
);

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
router.delete(
  "/:publicId",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    try {
      const { publicId } = req.params;

      // Replace URL-encoded slashes with actual slashes for nested folders
      const decodedPublicId = decodeURIComponent(publicId);

      const result = await deleteImage(decodedPublicId);

      if (result.result === "ok") {
        console.log("✅ Image deleted successfully:", decodedPublicId);
        res.status(200).json({
          status: "success",
          message: "Image deleted successfully",
          data: { publicId: decodedPublicId },
        });
      } else {
        console.log("⚠️ Image not found or already deleted:", decodedPublicId);
        res.status(404).json({
          status: "error",
          message: "Image not found or already deleted",
        });
      }
    } catch (error) {
      console.error("❌ Error deleting image:", error);
      res.status(500).json({
        status: "error",
        message: "Error deleting image",
        error: error.message,
      });
    }
  })
);

// @desc    Delete image by URL
// @route   DELETE /api/upload/by-url
// @access  Private/Admin
router.delete(
  "/by-url",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({
          status: "error",
          message: "Image URL is required",
        });
      }

      let publicId;

      if (isCloudinaryConfigured && imageUrl.includes("cloudinary.com")) {
        // Cloudinary URL
        publicId = extractPublicId(imageUrl);
        if (!publicId) {
          return res.status(400).json({
            status: "error",
            message: "Invalid Cloudinary URL",
          });
        }
      } else {
        // Local file URL
        const urlParts = imageUrl.split("/");
        publicId = urlParts[urlParts.length - 1]; // Just the filename
      }

      const result = await deleteImage(publicId);

      if (result.result === "ok") {
        console.log("✅ Image deleted successfully by URL:", imageUrl);
        res.status(200).json({
          status: "success",
          message: "Image deleted successfully",
          data: { publicId, url: imageUrl },
        });
      } else {
        console.log("⚠️ Image not found or already deleted:", imageUrl);
        res.status(404).json({
          status: "error",
          message: "Image not found or already deleted",
        });
      }
    } catch (error) {
      console.error("❌ Error deleting image by URL:", error);
      res.status(500).json({
        status: "error",
        message: "Error deleting image",
        error: error.message,
      });
    }
  })
);

module.exports = router;
