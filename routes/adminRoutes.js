const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { handleValidationErrors } = require("../middleware/errorHandler");
const { protect, authorize } = require("../middleware/auth");
const {
  validatePagination,
  validateObjectId,
} = require("../middleware/validation");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { sendStatusChangeEmail } = require("../services/emailService");

const router = express.Router();

// Apply admin authentication to all routes
router.use(protect);
router.use(authorize("admin"));

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    const { period = "30" } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get overall statistics
    const [userStats, productStats, orderStats] = await Promise.all([
      // User statistics
      User.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            active: [{ $match: { isActive: true } }, { $count: "count" }],
            newUsers: [
              { $match: { createdAt: { $gte: startDate } } },
              { $count: "count" },
            ],
            verified: [
              { $match: { isEmailVerified: true } },
              { $count: "count" },
            ],
          },
        },
      ]),

      // Product statistics
      Product.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            active: [{ $match: { isActive: true } }, { $count: "count" }],
            outOfStock: [{ $match: { totalStock: 0 } }, { $count: "count" }],
            lowStock: [
              { $match: { totalStock: { $lte: 10, $gt: 0 } } },
              { $count: "count" },
            ],
          },
        },
      ]),

      // Order statistics
      Order.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            totalRevenue: [
              {
                $match: {
                  status: { $in: ["confirmed", "shipped", "delivered"] },
                },
              },
              { $group: { _id: null, total: { $sum: "$totalPrice" } } },
            ],
            periodOrders: [
              { $match: { createdAt: { $gte: startDate } } },
              { $count: "count" },
            ],
            periodRevenue: [
              {
                $match: {
                  createdAt: { $gte: startDate },
                  status: { $in: ["confirmed", "shipped", "delivered"] },
                },
              },
              { $group: { _id: null, total: { $sum: "$totalPrice" } } },
            ],
            pending: [{ $match: { status: "pending" } }, { $count: "count" }],
            confirmed: [
              { $match: { status: "confirmed" } },
              { $count: "count" },
            ],
            processing: [
              { $match: { status: "processing" } },
              { $count: "count" },
            ],
            shipped: [{ $match: { status: "shipped" } }, { $count: "count" }],
            delivered: [
              { $match: { status: "delivered" } },
              { $count: "count" },
            ],
            cancelled: [
              { $match: { status: "cancelled" } },
              { $count: "count" },
            ],
          },
        },
      ]),
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .select("orderNumber totalPrice status createdAt user");

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
          productName: { $first: "$orderItems.name" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Daily revenue for chart (last 7 days) - only confirmed, shipped, and delivered orders
    const chartStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: chartStartDate },
          status: { $in: ["confirmed", "shipped", "delivered"] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        users: {
          total: userStats[0].total[0]?.count || 0,
          active: userStats[0].active[0]?.count || 0,
          newUsers: userStats[0].newUsers[0]?.count || 0,
          verified: userStats[0].verified[0]?.count || 0,
        },
        products: {
          total: productStats[0].total[0]?.count || 0,
          active: productStats[0].active[0]?.count || 0,
          outOfStock: productStats[0].outOfStock[0]?.count || 0,
          lowStock: productStats[0].lowStock[0]?.count || 0,
        },
        orders: {
          total: orderStats[0].total[0]?.count || 0,
          totalRevenue: orderStats[0].totalRevenue[0]?.total || 0,
          periodOrders: orderStats[0].periodOrders[0]?.count || 0,
          periodRevenue: orderStats[0].periodRevenue[0]?.total || 0,
          pending: orderStats[0].pending[0]?.count || 0,
          confirmed: orderStats[0].confirmed[0]?.count || 0,
          processing: orderStats[0].processing[0]?.count || 0,
          shipped: orderStats[0].shipped[0]?.count || 0,
          delivered: orderStats[0].delivered[0]?.count || 0,
          cancelled: orderStats[0].cancelled[0]?.count || 0,
        },
        recentOrders,
        topProducts,
        dailyRevenue,
      },
    });
  })
);

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin
router.get(
  "/users",
  validatePagination,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    console.log("🔄 AdminRoutes: GET /api/admin/users called");
    console.log("👤 User:", {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    });
    console.log("📊 Query params:", req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log("📄 Pagination:", { page, limit, skip });

    // Build filter
    let filter = {};

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.role && req.query.role !== "all") {
      filter.role = req.query.role;
    }

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    if (req.query.isEmailVerified !== undefined) {
      filter.isEmailVerified = req.query.isEmailVerified === "true";
    }

    console.log("🔍 Filter applied:", filter);

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
        case "lastLogin":
          sortBy = { lastLogin: -1 };
          break;
      }
    }

    console.log("📋 Sort order:", sortBy);

    const users = await User.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select("-password");

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    console.log("✅ Users fetched:", {
      count: users.length,
      totalUsers,
      totalPages,
      currentPage: page,
    });
    console.log(
      "📋 Sample user:",
      users[0]
        ? {
            id: users[0]._id,
            name: users[0].name,
            email: users[0].email,
            role: users[0].role,
            isActive: users[0].isActive,
          }
        : "No users found"
    );

    res.status(200).json({
      status: "success",
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  })
);

