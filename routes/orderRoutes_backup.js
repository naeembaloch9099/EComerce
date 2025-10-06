const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { handleValidationErrors } = require("../middleware/errorHandler");
const { protect, authorize } = require("../middleware/auth");
const {
  validateOrder,
  validatePagination,
  validateObjectId,
} = require("../middleware/validation");
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getOrders,
  updateOrderStatus,
  markOrderAsPaid,
  getOrderStats,
} = require("../controllers/orderController");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { sendOrderConfirmationEmail } = require("../utils/emailService");

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post("/", protect, createOrder);

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get(
      paymentMethod,
      taxPrice = 0,
      shippingPrice = 0,
      discount = { amount: 0, code: "", type: "fixed" },
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No order items provided",
      });
    }

    // Validate and process order items
    const processedItems = [];
    let subtotal = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          status: "error",
          message: `Product not found: ${item.product}`,
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          status: "error",
          message: `Product is no longer available: ${product.name}`,
        });
      }

      // Check stock availability
      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          status: "error",
          message: `Insufficient stock for ${product.name}. Available: ${product.totalStock}, Requested: ${item.quantity}`,
        });
      }

      // Check size/color specific stock if provided
      if (item.size) {
        const sizeItem = product.sizes.find((s) => s.size === item.size);
        if (!sizeItem || sizeItem.stock < item.quantity) {
          return res.status(400).json({
            status: "error",
            message: `Insufficient stock for ${product.name} in size ${item.size}`,
          });
        }
      }

      if (item.color) {
        const colorItem = product.colors.find((c) => c.name === item.color);
        if (!colorItem || colorItem.stock < item.quantity) {
          return res.status(400).json({
            status: "error",
            message: `Insufficient stock for ${product.name} in color ${item.color}`,
          });
        }
      }

      const orderItem = {
        product: product._id,
        name: product.name,
        price: product.discountedPrice || product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.primaryImage?.url || product.images[0]?.url || "",
        sku: product.sku,
      };

      processedItems.push(orderItem);
      subtotal += orderItem.price * orderItem.quantity;
    }

    // Calculate total price
    const totalPrice = subtotal + taxPrice + shippingPrice - discount.amount;

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems: processedItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      subtotal,
      totalPrice,
      discount,
    });

    // Calculate shipping if not provided
    if (shippingPrice === 0) {
      order.calculateShipping();
    }

    const savedOrder = await order.save();

    // Update product stock
    for (let i = 0; i < processedItems.length; i++) {
      const orderItem = processedItems[i];
      const product = await Product.findById(orderItem.product);

      if (product) {
        product.updateStock(
          orderItem.size,
          orderItem.color,
          orderItem.quantity
        );
        await product.save();
      }
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        couponCode: undefined,
        discount: { amount: 0, percentage: 0 },
      }
    );

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(
        shippingAddress.email,
        shippingAddress.firstName,
        savedOrder
      );
    } catch (error) {
router.post("/", protect, createOrder);

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
router.get(
  "/my-orders",
  protect,
  validatePagination,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("orderItems.product", "name images slug");

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      status: "success",
      data: {
        orders,
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get(
  "/:id",
  protect,
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name images slug");

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Check if user owns the order or is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to view this order",
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

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put(
  "/:id/pay",
  protect,
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this order",
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        status: "error",
        message: "Order is already paid",
      });
    }

    const paymentResult = {
      id: req.body.id || "",
      status: req.body.status || "completed",
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.email_address || order.shippingAddress.email,
      method: order.paymentMethod,
      transaction_id: req.body.transaction_id || req.body.id,
    };

    await order.markAsPaid(paymentResult);

    res.status(200).json({
      status: "success",
      message: "Order marked as paid",
      data: {
        order,
      },
    });
  })
);

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put(
  "/:id/cancel",
  protect,
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to cancel this order",
      });
    }

    if (!order.canCancel) {
      return res.status(400).json({
        status: "error",
        message: "This order cannot be cancelled",
      });
    }

    // Restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        // Add back the stock
        if (item.size) {
          const sizeItem = product.sizes.find((s) => s.size === item.size);
          if (sizeItem) {
            sizeItem.stock += item.quantity;
          }
        }

        if (item.color) {
          const colorItem = product.colors.find((c) => c.name === item.color);
          if (colorItem) {
            colorItem.stock += item.quantity;
          }
        }

        product.totalStock += item.quantity;
        product.soldCount = Math.max(0, product.soldCount - item.quantity);
        await product.save();
      }
    }

    await order.updateStatus(
      "cancelled",
      req.body.reason || "Cancelled by customer"
    );

    res.status(200).json({
      status: "success",
      message: "Order cancelled successfully",
      data: {
        order,
      },
    });
  })
);

// Admin routes

// @desc    Get all orders
// @route   GET /api/orders
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

    let filter = {};

    // Search by order number or user email
    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: "i" } },
        {
          "shippingAddress.email": { $regex: req.query.search, $options: "i" },
        },
      ];
    }

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by payment status
    if (req.query.isPaid !== undefined) {
      filter.isPaid = req.query.isPaid === "true";
    }

    // Filter by date range
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

    const orders = await Order.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .populate("orderItems.product", "name images");

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    // Get order statistics
    const stats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          averageOrderValue: { $avg: "$totalPrice" },
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] },
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "shipped"] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        stats: stats[0] || {
          totalRevenue: 0,
          averageOrderValue: 0,
          totalOrders: 0,
          pendingOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
        },
      },
    });
  })
);

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { status, notes, trackingNumber, shippingCarrier } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Update tracking information if provided
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (shippingCarrier) {
      order.shippingCarrier = shippingCarrier;
    }

    // Set estimated delivery date for shipped orders
    if (status === "shipped" && !order.estimatedDelivery) {
      order.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
    }

    await order.updateStatus(status, notes);

    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      data: {
        order,
      },
    });
  })
);

// @desc    Get order analytics
// @route   GET /api/orders/analytics/dashboard
// @access  Private/Admin
router.get(
  "/analytics/dashboard",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { period = "30" } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Overall statistics
    const totalStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          averageOrderValue: { $avg: "$totalPrice" },
        },
      },
    ]);

    // Period statistics
    const periodStats = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          averageOrderValue: { $avg: "$totalPrice" },
        },
      },
    ]);

    // Daily revenue chart data
    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

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
      { $limit: 10 },
    ]);

    // Order status distribution
    const statusDistribution = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalStats: totalStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
        },
        periodStats: periodStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
        },
        dailyRevenue,
        topProducts,
        statusDistribution,
      },
    });
  })
);

module.exports = router;
