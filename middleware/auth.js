const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Make sure token exists
    if (!token) {
      console.log("❌ No token found in request");
      return res.status(401).json({
        status: "error",
        message: "Not authorized to access this route",
      });
    }

    console.log("🔍 Raw token received:", token);
    console.log("🔍 Token length:", token.length);
    console.log("🔍 Token first 50 chars:", token.substring(0, 50));
    console.log("🔍 Token last 50 chars:", token.substring(token.length - 50));

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔍 Token decoded:", {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
      });

      // Get user from token
      const user = await User.findById(decoded.id).select(
        "+loginAttempts +lockUntil"
      );

      if (!user) {
        console.log("❌ User not found for token ID:", decoded.id);
        return res.status(401).json({
          status: "error",
          message: "User no longer exists",
        });
      }

      console.log("✅ User found:", {
        id: user._id,
        email: user.email,
        role: user.role,
      });

      // Check if user account is locked
      if (user.isLocked) {
        console.log("❌ User account is locked:", user.email);
        return res.status(423).json({
          status: "error",
          message:
            "Account temporarily locked due to too many failed login attempts",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        console.log("❌ User account is inactive:", user.email);
        return res.status(401).json({
          status: "error",
          message: "Account has been deactivated",
        });
      }

      // Grant access to protected route
      req.user = user;
      console.log(
        "✅ Authentication successful for:",
        user.email,
        "Role:",
        user.role
      );
      next();
    } catch (error) {
      console.log("❌ Token verification failed:", error.message);
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.log("❌ Auth middleware error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Server error in authentication",
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log(
      "🔐 Authorization check - Required roles:",
      roles,
      "User role:",
      req.user?.role
    );

    if (!req.user) {
      console.log("❌ No user found in request object");
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(
        "❌ Role authorization failed - User:",
        req.user.email,
        "Role:",
        req.user.role,
        "Required:",
        roles
      );
      return res.status(403).json({
        status: "error",
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }

    console.log(
      "✅ Authorization successful for:",
      req.user.email,
      "Role:",
      req.user.role
    );
    next();
  };
};

// Optional authentication - doesn't require token but adds user if present
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user && user.isActive && !user.isLocked) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid, but that's okay for optional auth
        req.user = null;
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error in optional authentication",
    });
  }
};

// Check if user owns the resource
const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const Model = require(`../models/${model}`);
      const resource = await Model.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({
          status: "error",
          message: `${model} not found`,
        });
      }

      // Admin can access any resource
      if (req.user.role === "admin") {
        req.resource = resource;
        return next();
      }

      // Check if user owns the resource
      if (
        resource.user &&
        resource.user.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          status: "error",
          message: "Not authorized to access this resource",
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Server error in ownership check",
      });
    }
  };
};

// Rate limiting for specific routes
const createRateLimit = (windowMs, max, message) => {
  const rateLimit = require("express-rate-limit");

  return rateLimit({
    windowMs,
    max,
    message: {
      status: "error",
      message: message || "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Specific rate limits (can be disabled in development)
const shouldDisableRateLimit =
  process.env.NODE_ENV === "development" &&
  process.env.DISABLE_RATE_LIMIT === "true";

const authLimiter = shouldDisableRateLimit
  ? (req, res, next) => next()
  : createRateLimit(
      process.env.NODE_ENV === "development" ? 5 * 60 * 1000 : 15 * 60 * 1000, // 5 min in dev, 15 min in prod
      process.env.NODE_ENV === "development" ? 50 : 5, // 50 attempts in dev, 5 in prod
      "Too many authentication attempts, please try again later"
    );

const passwordResetLimiter = shouldDisableRateLimit
  ? (req, res, next) => next()
  : createRateLimit(
      process.env.NODE_ENV === "development" ? 10 * 60 * 1000 : 60 * 60 * 1000, // 10 min in dev, 1 hour in prod
      process.env.NODE_ENV === "development" ? 10 : 3, // 10 attempts in dev, 3 in prod
      "Too many password reset attempts, please try again later"
    );

const emailLimiter = shouldDisableRateLimit
  ? (req, res, next) => next()
  : createRateLimit(
      process.env.NODE_ENV === "development" ? 10 * 60 * 1000 : 60 * 60 * 1000, // 10 min in dev, 1 hour in prod
      process.env.NODE_ENV === "development" ? 20 : 5, // 20 emails in dev, 5 in prod
      "Too many emails sent, please try again later"
    );

module.exports = {
  protect,
  authorize,
  optionalAuth,
  checkOwnership,
  authLimiter,
  passwordResetLimiter,
  emailLimiter,
};
