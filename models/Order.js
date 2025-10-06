const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: false, // Allow null for generic items
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: false, // Not always available
  },
  sku: {
    type: String,
    required: false, // Not always available
  },
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: "Pakistan",
  },
});

const paymentResultSchema = new mongoose.Schema({
  id: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String },
  method: {
    type: String,
    enum: ["stripe", "paypal", "cod", "bank_transfer"],
    required: true,
  },
  transaction_id: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    orderKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["stripe", "paypal", "cod", "bank_transfer"],
    },
    paymentResult: paymentResultSchema,
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
      min: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      amount: {
        type: Number,
        default: 0,
        min: 0,
      },
      code: {
        type: String,
        trim: true,
      },
      type: {
        type: String,
        enum: ["percentage", "fixed"],
        default: "fixed",
      },
    },
    customerInfo: {
      name: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "returned",
      ],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    shippingCarrier: {
      type: String,
      trim: true,
    },
    estimatedDelivery: {
      type: Date,
    },
    cancelReason: {
      type: String,
      trim: true,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundReason: {
      type: String,
      trim: true,
    },
    refundedAt: {
      type: Date,
    },
    currency: {
      type: String,
      default: "PKR",
      enum: ["PKR", "USD", "EUR", "GBP"],
    },
    // Status tracking fields
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "refunded",
            "returned",
          ],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
        updatedBy: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
      },
    ],
    confirmedAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDelivered: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "paymentResult.transaction_id": 1 });

// Virtual for full name
orderSchema.virtual("shippingAddress.fullName").get(function () {
  if (!this.shippingAddress || !this.shippingAddress.firstName) {
    return "Unknown Customer";
  }
  return `${this.shippingAddress.firstName} ${
    this.shippingAddress.lastName || ""
  }`.trim();
});

// Virtual for formatted address
orderSchema.virtual("shippingAddress.fullAddress").get(function () {
  if (!this.shippingAddress) {
    return "No address provided";
  }
  const addr = this.shippingAddress;
  return `${addr.address || ""}, ${addr.city || ""}, ${addr.state || ""} ${
    addr.zipCode || ""
  }, ${addr.country || ""}`.trim();
});

// Virtual for order total items count
orderSchema.virtual("totalItems").get(function () {
  if (!this.orderItems || !Array.isArray(this.orderItems)) {
    return 0;
  }
  return this.orderItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );
});

// Virtual for can cancel status
orderSchema.virtual("canCancel").get(function () {
  return ["pending", "confirmed"].includes(this.status) && !this.isPaid;
});

// Virtual for can refund status
orderSchema.virtual("canRefund").get(function () {
  return this.isPaid && ["delivered", "shipped"].includes(this.status);
});

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Find the last order for today
    const lastOrder = await this.constructor
      .findOne({
        orderNumber: new RegExp(`^RBT${year}${month}${day}`),
      })
      .sort({ orderNumber: -1 });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    this.orderNumber = `RBT${year}${month}${day}${sequence
      .toString()
      .padStart(4, "0")}`;
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre("save", function (next) {
  // Calculate subtotal
  this.subtotal = this.orderItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate total price
  this.totalPrice =
    this.subtotal + this.taxPrice + this.shippingPrice - this.discount.amount;

  // Ensure total price is not negative
  this.totalPrice = Math.max(0, this.totalPrice);

  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus, notes = "") {
  const validTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered", "returned"],
    delivered: ["returned", "refunded"],
    cancelled: [],
    refunded: [],
    returned: ["refunded"],
  };

  if (!validTransitions[this.status].includes(newStatus)) {
    throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
  }

  this.status = newStatus;
  if (notes) this.notes = notes;

  // Auto-set delivery date if delivered
  if (newStatus === "delivered") {
    this.isDelivered = true;
    this.deliveredAt = new Date();
  }

  return this.save();
};

// Method to mark as paid
orderSchema.methods.markAsPaid = function (paymentResult) {
  this.isPaid = true;
  this.paidAt = new Date();
  this.paymentResult = paymentResult;

  // Auto-confirm order when payment is received
  if (this.status === "pending") {
    this.status = "confirmed";
  }

  return this.save();
};

// Method to calculate shipping cost
orderSchema.methods.calculateShipping = function () {
  const totalWeight = this.orderItems.reduce((weight, item) => {
    return weight + item.quantity * 0.5; // Assume 0.5kg per item
  }, 0);

  let shippingCost = 0;

  // Free shipping for orders over 5000 PKR
  if (this.subtotal >= 5000) {
    shippingCost = 0;
  } else if (totalWeight <= 1) {
    shippingCost = 200; // 200 PKR for light items
  } else if (totalWeight <= 5) {
    shippingCost = 350; // 350 PKR for medium items
  } else {
    shippingCost = 500; // 500 PKR for heavy items
  }

  this.shippingPrice = shippingCost;
  return shippingCost;
};

// Method to apply discount
orderSchema.methods.applyDiscount = function (
  discountCode,
  discountAmount,
  discountType = "fixed"
) {
  this.discount = {
    code: discountCode,
    amount: discountAmount,
    type: discountType,
  };

  if (discountType === "percentage") {
    this.discount.amount = (this.subtotal * discountAmount) / 100;
  }

  // Ensure discount doesn't exceed subtotal
  this.discount.amount = Math.min(this.discount.amount, this.subtotal);

  return this.save();
};

module.exports = mongoose.model("Order", orderSchema);
