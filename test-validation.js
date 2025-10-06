// Quick validation test for product data
const { body, validationResult } = require("express-validator");

// Copy the exact validation rules
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

// Test function
async function testProductValidation(productData) {
  console.log("🧪 Testing Product Validation...");
  console.log("📦 Product Data:", JSON.stringify(productData, null, 2));

  // Create a mock request object
  const req = {
    body: productData,
  };

  const res = {
    status: () => res,
    json: () => res,
  };

  // Run validation
  for (let validator of validateProduct) {
    await validator(req, res, () => {});
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("❌ Validation Errors Found:");
    errors.array().forEach((error, index) => {
      console.log(`   ${index + 1}. Field: "${error.path}" - ${error.msg}`);
      console.log(`      Value: ${JSON.stringify(error.value)}`);
      console.log(`      Location: ${error.location}`);
    });
    return false;
  } else {
    console.log("✅ All validations passed!");
    return true;
  }
}

// Example test data - modify this to match your failing product
const sampleProductData = {
  name: "Test Product",
  description: "This is a test product description that is long enough",
  price: 29.99,
  category: "men",
  subcategory: "T-Shirts",
  brand: "RabbitWear",
  colors: [{ name: "Black", code: "#000000", stock: 30 }],
  sizes: [{ size: "M", stock: 25 }],
  totalStock: 55,
  isActive: true,
  isFeatured: false,
  isNewArrival: false,
  tags: [],
  images: [],
};

// Run the test
if (require.main === module) {
  testProductValidation(sampleProductData)
    .then((result) => {
      console.log(`\n🎯 Validation Result: ${result ? "PASSED" : "FAILED"}`);
    })
    .catch((error) => {
      console.error("💥 Test Error:", error);
    });
}

module.exports = { testProductValidation, validateProduct };
