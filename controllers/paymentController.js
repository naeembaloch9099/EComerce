const { asyncHandler } = require("../middleware/errorHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = "usd", orderId } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      status: "error",
      message: "Invalid amount",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: req.user.id,
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
      message: "Payment intent creation failed",
      details: error.message,
    });
  }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm-payment
// @access  Private
const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({
      status: "error",
      message: "Payment intent ID is required",
    });
  }

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        status: "error",
        message: "Payment not successful",
        paymentStatus: paymentIntent.status,
      });
    }

    // Update order if orderId is provided
    if (orderId) {
      const order = await Order.findById(orderId);

      if (order && order.user.toString() === req.user.id) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          paymentMethod: "stripe",
        };

        await order.save();
      }
    }

    res.status(200).json({
      status: "success",
      message: "Payment confirmed successfully",
      data: {
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
        },
      },
    });
  } catch (error) {
    console.error("Payment confirmation failed:", error);

    res.status(500).json({
      status: "error",
      message: "Payment confirmation failed",
      details: error.message,
    });
  }
});

// @desc    Create checkout session
// @route   POST /api/payments/create-checkout-session
// @access  Private
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { items, successUrl, cancelUrl, orderId } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Invalid items",
    });
  }

  try {
    // Validate items and create line items for Stripe
    const lineItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product || !product.isActive) {
        return res.status(400).json({
          status: "error",
          message: `Product ${item.name || item.productId} is not available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: "error",
          message: `Insufficient stock for ${product.name}`,
        });
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.images.slice(0, 1), // Stripe accepts max 8 images
            description: product.description?.substring(0, 300) || "",
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        successUrl ||
        `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        userId: req.user.id,
        orderId: orderId || "",
        userEmail: req.user.email,
      },
      customer_email: req.user.email,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error("Checkout session creation failed:", error);

    res.status(500).json({
      status: "error",
      message: "Checkout session creation failed",
      details: error.message,
    });
  }
});

// @desc    Retrieve checkout session
// @route   GET /api/payments/checkout-session/:sessionId
// @access  Private
const getCheckoutSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.status(200).json({
      status: "success",
      data: {
        session: {
          id: session.id,
          payment_status: session.payment_status,
          amount_total: session.amount_total / 100,
          currency: session.currency,
          customer_email: session.customer_email,
          payment_intent: session.payment_intent,
        },
      },
    });
  } catch (error) {
    console.error("Failed to retrieve checkout session:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve checkout session",
      details: error.message,
    });
  }
});

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public (but verified by Stripe signature)
const handleWebhook = asyncHandler(async (req, res) => {
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
      console.log("PaymentIntent succeeded:", paymentIntent.id);

      // Update order status if orderId exists in metadata
      if (paymentIntent.metadata.orderId) {
        try {
          const order = await Order.findById(paymentIntent.metadata.orderId);
          if (order) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
              paymentMethod: "stripe",
            };
            await order.save();
          }
        } catch (error) {
          console.error("Failed to update order:", error);
        }
      }
      break;

    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Checkout session completed:", session.id);

      // Handle successful checkout session
      if (session.metadata.orderId) {
        try {
          const order = await Order.findById(session.metadata.orderId);
          if (order) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
              id: session.payment_intent,
              status: "succeeded",
              amount: session.amount_total / 100,
              currency: session.currency,
              paymentMethod: "stripe",
            };
            await order.save();
          }
        } catch (error) {
          console.error("Failed to update order from webhook:", error);
        }
      }
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      console.log("Payment failed:", failedPayment.id);
      // Handle failed payment
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
const getPaymentMethods = asyncHandler(async (req, res) => {
  try {
    // Get customer payment methods (if customer exists)
    const customer = await stripe.customers.list({
      email: req.user.email,
      limit: 1,
    });

    let paymentMethods = [];

    if (customer.data.length > 0) {
      const methods = await stripe.paymentMethods.list({
        customer: customer.data[0].id,
        type: "card",
      });

      paymentMethods = methods.data.map((pm) => ({
        id: pm.id,
        type: pm.type,
        card: {
          brand: pm.card.brand,
          last4: pm.card.last4,
          exp_month: pm.card.exp_month,
          exp_year: pm.card.exp_year,
        },
      }));
    }

    res.status(200).json({
      status: "success",
      data: {
        paymentMethods,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve payment methods:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve payment methods",
      details: error.message,
    });
  }
});

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private/Admin
const processRefund = asyncHandler(async (req, res) => {
  const { paymentIntentId, amount, reason } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({
      status: "error",
      message: "Payment intent ID is required",
    });
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
      reason: reason || "requested_by_customer",
    });

    res.status(200).json({
      status: "success",
      message: "Refund processed successfully",
      data: {
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          currency: refund.currency,
          status: refund.status,
          reason: refund.reason,
        },
      },
    });
  } catch (error) {
    console.error("Refund processing failed:", error);

    res.status(500).json({
      status: "error",
      message: "Refund processing failed",
      details: error.message,
    });
  }
});

module.exports = {
  createPaymentIntent,
  confirmPayment,
  createCheckoutSession,
  getCheckoutSession,
  handleWebhook,
  getPaymentMethods,
  processRefund,
};
