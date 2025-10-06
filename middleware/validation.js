const { body, param, query } = require("express-validator");

// User validation rules
const validateUserRegistration = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage(
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address")
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];

const validateUserLogin = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];

const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage(
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("phone")
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
];

const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password confirmation does not match new password");
    }
    return true;
  }),
];

const validatePasswordReset = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
];

const validatePasswordResetConfirm = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  param("token").isLength({ min: 1 }).withMessage("Reset token is required"),
];

// Product validation rules
const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Product name must be between 1 and 100 characters"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Product description must be between 10 and 2000 characters"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("comparePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Compare price must be a positive number"),

  body("category")
    .isIn([
      "men",
      "women",
      "kids",
      "accessories",
      "shoes",
      "electronics",
      "home",
      "sports",
    ])
    .withMessage("Please select a valid category"),

  body("subcategory")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Subcategory is required"),

  body("totalStock")
    .isInt({ min: 0 })
    .withMessage("Total stock must be a non-negative integer"),

  // Optional fields validation
  body("brand")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Brand must not be empty if provided"),

  body("colors").optional().isArray().withMessage("Colors must be an array"),

  body("sizes").optional().isArray().withMessage("Sizes must be an array"),

  body("images").optional().isArray().withMessage("Images must be an array"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean"),

  body("isNewArrival")
    .optional()
    .isBoolean()
    .withMessage("isNewArrival must be a boolean"),
];

// Order validation rules
const validateOrder = [
  body("orderItems")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("orderItems.*.product")
    .optional({ nullable: true, checkFalsy: false })
    .custom((value) => {
      // Explicitly allow null, undefined, and empty string
      if (value === null || value === undefined || value === "") {
        return true;
      }
      // If value exists, check if it's a valid MongoDB ObjectId
      if (typeof value === "string" && value.match(/^[0-9a-fA-F]{24}$/)) {
        return true;
      }
      // Allow any string (for fallback cases)
      if (typeof value === "string") {
        return true;
      }
      throw new Error("Invalid product ID");
    }),

  body("orderItems.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("shippingAddress.firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name is required and must be less than 50 characters"),

  body("shippingAddress.lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name is required and must be less than 50 characters"),

  body("shippingAddress.email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("shippingAddress.phone")
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),

  body("shippingAddress.address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),

  body("shippingAddress.city")
    .trim()
    .isLength({ min: 1 })
    .withMessage("City is required"),

  body("shippingAddress.zipCode")
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage("ZIP code must be between 4 and 10 characters"),

  body("paymentMethod")
    .isIn(["stripe", "paypal", "cod", "bank_transfer"])
    .withMessage("Please select a valid payment method"),
];

// Cart validation rules
const validateCartItem = [
  body("productId").isMongoId().withMessage("Invalid product ID"),

  body("quantity")
    .isInt({ min: 1, max: 10 })
    .withMessage("Quantity must be between 1 and 10"),

  body("size")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Size cannot be empty if provided"),

  body("color")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Color cannot be empty if provided"),
];

// Review validation rules
const validateReview = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Review comment must be between 10 and 500 characters"),
];

// Query validation rules
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sort")
    .optional()
    .isIn(["newest", "oldest", "price-low", "price-high", "rating", "popular"])
    .withMessage("Invalid sort option"),
];

const validateProductSearch = [
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),

  query("category")
    .optional()
    .isIn([
      "men",
      "women",
      "kids",
      "accessories",
      "shoes",
      "electronics",
      "home",
      "sports",
    ])
    .withMessage("Invalid category"),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a positive number"),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a positive number"),
];

// MongoDB ObjectId validation
const validateObjectId = (field = "id") => [
  param(field).isMongoId().withMessage(`Invalid ${field}`),
];

module.exports = {
  // User validations
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePasswordChange,
  validatePasswordReset,
  validatePasswordResetConfirm,

  // Product validations
  validateProduct,

  // Order validations
  validateOrder,

  // Cart validations
  validateCartItem,

  // Review validations
  validateReview,

  // Query validations
  validatePagination,
  validateProductSearch,

  // General validations
  validateObjectId,
};