// @desc    Get user details with order history
// @route   GET /api/admin/users/:id
// @access  Private/Admin
router.get(
  "/users/:id",
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

    // Get user's order statistics
    const orderStats = await Order.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
          averageOrderValue: { $avg: "$totalPrice" },
        },
      },
    ]);

    // Get recent orders
    const recentOrders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("orderNumber totalPrice status createdAt");

    res.status(200).json({
      status: "success",
      data: {
        user: {
          ...user.toObject(),
          orderStats: orderStats[0] || {
            totalOrders: 0,
            totalSpent: 0,
            averageOrderValue: 0,
          },
        },
        recentOrders,
      },
    });
  })
);

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put(
  "/users/:id",
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const allowedFields = [
      "name",
      "email",
      "role",
      "isActive",
      "phone",
      "address",
    ];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
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
      data: { user },
    });
  })
);

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
router.get(
  "/products",
  validatePagination,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let filter = {};

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { sku: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.category && req.query.category !== "all") {
      filter.category = req.query.category;
    }

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    if (req.query.stockStatus) {
      switch (req.query.stockStatus) {
        case "inStock":
          filter.totalStock = { $gt: 10 };
          break;
        case "lowStock":
          filter.totalStock = { $lte: 10, $gt: 0 };
          break;
        case "outOfStock":
          filter.totalStock = 0;
          break;
      }
    }

    let sortBy = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case "name":
          sortBy = { name: 1 };
          break;
        case "price":
          sortBy = { price: 1 };
          break;
        case "stock":
          sortBy = { totalStock: 1 };
          break;
        case "oldest":
          sortBy = { createdAt: 1 };
          break;
      }
    }

    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select("-reviews");

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      status: "success",
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  })
);

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get(
  "/orders",
  validatePagination,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    // First, let's check total orders in database
    const totalOrdersInDB = await Order.countDocuments({});
    console.log("📊 Total orders in database:", totalOrdersInDB);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log("📊 Query params:", { page, limit, skip });
    console.log("👤 Admin user:", req.user?.email, "Role:", req.user?.role);

    let filter = {};

    console.log("🔍 Admin orders endpoint called with initial filter:", filter);

    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: "i" } },
        {
          "shippingAddress.email": { $regex: req.query.search, $options: "i" },
        },
      ];
    }

    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    if (req.query.isPaid !== undefined) {
      filter.isPaid = req.query.isPaid === "true";
    }

    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    let sortBy = { createdAt: -1 };
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
        case "order-number":
          sortBy = { orderNumber: 1 };
          break;
      }
    }

    console.log("🔍 Final filter and sort before database query:", {
      filter,
      sortBy,
    });

    console.log("🔍 Admin orders endpoint called with filter:", filter);
    console.log("📊 Query params:", { page, limit, skip });

    const orders = await Order.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .populate("orderItems.product", "name images");

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    // Transform orders to include customer name from shippingAddress
    const transformedOrders = orders.map((order) => ({
      ...order.toObject(),
      customerName:
        `${order.shippingAddress?.firstName || ""} ${
          order.shippingAddress?.lastName || ""
        }`.trim() ||
        order.user?.name ||
        "Unknown Customer",
      customerEmail:
        order.shippingAddress?.email || order.user?.email || "No email",
    }));

    console.log("📋 Found orders:", {
      totalOrders,
      returnedOrders: orders.length,
      orderIds: orders.map((o) => ({
        id: o._id,
        orderKey: o.orderKey,
        customerName: `${o.shippingAddress?.firstName || ""} ${
          o.shippingAddress?.lastName || ""
        }`.trim(),
        user: o.user?.email,
        itemsCount: o.orderItems?.length || 0,
        itemsSample: o.orderItems?.slice(0, 2) || [],
      })),
    });

    res.status(200).json({
      status: "success",
      data: {
        orders: transformedOrders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  })
);

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
router.put(
  "/orders/:id/status",
  asyncHandler(async (req, res) => {
    const { status, notes, trackingNumber, shippingCarrier } = req.body;

    console.log("🔄 Updating order status:", {
      orderId: req.params.id,
      newStatus: status,
      notes,
      trackingNumber,
      shippingCarrier,
    });

    // Validate status
    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findOne({
      $or: [
        { _id: req.params.id },
        { orderKey: req.params.id },
        { orderNumber: req.params.id },
      ],
    });

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    const oldStatus = order.status;

    // Update order fields
    order.status = status;

    // Update additional fields if provided
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (shippingCarrier) order.shippingCarrier = shippingCarrier;

    // Add status change log
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: status,
      timestamp: new Date(),
      notes: notes || "",
      updatedBy: req.user._id,
    });

    // Set timestamps based on status
    switch (status) {
      case "confirmed":
        order.confirmedAt = new Date();
        break;
      case "shipped":
        order.shippedAt = new Date();
        if (!order.estimatedDelivery) {
          order.estimatedDelivery = new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          );
        }
        break;
      case "delivered":
        order.deliveredAt = new Date();
        order.isDelivered = true;
        break;
      case "cancelled":
        order.cancelledAt = new Date();
        break;
    }

    await order.save();

    console.log("✅ Order status updated:", {
      orderId: order._id,
      oldStatus,
      newStatus: status,
      timestamp: new Date(),
    });

    res.status(200).json({
      status: "success",
      message: `Order status updated from ${oldStatus} to ${status}`,
      data: { order },
    });
  })
);

