const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { asyncHandler } = require("../middleware/errorHandler");
const { protect } = require("../middleware/auth");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

// @desc    Create Stripe payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
router.post(
  "/create-payment-intent",
  protect,
  asyncHandler(async (req, res) => {
    const { amount, currency = "pkr", orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Valid amount is required",
      });
    }

    try {
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to smallest currency unit (paisas for PKR)
        currency: currency.toLowerCase(),
        metadata: {
          userId: req.user._id.toString(),
          orderId: orderId || "",
          userEmail: req.user.email,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({
        status: "success",
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        },
      });
    } catch (error) {
      console.error("Stripe payment intent creation failed:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to create payment intent",
      });
    }
  })
);

// @desc    Confirm payment
// @route   POST /api/payments/confirm-payment
// @access  Private
router.post(
  "/confirm-payment",
  protect,
  asyncHandler(async (req, res) => {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        status: "error",
        message: "Payment Intent ID is required",
      });
    }

    try {
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          status: "error",
          message: "Payment was not successful",
        });
      }

      // If orderId is provided, update the order
      if (orderId) {
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).json({
            status: "error",
            message: "Order not found",
          });
        }

        if (order.user.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            status: "error",
            message: "Not authorized to update this order",
          });
        }

        if (!order.isPaid) {
          const paymentResult = {
            id: paymentIntent.id,
            status: "completed",
            update_time: new Date().toISOString(),
            email_address: req.user.email,
            method: "stripe",
            transaction_id: paymentIntent.id,
          };

          await order.markAsPaid(paymentResult);

          res.status(200).json({
            status: "success",
            message: "Payment confirmed and order updated",
            data: {
              order,
              paymentIntent: {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100,
              },
            },
          });
        } else {
          res.status(400).json({
            status: "error",
            message: "Order is already paid",
          });
        }
      } else {
        res.status(200).json({
          status: "success",
          message: "Payment confirmed",
          data: {
            paymentIntent: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount / 100,
            },
          },
        });
      }
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to confirm payment",
      });
    }
  })
);

// @desc    Create checkout session for cart
// @route   POST /api/payments/create-checkout-session
// @access  Private
router.post(
  "/create-checkout-session",
  protect,
  asyncHandler(async (req, res) => {
    const { shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Cart is empty",
      });
    }

    // Validate cart items and check stock
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        return res.status(400).json({
          status: "error",
          message: `Product ${
            item.product?.name || "Unknown"
          } is no longer available`,
        });
      }

      if (item.product.totalStock < item.quantity) {
        return res.status(400).json({
          status: "error",
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
    }

    try {
      // Prepare line items for Stripe
      const lineItems = cart.items.map((item) => ({
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.product.name,
            images: item.product.images?.[0]?.url
              ? [item.product.images[0].url]
              : [],
            metadata: {
              productId: item.product._id.toString(),
              size: item.size || "",
              color: item.color || "",
            },
          },
          unit_amount: Math.round(item.price * 100), // Convert to paisas
        },
        quantity: item.quantity,
      }));

      // Add shipping as a line item if applicable
      const shippingCost = cart.finalTotal >= 5000 ? 0 : 200; // Free shipping over 5000 PKR
      if (shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: "pkr",
            product_data: {
              name: "Shipping",
            },
            unit_amount: shippingCost * 100,
          },
          quantity: 1,
        });
      }

      // Apply discount if coupon is used
      const discounts = [];
      if (cart.discount.amount > 0) {
        // Create a coupon for the discount
        const coupon = await stripe.coupons.create({
          amount_off: Math.round(cart.discount.amount * 100),
          currency: "pkr",
          name: cart.couponCode || "Discount",
        });

        discounts.push({ coupon: coupon.id });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
        customer_email: req.user.email,
        metadata: {
          userId: req.user._id.toString(),
          cartId: cart._id.toString(),
          shippingAddress: JSON.stringify(shippingAddress),
        },
        discounts: discounts.length > 0 ? discounts : undefined,
        shipping_address_collection: {
          allowed_countries: ["PK", "US", "CA", "GB"],
        },
        billing_address_collection: "required",
      });

      res.status(200).json({
        status: "success",
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    } catch (error) {
      console.error("Stripe checkout session creation failed:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to create checkout session",
      });
    }
  })
);

// @desc    Handle successful checkout
// @route   POST /api/payments/checkout-success
// @access  Private
router.post(
  "/checkout-success",
  protect,
  asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        status: "error",
        message: "Session ID is required",
      });
    }

    try {
      // Retrieve the checkout session
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        return res.status(400).json({
          status: "error",
          message: "Payment was not successful",
        });
      }

      // Get cart and shipping address from session metadata
      const cartId = session.metadata.cartId;
      const shippingAddress = JSON.parse(session.metadata.shippingAddress);

      const cart = await Cart.findById(cartId).populate("items.product");

      if (!cart || cart.user.toString() !== req.user._id.toString()) {
        return res.status(404).json({
          status: "error",
          message: "Cart not found",
        });
      }

      // Create order from cart
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image:
          item.product.primaryImage?.url || item.product.images[0]?.url || "",
        sku: item.product.sku,
      }));

      const shippingPrice = cart.finalTotal >= 5000 ? 0 : 200;
      const taxPrice = 0; // Add tax calculation if needed

      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod: "stripe",
        subtotal: cart.totalPrice,
        shippingPrice,
        taxPrice,
        totalPrice: session.amount_total / 100, // Convert from paisas
        discount: cart.discount,
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          id: session.payment_intent,
          status: "completed",
          update_time: new Date().toISOString(),
          email_address: session.customer_email,
          method: "stripe",
          transaction_id: session.payment_intent,
        },
      });

      const savedOrder = await order.save();

      // Update product stock
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.updateStock(item.size, item.color, item.quantity);
          await product.save();
        }
      }

      // Clear cart
      await cart.clearCart();

      res.status(200).json({
        status: "success",
        message: "Order created successfully",
        data: {
          order: savedOrder,
        },
      });
    } catch (error) {
      console.error("Checkout success handling failed:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to process successful checkout",
      });
    }
  })
);

// @desc    Create payment intent for order
// @route   POST /api/payments/order-payment-intent
// @access  Private
router.post(
  "/order-payment-intent",
  protect,
  asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        status: "error",
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to pay for this order",
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        status: "error",
        message: "Order is already paid",
      });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100),
        currency: "pkr",
        metadata: {
          userId: req.user._id.toString(),
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          userEmail: req.user.email,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({
        status: "success",
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: order.totalPrice,
        },
      });
    } catch (error) {
      console.error("Order payment intent creation failed:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to create payment intent for order",
      });
    }
  })
);

// @desc    Get Stripe publishable key
// @route   GET /api/payments/config
// @access  Public
router.get("/config", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  });
});

// @desc    Webhook endpoint for Stripe events
// @route   POST /api/payments/webhook
// @access  Public (but secured by Stripe signature)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);

        // Update order if needed
        if (paymentIntent.metadata.orderId) {
          try {
            const order = await Order.findById(paymentIntent.metadata.orderId);
            if (order && !order.isPaid) {
              await order.markAsPaid({
                id: paymentIntent.id,
                status: "completed",
                update_time: new Date().toISOString(),
                email_address: paymentIntent.metadata.userEmail,
                method: "stripe",
                transaction_id: paymentIntent.id,
              });
            }
          } catch (error) {
            console.error("Error updating order after payment success:", error);
          }
        }
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("Payment failed:", failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  })
);

module.exports = router;
