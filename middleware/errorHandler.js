const { validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("❌ Validation Errors Found:");
    console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));
    console.log("🚫 Validation Errors:", errors.array());

    const errorMessages = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    console.log("📋 Formatted Error Messages:", errorMessages);

    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  next();
};

// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error Details:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = {
      message,
      statusCode: 404,
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } '${value}' already exists`;
    error = {
      message,
      statusCode: 400,
    };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);
    error = {
      message: messages.join(". "),
      statusCode: 400,
    };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = {
      message,
      statusCode: 401,
    };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = {
      message,
      statusCode: 401,
    };
  }

  // Stripe errors
  if (err.type === "StripeCardError") {
    error = {
      message: err.message || "Card error occurred",
      statusCode: 400,
    };
  }

  if (err.type === "StripeRateLimitError") {
    error = {
      message: "Too many requests made to Stripe API",
      statusCode: 429,
    };
  }

  if (err.type === "StripeInvalidRequestError") {
    error = {
      message: err.message || "Invalid request to Stripe",
      statusCode: 400,
    };
  }

  if (err.type === "StripeAPIError") {
    error = {
      message: "Stripe API error occurred",
      statusCode: 500,
    };
  }

  if (err.type === "StripeConnectionError") {
    error = {
      message: "Network error with Stripe",
      statusCode: 500,
    };
  }

  if (err.type === "StripeAuthenticationError") {
    error = {
      message: "Stripe authentication failed",
      statusCode: 401,
    };
  }

  // Multer errors (file upload)
  if (err.code === "LIMIT_FILE_SIZE") {
    error = {
      message: "File too large",
      statusCode: 400,
    };
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    error = {
      message: "Too many files uploaded",
      statusCode: 400,
    };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    error = {
      message: "Unexpected file field",
      statusCode: 400,
    };
  }

  // Set default error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server Error";

  // Don't leak error details in production
  const response = {
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  };

  res.status(statusCode).json(response);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  handleValidationErrors,
  asyncHandler,
  notFound,
};
