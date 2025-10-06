const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { handleValidationErrors } = require("../middleware/errorHandler");
const { protect, authorize, optionalAuth } = require("../middleware/auth");
const {
  validateProduct,
  validateReview,
  validatePagination,
  validateProductSearch,
  validateObjectId,
} = require("../middleware/validation");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get(
  "/",
  validatePagination,
  validateProductSearch,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = { isActive: true };

    // Search filter
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Subcategory filter
    if (req.query.subcategory) {
      filter.subcategory = { $regex: req.query.subcategory, $options: "i" };
    }

    // Gender filter
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Brand filter
    if (req.query.brand) {
      filter.brand = { $regex: req.query.brand, $options: "i" };
    }

    // In stock filter
    if (req.query.inStock === "true") {
      filter.totalStock = { $gt: 0 };
    }

    // Featured products
    if (req.query.featured === "true") {
      filter.isFeatured = true;
    }

    // New arrivals
    if (req.query.newArrivals === "true") {
      filter.isNewArrival = true;
    }

    // Build sort
    let sortBy = { createdAt: -1 }; // Default: newest first

    if (req.query.sort) {
      switch (req.query.sort) {
        case "price-low":
          sortBy = { price: 1 };
          break;
        case "price-high":
          sortBy = { price: -1 };
          break;
        case "rating":
          sortBy = { averageRating: -1 };
          break;
        case "popular":
          sortBy = { soldCount: -1 };
          break;
        case "oldest":
          sortBy = { createdAt: 1 };
          break;
        case "name":
          sortBy = { name: 1 };
          break;
        default:
          sortBy = { createdAt: -1 };
      }
    }

    // Add text search score for sorting
    if (req.query.search) {
      sortBy = { score: { $meta: "textScore" }, ...sortBy };
    }

    // Get products with pagination
    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select("-reviews"); // Exclude reviews for list view

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);

    // Get filter options for frontend
    const categories = await Product.distinct("category", { isActive: true });
    const brands = await Product.distinct("brand", { isActive: true });
    const priceRange = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      status: "success",
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          limit,
          hasNextPage,
          hasPrevPage,
        },
        filters: {
          categories,
          brands,
          priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
        },
      },
    });
  })
);

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get(
  "/:id",
  validateObjectId(),
  handleValidationErrors,
  optionalAuth,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "name"
    );

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Increment view count (don't await to avoid blocking)
    product.incrementViewCount().catch(console.error);

    // Get related products
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [{ category: product.category }, { tags: { $in: product.tags } }],
      isActive: true,
    })
      .limit(4)
      .select("-reviews");

    res.status(200).json({
      status: "success",
      data: {
        product,
        relatedProducts,
      },
    });
  })
);

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
router.get(
  "/slug/:slug",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("reviews.user", "name");

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Increment view count
    product.incrementViewCount().catch(console.error);

    // Get related products
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .limit(4)
      .select("-reviews");

    res.status(200).json({
      status: "success",
      data: {
        product,
        relatedProducts,
      },
    });
  })
);

// @desc    Get all reviews for admin (must be BEFORE dynamic routes)
// @route   GET /api/products/admin/reviews
// @access  Private/Admin
router.get(
  "/admin/reviews",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    console.log("📊 ProductRoutes: Admin fetching all reviews");

    // Get all products with reviews populated
    const products = await Product.find({ "reviews.0": { $exists: true } })
      .populate("reviews.user", "name email")
      .select("name images reviews");

    // Extract all reviews with product info
    const allReviews = [];
    products.forEach((product) => {
      if (product.reviews && product.reviews.length > 0) {
        product.reviews.forEach((review) => {
          allReviews.push({
            _id: review._id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            user: review.user,
            product: {
              _id: product._id,
              name: product.name,
              images: product.images || [],
            },
          });
        });
      }
    });

    // Sort reviews by most recent first
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(
      `✅ ProductRoutes: Found ${allReviews.length} reviews for admin`
    );

    res.status(200).json({
      status: "success",
      data: {
        reviews: allReviews,
        count: allReviews.length,
      },
    });
  })
);

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
router.get(
  "/:id/reviews",
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews.user",
      select: "name",
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: product.reviews,
    });
  })
);

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post(
  "/:id/reviews",
  protect,
  validateObjectId(),
  validateReview,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      "orderItems.product": req.params.id,
      status: "delivered", // Only allow reviews for delivered orders
    });

    if (!hasPurchased) {
      return res.status(403).json({
        status: "error",
        message: "You can only review products you have purchased and received",
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        status: "error",
        message: "Product already reviewed",
      });
    }

    // Add review
    product.addReview(req.user._id, req.user.name, rating, comment);
    await product.save();

    res.status(201).json({
      status: "success",
      message: "Review added successfully",
      data: product.reviews[product.reviews.length - 1], // Return the newly added review
    });
  })
);

// @desc    Update product review
// @route   PUT /api/products/:id/reviews
// @access  Private
router.put(
  "/:id/reviews",
  protect,
  validateObjectId(),
  validateReview,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Find user's review
    const review = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (!review) {
      return res.status(404).json({
        status: "error",
        message: "Review not found",
      });
    }

    // Update review
    review.rating = rating;
    review.comment = comment;

    product.calculateAverageRating();
    await product.save();

    res.status(200).json({
      status: "success",
      message: "Review updated successfully",
    });
  })
);

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews
// @access  Private
router.delete(
  "/:id/reviews",
  protect,
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Find and remove user's review
    const reviewIndex = product.reviews.findIndex(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Review not found",
      });
    }

    product.reviews.splice(reviewIndex, 1);
    product.calculateAverageRating();
    await product.save();

    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
    });
  })
);

