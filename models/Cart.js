const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    max: [10, "Maximum quantity per item is 10"],
  },
  size: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    couponCode: {
      type: String,
      trim: true,
    },
    discount: {
      amount: {
        type: Number,
        default: 0,
        min: 0,
      },
      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ lastModified: 1 });

// Virtual for subtotal (before discount)
cartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// Virtual for final total (after discount)
cartSchema.virtual("finalTotal").get(function () {
  const subtotal = this.subtotal;
  return Math.max(0, subtotal - this.discount.amount);
});

// Pre-save middleware to update totals
cartSchema.pre("save", function (next) {
  // Calculate total items
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate total price (subtotal)
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Update last modified
  this.lastModified = new Date();

  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function (
  productId,
  quantity,
  size,
  color,
  price
) {
  // Check if item with same product, size, and color already exists
  const existingItem = this.items.find(
    (item) =>
      item.product.toString() === productId.toString() &&
      item.size === size &&
      item.color === color
  );

  if (existingItem) {
    // Update quantity of existing item
    existingItem.quantity = Math.min(10, existingItem.quantity + quantity);
    existingItem.price = price; // Update price in case it changed
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity: Math.min(10, quantity),
      size,
      color,
      price,
    });
  }

  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function (itemId, quantity) {
  const item = this.items.id(itemId);
  if (!item) {
    throw new Error("Cart item not found");
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    this.items.pull(itemId);
  } else {
    // Update quantity (max 10)
    item.quantity = Math.min(10, quantity);
  }

  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function (itemId) {
  this.items.pull(itemId);
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  this.couponCode = undefined;
  this.discount = { amount: 0, percentage: 0 };
  return this.save();
};

// Method to apply coupon
cartSchema.methods.applyCoupon = function (couponCode, discountPercentage) {
  this.couponCode = couponCode;
  this.discount.percentage = discountPercentage;
  this.discount.amount = (this.totalPrice * discountPercentage) / 100;
  return this.save();
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function () {
  this.couponCode = undefined;
  this.discount = { amount: 0, percentage: 0 };
  return this.save();
};

// Method to check if cart is empty
cartSchema.methods.isEmpty = function () {
  return this.items.length === 0;
};

// Method to get cart summary
cartSchema.methods.getSummary = function () {
  return {
    totalItems: this.totalItems,
    subtotal: this.totalPrice,
    discount: this.discount.amount,
    couponCode: this.couponCode,
    finalTotal: this.finalTotal,
    isEmpty: this.isEmpty(),
  };
};

// Static method to find or create cart for user
cartSchema.statics.findOrCreateCart = async function (userId) {
  let cart = await this.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = new this({ user: userId, items: [] });
    await cart.save();
  }

  return cart;
};

// Static method to cleanup abandoned carts (older than 30 days)
cartSchema.statics.cleanupAbandonedCarts = async function () {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await this.deleteMany({
    lastModified: { $lt: thirtyDaysAgo },
    totalItems: 0,
  });

  return result.deletedCount;
};

module.exports = mongoose.model("Cart", cartSchema);
