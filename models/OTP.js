const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
    },
    otpExpires: {
      type: Date,
      required: [true, "OTP expiry time is required"],
      index: { expires: 0 }, // MongoDB TTL index - documents will auto-delete when expired
    },
    purpose: {
      type: String,
      enum: ["signup", "password-reset", "email-verification"],
      default: "signup",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
otpSchema.index({ email: 1, purpose: 1 });

module.exports = mongoose.model("OTP", otpSchema);
