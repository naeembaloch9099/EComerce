const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");
const { createAdminUser } = require("./utils/createAdmin");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Connect to Database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting (disabled in development with DISABLE_RATE_LIMIT=true)
const shouldDisableRateLimit =
  process.env.NODE_ENV === "development" &&
  process.env.DISABLE_RATE_LIMIT === "true";

if (!shouldDisableRateLimit) {
  const limiter = rateLimit({
    windowMs:
      parseInt(process.env.RATE_LIMIT_WINDOW_MS) ||
      (process.env.NODE_ENV === "development" ? 5 * 60 * 1000 : 15 * 60 * 1000), // 5 min dev, 15 min prod
    max:
      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) ||
      (process.env.NODE_ENV === "development" ? 1000 : 100), // 1000 dev, 100 prod
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === "development" && req.ip === "::1", // Skip rate limiting for localhost in development
  });

  app.use(limiter);
} else {
  console.log("⚠️  Rate limiting disabled for development");
}

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files for uploaded images
app.use("/uploads", express.static("uploads"));

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Rabbit E-commerce API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Create admin user on startup
createAdminUser();

// Server port configuration - changed to 5001
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
