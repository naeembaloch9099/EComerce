const express = require("express");
const { protect, authorize } = require("../middleware/auth");
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

const router = express.Router();

// User routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin routes
router.get("/stats", protect, authorize("admin"), getOrderStats);
router.get("/", protect, authorize("admin"), getOrders);

// Dynamic routes (should come last)
router.get("/:id", protect, getOrder);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);
router.put("/:id/pay", protect, authorize("admin"), markOrderAsPaid);

module.exports = router;
