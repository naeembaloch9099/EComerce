const { asyncHandler } = require("../middleware/errorHandler");
const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Product.find(JSON.parse(queryStr));

  // Category filtering
  if (req.query.category) {
    query = query.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  // Price range filtering
  if (req.query.minPrice || req.query.maxPrice) {
    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    query = query.find({ price: priceFilter });
  }

  // Color filtering
  if (req.query.colors) {
    const colors = req.query.colors.split(",");
    query = query.find({ "variants.color": { $in: colors } });
  }

  // Size filtering
  if (req.query.sizes) {
    const sizes = req.query.sizes.split(",");
    query = query.find({ "variants.size": { $in: sizes } });
  }

  // Brand filtering
  if (req.query.brand) {
    query = query.find({ brand: { $regex: req.query.brand, $options: "i" } });
  }

  // Material filtering
  if (req.query.material) {
    query = query.find({
      material: { $regex: req.query.material, $options: "i" },
    });
  }

  // Gender filtering
  if (req.query.gender) {
    query = query.find({ gender: req.query.gender });
  }

  // Search functionality
  if (req.query.search) {
    query = query.find({
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
        { brand: { $regex: req.query.search, $options: "i" } },
      ],
    });
  }

  // Only show active products for public access
  query = query.find({ isActive: true });

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const products = await query;

  // Get total count for pagination
  const totalProducts = await Product.countDocuments({
    ...JSON.parse(queryStr),
    isActive: true,
  });

  // Calculate pagination info
  const totalPages = Math.ceil(totalProducts / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(200).json({
    status: "success",
    results: products.length,
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
    },
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  let product;

  // Check if the param is an ObjectId or slug
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    // It's an ObjectId
    product = await Product.findById(req.params.id);
  } else {
    // It's a slug
    product = await Product.findOne({ slug: req.params.id });
  }

  if (!product || !product.isActive) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  // Increment view count
  product.views += 1;
  await product.save({ validateBeforeSave: false });

  // Get related products (same category, different product)
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(4)
    .select("name price images slug rating");

  res.status(200).json({
    status: "success",
    data: {
      product,
      relatedProducts,
    },
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({
    isFeatured: true,
    isActive: true,
  })
    .sort("-createdAt")
    .limit(limit)
    .select("name price images slug rating");

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({
    isActive: true,
  })
    .sort("-createdAt")
    .limit(limit)
    .select("name price images slug rating");

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const products = await Product.find({
    category: { $regex: category, $options: "i" },
    isActive: true,
  })
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .select("name price images slug rating");

  const totalProducts = await Product.countDocuments({
    category: { $regex: category, $options: "i" },
    isActive: true,
  });

  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    status: "success",
    results: products.length,
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
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      status: "error",
      message: "Search query is required",
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const searchQuery = {
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
          { brand: { $regex: q, $options: "i" } },
          { tags: { $in: [new RegExp(q, "i")] } },
        ],
      },
    ],
  };

  const products = await Product.find(searchQuery)
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit)
    .select("name price images slug rating");

  const totalProducts = await Product.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
      searchQuery: q,
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
});

// Admin functions

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: {
      product,
    },
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: {
      product,
    },
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  // Soft delete - mark as inactive
  product.isActive = false;
  await product.save();

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});

// @desc    Get all products for admin
// @route   GET /api/products/admin/all
// @access  Private/Admin
const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build filter
  let filter = {};

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { category: { $regex: req.query.search, $options: "i" } },
      { brand: { $regex: req.query.search, $options: "i" } },
    ];
  }

  if (req.query.category) {
    filter.category = { $regex: req.query.category, $options: "i" };
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === "true";
  }

  if (req.query.isFeatured !== undefined) {
    filter.isFeatured = req.query.isFeatured === "true";
  }

  // Build sort
  let sortBy = { createdAt: -1 };
  if (req.query.sort) {
    switch (req.query.sort) {
      case "name":
        sortBy = { name: 1 };
        break;
      case "price-low":
        sortBy = { price: 1 };
        break;
      case "price-high":
        sortBy = { price: -1 };
        break;
      case "stock-low":
        sortBy = { stock: 1 };
        break;
      case "oldest":
        sortBy = { createdAt: 1 };
        break;
      default:
        sortBy = { createdAt: -1 };
    }
  }

  // Get products with pagination
  const products = await Product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  // Get total count
  const totalProducts = await Product.countDocuments(filter);

  // Calculate pagination info
  const totalPages = Math.ceil(totalProducts / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(200).json({
    status: "success",
    results: products.length,
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
    },
  });
});

// @desc    Toggle product featured status
// @route   PUT /api/products/:id/featured
// @access  Private/Admin
const toggleFeatured = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  product.isFeatured = !product.isFeatured;
  await product.save();

  res.status(200).json({
    status: "success",
    message: `Product ${
      product.isFeatured ? "added to" : "removed from"
    } featured`,
    data: {
      product,
    },
  });
});

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
const updateStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;

  if (stock < 0) {
    return res.status(400).json({
      status: "error",
      message: "Stock cannot be negative",
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock },
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Stock updated successfully",
    data: {
      product,
    },
  });
});

module.exports = {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getNewArrivals,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  toggleFeatured,
  updateStock,
};
