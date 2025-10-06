const { asyncHandler } = require("../middleware/errorHandler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { sendEmail } = require("../utils/emailService");
const { generateInvoicePDF } = require("../services/pdfService");
const { sendOrderConfirmationEmail } = require("../services/emailService");

const createOrder = asyncHandler(async (req, res) => {
  console.log("🚀 ========== ORDER CREATION STARTED ==========");
  console.log("📥 Raw request body:", JSON.stringify(req.body, null, 2));
  console.log("👤 User making order:", {
    userId: req.user?.id,
    email: req.user?.email,
    name: req.user?.name,
    role: req.user?.role,
  });

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentResult,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discount,
    couponCode,
  } = req.body;

  console.log("📦 Extracted order data:", {
    orderItemsCount: orderItems?.length || 0,
    shippingAddress: shippingAddress ? "✅ Present" : "❌ Missing",
    paymentMethod: paymentMethod || "Not specified",
    paymentResult: paymentResult ? "✅ Present" : "❌ Missing",
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discount,
    couponCode,
  });

  if (!orderItems || orderItems.length === 0) {
    console.log("❌ ORDER FAILED: No order items provided");
    return res.status(400).json({
      status: "error",
      message: "No order items provided",
    });
  }

  // Generate unique order key
  const generateOrderKey = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const orderKey = `ORD-${timestamp}-${randomStr}`.toUpperCase();
    console.log("🔑 Generated orderKey:", orderKey);
    return orderKey;
  };

  // Generate order number (this will be handled by the Order model's pre-save hook)
  // But we need to provide it to avoid validation error
  const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    const orderNumber = `RBT${year}${month}${day}${timestamp}`;
    console.log("📋 Generated orderNumber:", orderNumber);
    return orderNumber;
  };

  console.log("🔄 Starting order items processing...");
  // Process order items without stock validation
  const processedItems = [];
  let calculatedItemsPrice = 0;

  for (const [index, item] of orderItems.entries()) {
    console.log(`📦 Processing item ${index + 1}/${orderItems.length}:`, {
      productId: item.product,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color,
    });

    let product = null;
    let processedItem = {};

    // Handle null, undefined, or placeholder product ID
    if (
      !item.product ||
      item.product === "000000000000000000000000" ||
      item.product === null
    ) {
      console.log(
        `⚠️ Processing order item without valid product ID: ${item.name}`
      );

      // Try to find product by name as fallback only if we have a name
      if (item.name) {
        product = await Product.findOne({ name: item.name });
      }

      if (!product) {
        // Create a generic product entry for the order
        processedItem = {
          product: null, // No product reference
          name: item.name || "Unknown Product",
          quantity: item.quantity || 1,
          image: item.image || "/placeholder-image.jpg",
          price: item.price || 0,
          size: item.size || "N/A",
          color: item.color || "N/A",
          sku: `GENERIC-${Date.now()}`, // Generate generic SKU
          variant: item.variant || {},
        };
        console.log(`📦 Created generic order item for: ${item.name}`);
      } else {
        // Found product by name
        processedItem = {
          product: product._id,
          name: item.name || product.name,
          quantity: item.quantity,
          image: item.image || product.images[0] || "/placeholder-image.jpg",
          price: item.price || product.price,
          size: item.size,
          color: item.color,
          sku: product.sku || `FOUND-${Date.now()}`,
          variant: item.variant || {},
        };
        console.log(`✅ Found product by name: ${product.name}`);
      }
    } else {
      // Normal product ID validation - only when we have a real product ID
      try {
        product = await Product.findById(item.product);
      } catch (error) {
        console.log(
          `⚠️ Invalid product ID format: ${item.product}, treating as generic item`
        );
        product = null;
      }

      if (!product) {
        // If product not found by ID, create generic item
        processedItem = {
          product: null,
          name: item.name || "Unknown Product",
          quantity: item.quantity || 1,
          image: item.image || "/placeholder-image.jpg",
          price: item.price || 0,
          size: item.size || "N/A",
          color: item.color || "N/A",
          sku: `NOTFOUND-${Date.now()}`,
          variant: item.variant || {},
        };
        console.log(
          `📦 Product not found, created generic item for: ${item.name}`
        );
      } else {
        // Found product by ID
        processedItem = {
          product: product._id,
          name: item.name || product.name,
          quantity: item.quantity,
          image: item.image || product.images[0],
          price: item.price || product.price,
          size: item.size,
          color: item.color,
          sku: product.sku || `PROD-${Date.now()}`,
          variant: item.variant || {},
        };
      }
    }

    processedItems.push(processedItem);
    calculatedItemsPrice +=
      (processedItem.price || 0) * (processedItem.quantity || 1);

    console.log(`✅ Processed item ${index + 1}:`, {
      name: processedItem.name,
      price: processedItem.price,
      quantity: processedItem.quantity,
      subtotal: (processedItem.price || 0) * (processedItem.quantity || 1),
      hasProduct: processedItem.product ? "✅ Yes" : "❌ No",
    });
  }

  console.log("📊 Order items processing complete:", {
    totalItems: processedItems.length,
    calculatedItemsPrice,
    itemDetails: processedItems.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  // Ensure paymentResult has the required method field
  const processedPaymentResult = {
    ...paymentResult,
    method: paymentMethod || "cod", // Use paymentMethod for the method field
    status: paymentResult?.status || "pending",
    id: paymentResult?.id || `${Date.now()}`,
  };

  console.log("💳 Payment processing:", {
    originalPaymentResult: paymentResult,
    processedPaymentResult,
    paymentMethod: paymentMethod || "cod",
  });

  // Calculate final prices
  const finalSubtotal = itemsPrice || calculatedItemsPrice;
  const finalTaxPrice = taxPrice || 0;
  const finalShippingPrice = shippingPrice || 0;
  const finalTotalPrice =
    totalPrice || finalSubtotal + finalTaxPrice + finalShippingPrice;

  console.log("💰 Price calculation:", {
    itemsPrice,
    calculatedItemsPrice,
    finalSubtotal,
    taxPrice,
    finalTaxPrice,
    shippingPrice,
    finalShippingPrice,
    totalPrice,
    finalTotalPrice,
  });

  console.log("🏠 Shipping address validation:", {
    hasShippingAddress: !!shippingAddress,
    shippingAddress: shippingAddress,
  });

  // Create order with all required fields
  const orderKey = generateOrderKey();
  const orderNumber = generateOrderNumber();

  // Check if this should be a guest order (admin placing order for customer)
  const isGuestOrder =
    req.user.role === "admin" &&
    shippingAddress?.email &&
    shippingAddress.email !== req.user.email;

  console.log("🔍 Order type detection:", {
    userRole: req.user.role,
    userEmail: req.user.email,
    shippingEmail: shippingAddress?.email,
    isGuestOrder: isGuestOrder,
  });

  const orderData = {
    orderKey,
    orderNumber,
    user: req.user.id,
    orderItems: processedItems,
    shippingAddress,
    // If admin is placing order for customer, preserve customer info
    ...(isGuestOrder && {
      customerInfo: {
        name: shippingAddress.name || shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
      },
    }),
    paymentMethod: paymentMethod || "cod",
    paymentResult: processedPaymentResult,
    subtotal: finalSubtotal,
    taxPrice: finalTaxPrice,
    shippingPrice: finalShippingPrice,
    totalPrice: finalTotalPrice,
    discount: {
      amount: discount || 0,
      code: couponCode || "",
      type: "fixed",
    },
    isPaid: paymentMethod === "stripe" ? true : false,
    paidAt: paymentMethod === "stripe" ? new Date() : undefined,
  };

  console.log(
    "📝 Final order data being saved to DB:",
    JSON.stringify(orderData, null, 2)
  );

  console.log("💾 Attempting to save order to database...");
  const order = await Order.create(orderData);

  console.log("✅ Order created successfully:", {
    orderId: order._id,
    orderKey: order.orderKey,
    orderNumber: order.orderNumber,
    totalPrice: order.totalPrice,
    user: req.user.id,
    createdAt: order.createdAt,
    status: order.status,
  });

  // Skip stock updates - no inventory management
  console.log("⏭️ Skipping stock updates (inventory management disabled)");

  // Clear user's cart
  console.log("🧹 Clearing user cart...");
  const cartResult = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [], totalItems: 0, totalPrice: 0 }
  );
  console.log(
    "🧹 Cart clearing result:",
    cartResult ? "✅ Success" : "❌ Failed"
  );

  // Populate order for response
  console.log("🔄 Populating order data for response...");
  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate("orderItems.product", "name images slug price");

  console.log("📋 Populated order data:", {
    orderId: populatedOrder._id,
    user: populatedOrder.user,
    orderItemsCount: populatedOrder.orderItems?.length,
    populatedProducts: populatedOrder.orderItems?.map((item) => ({
      name: item.name,
      hasProduct: !!item.product,
      productName: item.product?.name,
    })),
  });

  // Send order confirmation email
  console.log("📧 Attempting to send order confirmation email...");
  try {
    await sendEmail({
      to: req.user.email,
      subject: "Order Confirmation",
      template: "orderConfirmation",
      context: {
        customerName: req.user.name,
        orderKey: order.orderKey, // Use unique order key
        totalPrice: order.totalPrice,
        orderItems: order.orderItems,
      },
    });
    console.log("📧 Order confirmation email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send order confirmation email:", error);
  }

  const finalResponse = {
    status: "success",
    message: "Order created successfully",
    data: {
      order: populatedOrder,
    },
  };

  console.log("📤 Sending final response:", {
    status: finalResponse.status,
    message: finalResponse.message,
    orderId: finalResponse.data?.order?._id,
    orderKey: finalResponse.data?.order?.orderKey,
  });

  // Generate PDF and send confirmation email asynchronously
  if (finalResponse.status === "success" && finalResponse.data?.order) {
    const savedOrder = finalResponse.data.order;

    // Don't wait for email/PDF - send response immediately for better UX
    setImmediate(async () => {
      try {
        console.log(
          "📧 Starting PDF generation and email sending for order:",
          savedOrder.orderNumber
        );

        // Generate PDF invoice
        const pdfBuffer = await generateInvoicePDF(savedOrder);
        console.log("✅ PDF generated successfully");

        // Prepare email data
        const customerEmail =
          savedOrder.user?.email || savedOrder.shippingAddress?.email;
        const customerName =
          savedOrder.user?.name ||
          `${savedOrder.shippingAddress?.firstName || ""} ${
            savedOrder.shippingAddress?.lastName || ""
          }`.trim() ||
          "Valued Customer";

        if (customerEmail) {
          // Send order confirmation email with PDF attachment
          const emailResult = await sendOrderConfirmationEmail(
            {
              order: savedOrder,
              customerEmail,
              customerName,
            },
            pdfBuffer
          );

          if (emailResult.success) {
            console.log(
              "✅ Order confirmation email sent successfully to:",
              customerEmail
            );
          } else {
            console.error(
              "❌ Failed to send order confirmation email:",
              emailResult.error
            );
          }
        } else {
          console.warn(
            "⚠️ No customer email found, skipping email notification"
          );
        }
      } catch (error) {
        console.error("❌ Error in post-order processing:", error);
        // Don't fail the order creation if email/PDF fails
      }
    });
  }

  console.log("🎉 ========== ORDER CREATION COMPLETED ==========");

  res.status(201).json(finalResponse);
});

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  console.log("🔍 ========== GET MY ORDERS STARTED ==========");
  console.log("👤 User requesting orders:", {
    userId: req.user?.id,
    email: req.user?.email,
    role: req.user?.role,
  });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = { user: req.user.id };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Get orders with pagination
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("orderItems.product", "name images slug");

  // Get total count
  const totalOrders = await Order.countDocuments(filter);
  const totalPages = Math.ceil(totalOrders / limit);

  res.status(200).json({
    status: "success",
    results: orders.length,
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
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
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
  if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(404).json({
      status: "error",
      message: "Order not found",
    });
  }

  // Transform order to include proper customer info
  const orderObj = order.toObject();

  // If order has customerInfo (guest order), use that for customer details
  if (orderObj.customerInfo && orderObj.customerInfo.email) {
    orderObj.customer = {
      name: orderObj.customerInfo.name,
      email: orderObj.customerInfo.email,
      phone: orderObj.customerInfo.phone,
    };
  } else {
    // Use user info as fallback
    orderObj.customer = {
      name: orderObj.user?.name,
      email: orderObj.user?.email,
    };
  }

  res.status(200).json({
    status: "success",
    data: {
      order: orderObj,
    },
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      status: "error",
      message: "Order not found",
    });
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({
      status: "error",
      message: "Not authorized to cancel this order",
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

  // Restore product stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, sold: -item.quantity },
    });
  }

  // Send cancellation email
  try {
    await sendEmail({
      to: req.user.email,
      subject: "Order Cancellation Confirmation",
      template: "orderCancellation",
      context: {
        customerName: req.user.name,
        orderNumber: order.orderNumber,
        reason: order.cancelReason,
      },
    });
  } catch (error) {
    console.error("Failed to send cancellation email:", error);
  }

  res.status(200).json({
    status: "success",
    message: "Order cancelled successfully",
    data: {
      order,
    },
  });
});