// @desc    Send status change email notification
// @route   POST /api/admin/orders/:id/send-status-email
// @access  Private/Admin
router.post(
  "/orders/:id/send-status-email",
  asyncHandler(async (req, res) => {
    const {
      customerEmail,
      customerName,
      oldStatus,
      newStatus,
      orderTotal,
      orderNumber,
    } = req.body;

    console.log("📧 Sending status change email:", {
      orderId: req.params.id,
      customerEmail,
      newStatus,
      orderNumber,
    });

    try {
      // Use the new email service
      const emailResult = await sendStatusChangeEmail({
        customerEmail,
        customerName,
        oldStatus,
        newStatus,
        orderTotal,
        orderNumber,
      });

      if (emailResult.success) {
        console.log("✅ Status change email sent successfully");
        res.status(200).json({
          status: "success",
          message: `Status change email sent to ${customerEmail}`,
          data: {
            emailSent: true,
            status: newStatus,
          },
        });
      } else {
        console.error(
          "❌ Failed to send status change email:",
          emailResult.error
        );
        res.status(500).json({
          status: "error",
          message: "Failed to send status change email",
          error: emailResult.error,
        });
      }
    } catch (error) {
      console.error("❌ Error sending status change email:", error);
      res.status(500).json({
        status: "error",
        message: "Error sending status change email",
        error: error.message,
      });
    }
  })
);

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
router.get(
  "/analytics/sales",
  asyncHandler(async (req, res) => {
    const { period = "30" } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Sales overview
    const salesOverview = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          averageOrderValue: { $avg: "$totalPrice" },
          totalItems: { $sum: { $sum: "$orderItems.quantity" } },
        },
      },
    ]);

    // Daily sales
    const dailySales = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Category performance
    const categoryPerformance = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          totalSold: { $sum: "$orderItems.quantity" },
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // Payment method distribution
    const paymentMethods = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        overview: salesOverview[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          totalItems: 0,
        },
        dailySales,
        categoryPerformance,
        paymentMethods,
      },
    });
  })
);

// @desc    Get inventory analytics
// @route   GET /api/admin/analytics/inventory
// @access  Private/Admin
router.get(
  "/analytics/inventory",
  asyncHandler(async (req, res) => {
    // Stock levels
    const stockLevels = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          inStock: { $sum: { $cond: [{ $gt: ["$totalStock", 10] }, 1, 0] } },
          lowStock: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ["$totalStock", 10] },
                    { $gt: ["$totalStock", 0] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          outOfStock: { $sum: { $cond: [{ $eq: ["$totalStock", 0] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] } },
        },
      },
    ]);

    // Top selling products
    const topSellingProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          totalSold: { $sum: "$orderItems.quantity" },
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
          productName: { $first: "$orderItems.name" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    // Low stock alerts
    const lowStockProducts = await Product.find({
      totalStock: { $lte: 10, $gt: 0 },
      isActive: true,
    })
      .select("name sku totalStock category")
      .sort({ totalStock: 1 })
      .limit(20);

    // Out of stock products
    const outOfStockProducts = await Product.find({
      totalStock: 0,
      isActive: true,
    })
      .select("name sku category")
      .limit(20);

    res.status(200).json({
      status: "success",
      data: {
        stockLevels: stockLevels[0] || {
          totalProducts: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
          inactive: 0,
        },
        topSellingProducts,
        lowStockProducts,
        outOfStockProducts,
      },
    });
  })
);

// @desc    Cleanup abandoned carts
// @route   DELETE /api/admin/cleanup/carts
// @access  Private/Admin
router.delete(
  "/cleanup/carts",
  asyncHandler(async (req, res) => {
    const deletedCount = await Cart.cleanupAbandonedCarts();

    res.status(200).json({
      status: "success",
      message: `Cleaned up ${deletedCount} abandoned carts`,
      data: { deletedCount },
    });
  })
);

module.exports = router;
