const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    readAt: {
      type: Date,
    },
    repliedAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    replyInfo: {
      repliedAt: {
        type: Date,
      },
      replySubject: {
        type: String,
        trim: true,
      },
      replyMessage: {
        type: String,
        trim: true,
      },
      repliedBy: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

// Virtual for formatted date
contactSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Method to mark as read
contactSchema.methods.markAsRead = function () {
  this.status = "read";
  this.readAt = new Date();
  return this.save();
};

// Method to mark as replied
contactSchema.methods.markAsReplied = function () {
  this.status = "replied";
  this.repliedAt = new Date();
  return this.save();
};

// Static method to get unread count
contactSchema.statics.getUnreadCount = function () {
  return this.countDocuments({ status: "new" });
};

// Static method to get recent messages
contactSchema.statics.getRecentMessages = function (limit = 5) {
  return this.find({ status: "new" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("name email subject createdAt priority");
};

module.exports = mongoose.model("Contact", contactSchema);