// Admin functions

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build filter
  let filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.paymentMethod) {
    filter.paymentMethod = req.query.paymentMethod;
  }

  if (req.query.isPaid !== undefined) {
    filter.isPaid = req.query.isPaid === "true";
  }

  if (req.query.isDelivered !== undefined) {
    filter.isDelivered = req.query.isDelivered === "true";
  }

  // Date range filtering
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) {
      filter.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      filter.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  // Search by order number or customer email
  if (req.query.search) {
    const searchRegex = { $regex: req.query.search, $options: "i" };

    // First find users matching the search
    const User = require("../models/User");
    const matchingUsers = await User.find({
      $or: [{ email: searchRegex }, { name: searchRegex }],
    }).select("_id");

    filter.$or = [
      { orderNumber: searchRegex },
      { user: { $in: matchingUsers.map((u) => u._id) } },
    ];
  }

  // Build sort
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
      case "status":
        sortBy = { status: 1 };
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
    .populate("user", "name email")
    .populate("orderItems.product", "name images");

  // Transform orders to include proper customer info
  const transformedOrders = orders.map((order) => {
    const orderObj = order.toObject();

    // If order has customerInfo (guest order), use that for customer details
    if (orderObj.customerInfo && orderObj.customerInfo.email) {
      orderObj.customer = {
        name: orderObj.customerInfo.name,
        email: orderObj.customerInfo.email,
        phone: orderObj.customerInfo.phone,
      };
    } else {
      // Use user info as fallback
      orderObj.customer = {
        name: orderObj.user?.name,
        email: orderObj.user?.email,
      };
    }

    return orderObj;
  });

  // Get total count
  const totalOrders = await Order.countDocuments(filter);
  const totalPages = Math.ceil(totalOrders / limit);

  res.status(200).json({
    status: "success",
    results: transformedOrders.length,
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
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid status",
    });
  }

  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({
      status: "error",
      message: "Order not found",
    });
  }

  const oldStatus = order.status;
  order.status = status;

  // Set delivery date if status is delivered
  if (status === "delivered" && !order.isDelivered) {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  // Add tracking info if provided
  if (req.body.trackingNumber) {
    order.trackingInfo.trackingNumber = req.body.trackingNumber;
  }

  if (req.body.carrier) {
    order.trackingInfo.carrier = req.body.carrier;
  }

  await order.save();

  // Send status update email
  try {
    if (status !== oldStatus) {
      await sendEmail({
        to: order.user.email,
        subject: `Order ${order.orderNumber} - Status Update`,
        template: "orderStatusUpdate",
        context: {
          customerName: order.user.name,
          orderNumber: order.orderNumber,
          status: status,
          trackingNumber: order.trackingInfo.trackingNumber,
          carrier: order.trackingInfo.carrier,
        },
      });
    }
  } catch (error) {
    console.error("Failed to send status update email:", error);
  }

  res.status(200).json({
    status: "success",
    message: "Order status updated successfully",
    data: {
      order,
    },
  });
});

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      status: "error",
      message: "Order not found",
    });
  }

  order.isPaid = true;
  order.paidAt = new Date();

  if (req.body.paymentResult) {
    order.paymentResult = req.body.paymentResult;
  }

  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order marked as paid",
    data: {
      order,
    },
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
        averageOrderValue: { $avg: "$totalPrice" },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        confirmedOrders: {
          $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
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
        paidOrders: {
          $sum: { $cond: ["$isPaid", 1, 0] },
        },
      },
    },
  ]);

  // Monthly revenue for the last 12 months
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      summary: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        paidOrders: 0,
      },
      monthlyRevenue,
    },
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getOrders,
  updateOrderStatus,
  markOrderAsPaid,
  getOrderStats,
};
