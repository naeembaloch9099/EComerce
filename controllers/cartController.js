const { asyncHandler } = require("../middleware/errorHandler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product",
    "name price images slug stock isActive"
  );

  if (!cart) {
    // Create empty cart if doesn't exist
    cart = await Cart.create({
      user: req.user.id,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  }

  // Filter out inactive products and update cart
  const activeItems = cart.items.filter(
    (item) => item.product && item.product.isActive
  );

  if (activeItems.length !== cart.items.length) {
    cart.items = activeItems;
    await cart.save();
  }

  res.status(200).json({
    status: "success",
    data: {
      cart: {
        ...cart.toObject(),
        summary: cart.getSummary(),
      },
    },
  });
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant = {} } = req.body;

  // Validate product
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  if (!product.isActive) {
    return res.status(400).json({
      status: "error",
      message: "Product is not available",
    });
  }

  if (product.stock < quantity) {
    return res.status(400).json({
      status: "error",
      message: `Insufficient stock. Available: ${product.stock}`,
    });
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({
      user: req.user.id,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (existingItemIndex > -1) {
    // Update existing item
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    if (newQuantity > product.stock) {
      return res.status(400).json({
        status: "error",
        message: `Cannot add more items. Maximum available: ${product.stock}`,
      });
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      variant,
      price: product.price,
    });
  }

  await cart.save();

  // Populate and return updated cart
  await cart.populate("items.product", "name price images slug stock");

  res.status(200).json({
    status: "success",
    message: "Item added to cart successfully",
    data: {
      cart: {
        ...cart.toObject(),
        summary: cart.getSummary(),
      },
    },
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity, variant = {} } = req.body;

  if (quantity < 0) {
    return res.status(400).json({
      status: "error",
      message: "Quantity cannot be negative",
    });
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      status: "error",
      message: "Cart not found",
    });
  }

  // Find the item to update
  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (itemIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Item not found in cart",
    });
  }

  // Check stock availability
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      status: "error",
      message: `Insufficient stock. Available: ${product.stock}`,
    });
  }

  if (quantity === 0) {
    // Remove item if quantity is 0
    cart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();

  // Populate and return updated cart
  await cart.populate("items.product", "name price images slug stock");

  res.status(200).json({
    status: "success",
    message: "Cart updated successfully",
    data: {
      cart: {
        ...cart.toObject(),
        summary: cart.getSummary(),
      },
    },
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { variant = {} } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      status: "error",
      message: "Cart not found",
    });
  }

  // Find and remove the item
  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (itemIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Item not found in cart",
    });
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  // Populate and return updated cart
  await cart.populate("items.product", "name price images slug stock");

  res.status(200).json({
    status: "success",
    message: "Item removed from cart successfully",
    data: {
      cart: {
        ...cart.toObject(),
        summary: cart.getSummary(),
      },
    },
  });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      status: "error",
      message: "Cart not found",
    });
  }

  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: {
      cart: {
        ...cart.toObject(),
        summary: cart.getSummary(),
      },
    },
  });
});

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
const getCartSummary = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(200).json({
      status: "success",
      data: {
        summary: {
          totalItems: 0,
          subtotal: 0,
          finalTotal: 0,
          isEmpty: true,
        },
      },
    });
  }

  const summary = cart.getSummary();

  res.status(200).json({
    status: "success",
    data: {
      summary,
    },
  });
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;

  if (!couponCode) {
    return res.status(400).json({
      status: "error",
      message: "Coupon code is required",
    });
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Cart is empty",
    });
  }

  // Simple coupon validation (in real app, you'd have a Coupon model)
  const validCoupons = {
    SAVE10: { type: "percentage", value: 10, minAmount: 50 },
    FLAT20: { type: "fixed", value: 20, minAmount: 100 },
    NEWUSER: { type: "percentage", value: 15, minAmount: 0 },
  };

  const coupon = validCoupons[couponCode.toUpperCase()];

  if (!coupon) {
    return res.status(400).json({
      status: "error",
      message: "Invalid coupon code",
    });
  }

  const subtotal = cart.totalPrice;

  if (subtotal < coupon.minAmount) {
    return res.status(400).json({
      status: "error",
      message: `Minimum order amount of $${coupon.minAmount} required for this coupon`,
    });
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.type === "percentage") {
    discountAmount = (subtotal * coupon.value) / 100;
  } else {
    discountAmount = coupon.value;
  }

  // Ensure discount doesn't exceed cart total
  discountAmount = Math.min(discountAmount, subtotal);

  cart.coupon = {
    code: couponCode.toUpperCase(),
    type: coupon.type,
    value: coupon.value,
    discountAmount,
  };

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    data: {
      coupon: cart.coupon,
      summary: cart.getSummary(),
    },
  });
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      status: "error",
      message: "Cart not found",
    });
  }

  cart.coupon = undefined;
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Coupon removed successfully",
    data: {
      summary: cart.getSummary(),
    },
  });
});

// @desc    Validate cart items before checkout
// @route   POST /api/cart/validate
// @access  Private
const validateCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product",
    "name price stock isActive"
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Cart is empty",
    });
  }

  const validationErrors = [];
  const validItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      validationErrors.push(`Product no longer exists`);
      continue;
    }

    if (!product.isActive) {
      validationErrors.push(`${product.name} is no longer available`);
      continue;
    }

    if (product.stock < item.quantity) {
      validationErrors.push(
        `${product.name}: Only ${product.stock} items available, but ${item.quantity} requested`
      );
      continue;
    }

    if (product.price !== item.price) {
      validationErrors.push(
        `${product.name}: Price has changed from $${item.price} to $${product.price}`
      );
      // Update the price in cart
      item.price = product.price;
    }

    validItems.push(item);
  }

  // Update cart with valid items only
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  const isValid = validationErrors.length === 0;

  res.status(isValid ? 200 : 400).json({
    status: isValid ? "success" : "error",
    message: isValid ? "Cart is valid" : "Cart validation failed",
    data: {
      isValid,
      errors: validationErrors,
      cart: isValid
        ? {
            ...cart.toObject(),
            summary: cart.getSummary(),
          }
        : undefined,
    },
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
  applyCoupon,
  removeCoupon,
  validateCart,
};
