const { asyncHandler } = require("../middleware/errorHandler");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get basic counts
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  // Get revenue stats
  const revenueStats = await Order.aggregate([
    {
      $match: { status: { $ne: "cancelled" } },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        averageOrderValue: { $avg: "$totalPrice" },
      },
    },
  ]);

  // Get recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name email")
    .populate("orderItems.product", "name");

  // Get order status distribution
  const orderStatusStats = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Get monthly revenue for the last 12 months
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

  // Get top selling products
  const topProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalSold: { $sum: "$orderItems.quantity" },
        revenue: {
          $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
        },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        name: "$product.name",
        totalSold: 1,
        revenue: 1,
        image: { $arrayElemAt: ["$product.images", 0] },
      },
    },
  ]);

  // Get low stock products
  const lowStockProducts = await Product.find({
    stock: { $lte: 10 },
    isActive: true,
  })
    .sort({ stock: 1 })
    .limit(5)
    .select("name stock images");

  // Get new users this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth },
    role: "user",
  });

  res.status(200).json({
    status: "success",
    data: {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        averageOrderValue: revenueStats[0]?.averageOrderValue || 0,
        newUsersThisMonth,
      },
      recentOrders,
      orderStatusStats,
      monthlyRevenue,
      topProducts,
      lowStockProducts,
    },
  });
});

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = "30days" } = req.query;

  let startDate;
  switch (period) {
    case "7days":
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30days":
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90days":
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1year":
      startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  // Daily sales for the period
  const dailySales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  // Category-wise sales
  const categorySales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $ne: "cancelled" },
      },
    },
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
        revenue: {
          $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
        },
        quantity: { $sum: "$orderItems.quantity" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  // Payment method distribution
  const paymentMethodStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $ne: "cancelled" },
      },
    },
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
      period,
      dailySales,
      categorySales,
      paymentMethodStats,
    },
  });
});

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res) => {
  // User registration over time (last 12 months)
  const userRegistrations = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        role: "user",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  // Active users (users who have placed orders)
  const activeUsers = await Order.distinct("user");
  const totalActiveUsers = activeUsers.length;

  // User activity stats
  const userActivityStats = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "user",
        as: "orders",
      },
    },
    {
      $addFields: {
        orderCount: { $size: "$orders" },
        totalSpent: { $sum: "$orders.totalPrice" },
      },
    },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        usersWithOrders: {
          $sum: { $cond: [{ $gt: ["$orderCount", 0] }, 1, 0] },
        },
        averageOrdersPerUser: { $avg: "$orderCount" },
        averageSpentPerUser: { $avg: "$totalSpent" },
      },
    },
  ]);

  // Top customers
  const topCustomers = await Order.aggregate([
    {
      $group: {
        _id: "$user",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalPrice" },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        name: "$user.name",
        email: "$user.email",
        totalOrders: 1,
        totalSpent: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      userRegistrations,
      totalActiveUsers,
      userActivityStats: userActivityStats[0] || {},
      topCustomers,
    },
  });
});

// @desc    Get product analytics
// @route   GET /api/admin/analytics/products
// @access  Private/Admin
const getProductAnalytics = asyncHandler(async (req, res) => {
  // Product performance
  const productPerformance = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalSold: { $sum: "$orderItems.quantity" },
        revenue: {
          $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
        },
        averagePrice: { $avg: "$orderItems.price" },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 20 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        name: "$product.name",
        category: "$product.category",
        totalSold: 1,
        revenue: 1,
        averagePrice: 1,
        currentStock: "$product.stock",
      },
    },
  ]);

  // Category performance
  const categoryPerformance = await Order.aggregate([
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
        uniqueProducts: { $addToSet: "$orderItems.product" },
      },
    },
    {
      $addFields: {
        productCount: { $size: "$uniqueProducts" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  // Inventory status
  const inventoryStatus = await Product.aggregate([
    {
      $bucket: {
        groupBy: "$stock",
        boundaries: [0, 1, 10, 50, 100, Infinity],
        default: "Other",
        output: {
          count: { $sum: 1 },
          products: { $push: { name: "$name", stock: "$stock" } },
        },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      productPerformance,
      categoryPerformance,
      inventoryStatus,
    },
  });
});

// @desc    Get system health
// @route   GET /api/admin/system/health
// @access  Private/Admin
const getSystemHealth = asyncHandler(async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  // Database stats
  const dbStats = {
    users: await User.countDocuments(),
    products: await Product.countDocuments(),
    orders: await Order.countDocuments(),
    carts: await Cart.countDocuments(),
  };

  // Recent errors (you'd implement error logging)
  const recentErrors = [];

  res.status(200).json({
    status: "success",
    data: {
      server: {
        uptime: Math.floor(uptime),
        memoryUsage: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024),
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024),
        },
        nodeVersion: process.version,
      },
      database: {
        status: "connected",
        collections: dbStats,
      },
      recentErrors,
    },
  });
});

// @desc    Export data
// @route   GET /api/admin/export/:type
// @access  Private/Admin
const exportData = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { startDate, endDate, format = "json" } = req.query;

  let data = [];
  let filename = "";

  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  switch (type) {
    case "orders":
      data = await Order.find(
        Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}
      )
        .populate("user", "name email")
        .populate("orderItems.product", "name category");
      filename = `orders_${Date.now()}`;
      break;

    case "users":
      data = await User.find(
        Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}
      ).select("-password");
      filename = `users_${Date.now()}`;
      break;

    case "products":
      data = await Product.find();
      filename = `products_${Date.now()}`;
      break;

    default:
      return res.status(400).json({
        status: "error",
        message: "Invalid export type",
      });
  }

  if (format === "csv") {
    // Convert to CSV (simplified)
    const csv = data
      .map((item) => Object.values(item.toObject()).join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.csv"`
    );
    res.send(csv);
  } else {
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.json"`
    );
    res.json({
      status: "success",
      exportedAt: new Date(),
      count: data.length,
      data,
    });
  }
});

module.exports = {
  getDashboardStats,
  getSalesAnalytics,
  getUserAnalytics,
  getProductAnalytics,
  getSystemHealth,
  exportData,
};
