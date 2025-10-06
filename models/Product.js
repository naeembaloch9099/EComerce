const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Review comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [2000, "Product description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    comparePrice: {
      type: Number,
      min: [0, "Compare price cannot be negative"],
      validate: {
        validator: function (v) {
          return !v || v > this.price;
        },
        message: "Compare price must be greater than selling price",
      },
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: [
          "men",
          "women",
          "kids",
          "accessories",
          "shoes",
          "electronics",
          "home",
          "sports",
        ],
        message: "Please select a valid category",
      },
    },
    subcategory: {
      type: String,
      required: [true, "Product subcategory is required"],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: "Rabbit",
    },
    gender: {
      type: String,
      enum: ["men", "women", "unisex", "kids"],
      default: "unisex",
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "",
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    sizes: [
      {
        size: {
          type: String,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: [0, "Stock cannot be negative"],
        },
      },
    ],
    colors: [
      {
        name: {
          type: String,
          required: true,
        },
        code: {
          type: String,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: [0, "Stock cannot be negative"],
        },
      },
    ],
    totalStock: {
      type: Number,
      required: [true, "Total stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    sku: {
      type: String,
      required: false, // Auto-generated, not required from user
      unique: true,
      trim: true,
      uppercase: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: {
      type: Map,
      of: String,
    },
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
    salePrice: {
      type: Number,
      min: [0, "Sale price cannot be negative"],
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, "Meta title cannot exceed 60 characters"],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ slug: 1 });

// Virtual for discounted price
productSchema.virtual("discountedPrice").get(function () {
  if (this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return this.salePrice || this.price;
});

// Virtual for primary image
productSchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  return primary || this.images[0] || null;
});

// Virtual for availability status
productSchema.virtual("isAvailable").get(function () {
  return this.isActive && this.totalStock > 0;
});

// Pre-save middleware to generate slug and SKU
productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Auto-generate SKU if not provided
  if (!this.sku || this.isNew) {
    this.sku = `${this.category.toUpperCase()}-${Date.now()}`;
  }

  // Calculate sale price if discount is provided
  if (this.discount > 0) {
    this.salePrice = Math.round(this.price * (1 - this.discount / 100));
  }

  next();
});

// Pre-save middleware to update total stock
productSchema.pre("save", function (next) {
  if (this.isModified("sizes") || this.isModified("colors")) {
    let totalStock = 0;

    // Calculate from sizes
    if (this.sizes && this.sizes.length > 0) {
      totalStock += this.sizes.reduce((sum, size) => sum + size.stock, 0);
    }

    // Calculate from colors
    if (this.colors && this.colors.length > 0) {
      totalStock += this.colors.reduce((sum, color) => sum + color.stock, 0);
    }

    // If no sizes or colors, use the existing totalStock
    if (this.sizes.length === 0 && this.colors.length === 0) {
      totalStock = this.totalStock || 0;
    }

    this.totalStock = totalStock;
  }

  next();
});

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    this.numReviews = this.reviews.length;
  }
};

// Method to add review
productSchema.methods.addReview = function (userId, userName, rating, comment) {
  // Check if user already reviewed this product
  const existingReview = this.reviews.find(
    (review) => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    // Add new review
    this.reviews.push({
      user: userId,
      name: userName,
      rating,
      comment,
    });
  }

  this.calculateAverageRating();
};

// Method to increment view count
productSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Method to update stock after purchase
productSchema.methods.updateStock = function (size, color, quantity) {
  if (size) {
    const sizeItem = this.sizes.find((s) => s.size === size);
    if (sizeItem && sizeItem.stock >= quantity) {
      sizeItem.stock -= quantity;
    }
  }

  if (color) {
    const colorItem = this.colors.find((c) => c.name === color);
    if (colorItem && colorItem.stock >= quantity) {
      colorItem.stock -= quantity;
    }
  }

  this.totalStock = Math.max(0, this.totalStock - quantity);
  this.soldCount += quantity;
};

module.exports = mongoose.model("Product", productSchema);