// @desc    Get featured products
// @route   GET /api/products/featured/list
// @access  Public
router.get(
  "/featured/list",
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("-reviews");

    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  })
);

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals/list
// @access  Public
router.get(
  "/new-arrivals/list",
  asyncHandler(async (req, res) => {
    console.log("🔍 ProductRoutes: New arrivals request received");
    const limit = parseInt(req.query.limit) || 8;
    console.log("📋 Limit:", limit);

    try {
      // First try with isNewArrival flag
      let products = await Product.find({
        isNewArrival: true,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("-reviews");

      console.log("📦 Products with isNewArrival=true found:", products.length);

      // If no products with isNewArrival flag, get latest products
      if (products.length === 0) {
        console.log("🔄 No new arrivals found, getting latest products...");
        products = await Product.find({ isActive: true })
          .sort({ createdAt: -1 })
          .limit(limit)
          .select("-reviews");
        console.log("📦 Latest products found:", products.length);
      }

      console.log(
        "📦 Sample product:",
        products[0]
          ? {
              id: products[0]._id,
              name: products[0].name,
              price: products[0].price,
              isNewArrival: products[0].isNewArrival,
            }
          : "No products"
      );

      const responseData = {
        status: "success",
        data: {
          products,
        },
      };

      console.log(
        "✅ ProductRoutes: Sending new arrivals response with",
        products.length,
        "products"
      );
      res.status(200).json(responseData);
    } catch (error) {
      console.error("❌ ProductRoutes: New arrivals error:", error);
      throw error;
    }
  })
);

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
router.get(
  "/category/:category",
  validatePagination,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {
      category: req.params.category,
      isActive: true,
    };

    // Build sort
    let sortBy = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price-low":
          sortBy = { price: 1 };
          break;
        case "price-high":
          sortBy = { price: -1 };
          break;
        case "rating":
          sortBy = { averageRating: -1 };
          break;
        case "popular":
          sortBy = { soldCount: -1 };
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

// Admin routes (protected)

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  validateProduct,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    console.log("🆕 ProductRoutes: POST request received for new product");
    console.log(
      "📦 ProductRoutes: Create data:",
      JSON.stringify(req.body, null, 2)
    );
    console.log("👤 ProductRoutes: Admin user:", req.user?.email);

    const product = await Product.create(req.body);

    console.log("✅ ProductRoutes: Product created successfully:", {
      id: product._id,
      name: product.name,
      sku: product.sku,
    });

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: {
        product,
      },
    });
  })
);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateObjectId(),
  validateProduct,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    console.log(
      "🔧 ProductRoutes: PUT request received for product:",
      req.params.id
    );
    console.log(
      "📦 ProductRoutes: Update data:",
      JSON.stringify(req.body, null, 2)
    );

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      console.log(
        "❌ ProductRoutes: Product not found for update:",
        req.params.id
      );
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    console.log("✅ ProductRoutes: Product updated successfully:", {
      id: product._id,
      name: product.name,
      sku: product.sku,
    });

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: {
        product,
      },
    });
  })
);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validateObjectId(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    console.log("🗑️ ProductRoutes: Delete request for product:", req.params.id);
    console.log("👤 Admin user:", req.user?.email);

    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log("❌ ProductRoutes: Product not found:", req.params.id);
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    console.log("📦 ProductRoutes: Found product to delete:", {
      name: product.name,
      category: product.category,
      isActive: product.isActive,
    });

    // HARD DELETE - Actually remove from database
    await Product.findByIdAndDelete(req.params.id);

    console.log("✅ ProductRoutes: Product permanently deleted from database");

    res.status(200).json({
      status: "success",
      message: "Product permanently deleted from database",
      data: {
        productId: req.params.id,
        productName: product.name,
        deletedAt: new Date(),
      },
    });
  })
);

// @desc    Get all products for admin
// @route   GET /api/products/admin/all
// @access  Private/Admin
router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  validatePagination,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    console.log("🔍 ProductRoutes: Admin products request received");
    console.log("👤 User:", req.user?.email, "Role:", req.user?.role);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log("📋 Pagination:", { page, limit, skip });

    // Build filter (admin sees only active products by default)
    let filter = { isActive: true }; // Default to active products only

    // Allow admin to explicitly see inactive products if requested
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    if (req.query.search) {
      console.log("🔍 Search term:", req.query.search);
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { sku: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.category) {
      console.log("📂 Category filter:", req.query.category);
      filter.category = req.query.category;
    }

    console.log("🔍 MongoDB filter:", JSON.stringify(filter, null, 2));

    // Build sort
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

    try {
      const products = await Product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select("-reviews");

      console.log("📦 Products found:", products.length);
      console.log(
        "📦 Sample product:",
        products[0]
          ? {
              id: products[0]._id,
              name: products[0].name,
              price: products[0].price,
              category: products[0].category,
            }
          : "No products"
      );

      const totalProducts = await Product.countDocuments(filter);
      console.log("📊 Total products in database:", totalProducts);

      const totalPages = Math.ceil(totalProducts / limit);

      const responseData = {
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
      };

      console.log(
        "✅ ProductRoutes: Sending response with",
        products.length,
        "products"
      );
      res.status(200).json(responseData);
    } catch (error) {
      console.error("❌ ProductRoutes: Database error:", error);
      throw error;
    }
  })
);

module.exports = router;
