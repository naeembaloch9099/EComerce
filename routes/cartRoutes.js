const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { handleValidationErrors } = require("../middleware/errorHandler");
const { protect } = require("../middleware/auth");
const {
  validateCartItem,
  validateObjectId,
} = require("../middleware/validation");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOrCreateCart(req.user._id);
    await cart.populate(
      "items.product",
      "name price images totalStock isActive discountedPrice"
    );

    // Filter out inactive products and products with no stock
    cart.items = cart.items.filter(
      (item) =>
        item.product && item.product.isActive && item.product.totalStock > 0
    );

    // Recalculate totals after filtering
    await cart.save();

    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  })
);

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
router.post(
  "/items",
  protect,
  validateCartItem,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { productId, quantity, size, color } = req.body;

    // Check if product exists and is available
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

    // Check stock availability
    if (product.totalStock < quantity) {
      return res.status(400).json({
        status: "error",
        message: `Insufficient stock. Available: ${product.totalStock}`,
      });
    }

    // Check size-specific stock if size is provided
    if (size) {
      const sizeItem = product.sizes.find((s) => s.size === size);
      if (!sizeItem) {
        return res.status(400).json({
          status: "error",
          message: `Size ${size} is not available for this product`,
        });
      }
      if (sizeItem.stock < quantity) {
        return res.status(400).json({
          status: "error",
          message: `Insufficient stock for size ${size}. Available: ${sizeItem.stock}`,
        });
      }
    }

    // Check color-specific stock if color is provided
    if (color) {
      const colorItem = product.colors.find((c) => c.name === color);
      if (!colorItem) {
        return res.status(400).json({
          status: "error",
          message: `Color ${color} is not available for this product`,
        });
      }
      if (colorItem.stock < quantity) {
        return res.status(400).json({
          status: "error",
          message: `Insufficient stock for color ${color}. Available: ${colorItem.stock}`,
        });
      }
    }

    // Get or create cart
    const cart = await Cart.findOrCreateCart(req.user._id);

    // Use discounted price if available
    const price = product.discountedPrice || product.price;

    // Add item to cart
    await cart.addItem(productId, quantity, size, color, price);

    // Populate the cart with product details
    await cart.populate(
      "items.product",
      "name price images totalStock isActive discountedPrice"
    );

    res.status(200).json({
      status: "success",
      message: "Item added to cart successfully",
      data: {
        cart,
      },
    });
  })
);

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
router.put(
  "/items/:itemId",
  protect,
  validateObjectId("itemId"),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        status: "error",
        message: "Quantity must be a positive number",
      });
    }

    if (quantity > 10) {
      return res.status(400).json({
        status: "error",
        message: "Maximum quantity per item is 10",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        status: "error",
        message: "Cart item not found",
      });
    }

    // Check stock availability for new quantity
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    if (product.totalStock < quantity) {
      return res.status(400).json({
        status: "error",
        message: `Insufficient stock. Available: ${product.totalStock}`,
      });
    }

    // Check size/color specific stock if applicable
    if (item.size) {
      const sizeItem = product.sizes.find((s) => s.size === item.size);
      if (!sizeItem || sizeItem.stock < quantity) {
        return res.status(400).json({
          status: "error",
          message: `Insufficient stock for size ${item.size}. Available: ${
            sizeItem?.stock || 0
          }`,
        });
      }
    }

    if (item.color) {
      const colorItem = product.colors.find((c) => c.name === item.color);
      if (!colorItem || colorItem.stock < quantity) {
        return res.status(400).json({
          status: "error",
          message: `Insufficient stock for color ${item.color}. Available: ${
            colorItem?.stock || 0
          }`,
        });
      }
    }

    // Update quantity
    await cart.updateItemQuantity(req.params.itemId, quantity);
    await cart.populate(
      "items.product",
      "name price images totalStock isActive discountedPrice"
    );

    res.status(200).json({
      status: "success",
      message: "Cart item updated successfully",
      data: {
        cart,
      },
    });
  })
);

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
router.delete(
  "/items/:itemId",
  protect,
  validateObjectId("itemId"),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        status: "error",
        message: "Cart item not found",
      });
    }

    await cart.removeItem(req.params.itemId);
    await cart.populate(
      "items.product",
      "name price images totalStock isActive discountedPrice"
    );

    res.status(200).json({
      status: "success",
      message: "Item removed from cart successfully",
      data: {
        cart,
      },
    });
  })
);

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    await cart.clearCart();

    res.status(200).json({
      status: "success",
      message: "Cart cleared successfully",
      data: {
        cart,
      },
    });
  })
);

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
router.post(
  "/coupon",
  protect,
  asyncHandler(async (req, res) => {
    const { couponCode } = req.body;

    if (!couponCode) {
      return res.status(400).json({
        status: "error",
        message: "Coupon code is required",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Cart is empty",
      });
    }

    // Simple coupon validation (in production, you'd have a Coupon model)
    const validCoupons = {
      WELCOME10: { discount: 10, type: "percentage", minAmount: 1000 },
      SAVE20: { discount: 20, type: "percentage", minAmount: 2000 },
      FLAT500: { discount: 500, type: "fixed", minAmount: 3000 },
      NEWUSER: { discount: 15, type: "percentage", minAmount: 1500 },
    };

    const coupon = validCoupons[couponCode.toUpperCase()];

    if (!coupon) {
      return res.status(400).json({
        status: "error",
        message: "Invalid coupon code",
      });
    }

    if (cart.totalPrice < coupon.minAmount) {
      return res.status(400).json({
        status: "error",
        message: `Minimum order amount of PKR ${coupon.minAmount} required for this coupon`,
      });
    }

    // Check if coupon is already applied
    if (cart.couponCode === couponCode.toUpperCase()) {
      return res.status(400).json({
        status: "error",
        message: "Coupon is already applied",
      });
    }

    await cart.applyCoupon(couponCode.toUpperCase(), coupon.discount);
    await cart.populate(
      "items.product",
      "name price images totalStock isActive discountedPrice"
    );

    res.status(200).json({
      status: "success",
      message: "Coupon applied successfully",
      data: {
        cart,
        discount: {
          code: couponCode.toUpperCase(),
          amount: cart.discount.amount,
          percentage: cart.discount.percentage,
        },
      },
    });
  })
);

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
router.delete(
  "/coupon",
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    if (!cart.couponCode) {
      return res.status(400).json({
        status: "error",
        message: "No coupon applied to cart",
      });
    }

    await cart.removeCoupon();
    await cart.populate(
      "items.product",
      "name price images totalStock isActive discountedPrice"
    );

    res.status(200).json({
      status: "success",
      message: "Coupon removed successfully",
      data: {
        cart,
      },
    });
  })
);

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
router.get(
  "/summary",
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(200).json({
        status: "success",
        data: {
          summary: {
            totalItems: 0,
            subtotal: 0,
            discount: 0,
            couponCode: null,
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
  })
);

// @desc    Sync cart with local storage (for guest to user migration)
// @route   POST /api/cart/sync
// @access  Private
router.post(
  "/sync",
  protect,
  asyncHandler(async (req, res) => {
    const { items = [] } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        status: "error",
        message: "Items must be an array",
      });
    }

    const cart = await Cart.findOrCreateCart(req.user._id);

    // Clear existing cart
    await cart.clearCart();

    // Add items from local storage
    for (const item of items) {
      if (item.productId && item.quantity) {
        try {
          const product = await Product.findById(item.productId);
          if (
            product &&
            product.isActive &&
            product.totalStock >= item.quantity
          ) {
            const price = product.discountedPrice || product.price;
            await cart.addItem(
              item.productId,
              Math.min(item.quantity, 10), // Limit to max 10
              item.size,
              item.color,
              price
            );
          }
        } catch (error) {
          console.error("Error syncing cart item:", error);
          // Continue with next item
        }
      }
    }

    await cart.populate(
      "items.product",
      "name price images totalStock isActive discountedPrice"
    );

    res.status(200).json({
      status: "success",
      message: "Cart synced successfully",
      data: {
        cart,
      },
    });
  })
);

// @desc    Get cart count (for navbar)
// @route   GET /api/cart/count
// @access  Private
router.get(
  "/count",
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    const count = cart ? cart.totalItems : 0;

    res.status(200).json({
      status: "success",
      data: {
        count,
      },
    });
  })
);

module.exports = router;
