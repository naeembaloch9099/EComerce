const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { handleValidationErrors } = require("../middleware/errorHandler");
const { protect, authorize } = require("../middleware/auth");
const {
  validateUserUpdate,
  validatePagination,
  validateObjectId,
} = require("../middleware/validation");
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  })
);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put(
  "/profile",
  protect,
  validateUserUpdate,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const fieldsToUpdate = {};

    // Only include provided fields
    const allowedFields = ["name", "email", "phone", "address"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    // Handle nested address object
    if (req.body.address) {
      fieldsToUpdate.address = {
        ...req.user.address,
        ...req.body.address,
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  })
);

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
router.delete(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Soft delete - deactivate account instead of removing
    user.isActive = false;
    await user.save({ validateBeforeSave: false });

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], totalItems: 0, totalPrice: 0 }
    );

    res.status(200).json({
      status: "success",
      message: "Account deactivated successfully",
    });
  })
);

// @desc    Get user orders
// @route   GET /api/users/orders
// @access  Private
router.get(
  "/orders",
  protect,
  validatePagination,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { user: req.user.id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Build sort
    let sortBy = { createdAt: -1 }; // Default: newest first
    if (req.query.sort) {
      switch (req.query.sort) {
        case "oldest":
          sortBy = { createdAt: 1 };
          break;
        case "price-high":
          sortBy = { totalPrice: -1 };
          break;
        case "price-low":
          sortBy = { totalPrice: 1 };
          break;
        default:
          sortBy = { createdAt: -1 };
      }
    }

    // Get orders with pagination
    const orders = await Order.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("orderItems.product", "name images slug");

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(totalOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      status: "success",
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          limit,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  })
);

// @desc    Get single order
// @route   GET /api/users/orders/:id
// @access  Private
router.get(
  "/orders/:id",
  protect,
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("orderItems.product", "name images slug");

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  })
);

// @desc    Cancel order
// @route   PUT /api/users/orders/:id/cancel
// @access  Private
router.put(
  "/orders/:id/cancel",
  protect,
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Check if order can be cancelled
    if (!order.canCancel) {
      return res.status(400).json({
        status: "error",
        message: "This order cannot be cancelled",
      });
    }

    // Cancel the order
    order.status = "cancelled";
    order.cancelReason = req.body.reason || "Cancelled by customer";
    await order.save();

    res.status(200).json({
      status: "success",
      message: "Order cancelled successfully",
      data: {
        order,
      },
    });
  })
);

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
router.get(
  "/dashboard",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Get order statistics
    const orderStats = await Order.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
        },
      },
    ]);

    // Get recent orders
    const recentOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("orderItems.product", "name images");

    // Get cart info
    const cart = await Cart.findOne({ user: userId });

    const stats = orderStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
    };

    res.status(200).json({
      status: "success",
      data: {
        stats,
        recentOrders,
        cart: cart
          ? cart.getSummary()
          : { totalItems: 0, finalTotal: 0, isEmpty: true },
      },
    });
  })
);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get(
  "/",
  protect,
  authorize("admin"),
  validatePagination,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    // Build sort
    let sortBy = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case "name":
          sortBy = { name: 1 };
          break;
        case "email":
          sortBy = { email: 1 };
          break;
        case "oldest":
          sortBy = { createdAt: 1 };
          break;
        default:
          sortBy = { createdAt: -1 };
      }
    }

    // Get users with pagination
    const users = await User.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select("-password");

    // Get total count
    const totalUsers = await User.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      status: "success",
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          limit,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  })
);

// @desc    Get single user (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get(
  "/:id",
  protect,
  authorize("admin"),
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Get user's order summary
    const orderStats = await Order.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
    ]);

    const userWithStats = {
      ...user.toObject(),
      orderStats: orderStats[0] || { totalOrders: 0, totalSpent: 0 },
    };

    res.status(200).json({
      status: "success",
      data: {
        user: userWithStats,
      },
    });
  })
);

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const fieldsToUpdate = {};

    // Admin can update these fields
    const allowedFields = [
      "name",
      "email",
      "role",
      "isActive",
      "phone",
      "address",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: {
        user,
      },
    });
  })
);

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Don't allow admin to delete themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        status: "error",
        message: "Cannot delete your own account",
      });
    }

    // Soft delete - deactivate account
    user.isActive = false;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "User deactivated successfully",
    });
  })
);

// @desc    Check if user has purchased a product
// @route   GET /api/users/has-purchased/:productId
// @access  Private
router.get(
  "/has-purchased/:productId",
  protect,
  validateObjectId("productId"),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    // Check if user has any delivered order containing this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      status: "delivered",
      "orderItems.product": productId,
    });

    res.status(200).json({
      status: "success",
      data: {
        hasPurchased: !!hasPurchased,
      },
    });
  })
);

module.exports = router;
