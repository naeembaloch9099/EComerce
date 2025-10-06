const crypto = require("crypto");
const { asyncHandler } = require("../middleware/errorHandler");
const User = require("../models/User");
const { sendTokenResponse } = require("../utils/jwtUtils");
const {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOTPEmail,
} = require("../utils/emailService");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      status: "error",
      message: "User already exists with this email",
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send welcome email with verification link
  try {
    await sendWelcomeEmail(user.email, user.name, verificationToken);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Don't fail registration if email fails
  }

  // Send token response
  sendTokenResponse(
    user,
    201,
    res,
    "User registered successfully. Please check your email to verify your account."
  );
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user (include password field)
  const user = await User.findOne({ email }).select(
    "+password +loginAttempts +lockUntil"
  );

  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Invalid credentials",
    });
  }

  // Check if account is locked
  if (user.isLocked) {
    return res.status(423).json({
      status: "error",
      message:
        "Account temporarily locked due to too many failed login attempts. Please try again later.",
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(401).json({
      status: "error",
      message: "Account has been deactivated. Please contact support.",
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    // Increment login attempts
    await user.incLoginAttempts();

    return res.status(401).json({
      status: "error",
      message: "Invalid credentials",
    });
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Send token response
  sendTokenResponse(user, 200, res, "Login successful");
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach((key) => {
    if (fieldsToUpdate[key] === undefined) {
      delete fieldsToUpdate[key];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "User details updated successfully",
    data: {
      user,
    },
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return res.status(401).json({
      status: "error",
      message: "Current password is incorrect",
    });
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, "Password updated successfully");
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "There is no user with that email",
    });
  }

  // Get reset token
  const resetToken = user.generatePasswordResetToken();

  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.status(200).json({
      status: "success",
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("Password reset email failed:", error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: "error",
      message: "Email could not be sent",
    });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }

  // Set new password
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, "Password reset successful");
});

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  // Get hashed token
  const emailVerificationToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: emailVerificationToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired verification token",
    });
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
});

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Private
const resendVerification = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.isEmailVerified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  // Generate new verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendWelcomeEmail(user.email, user.name, verificationToken);

    res.status(200).json({
      status: "success",
      message: "Verification email sent",
    });
  } catch (error) {
    console.error("Verification email failed:", error);
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: "error",
      message: "Email could not be sent",
    });
  }
});

// @desc    Send OTP for verification
// @route   POST /api/auth/send-otp
// @access  Private
const sendOTP = asyncHandler(async (req, res) => {
  const user = req.user;

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in user document (in production, use Redis)
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  try {
    await sendOTPEmail(user.email, user.name, otp);

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP email failed:", error);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: "error",
      message: "OTP could not be sent",
    });
  }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Private
const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const user = req.user;

  if (!otp) {
    return res.status(400).json({
      status: "error",
      message: "OTP is required",
    });
  }

  // Get user with OTP fields
  const userWithOtp = await User.findById(user.id).select("+otp +otpExpires");

  if (!userWithOtp.otp || !userWithOtp.otpExpires) {
    return res.status(400).json({
      status: "error",
      message: "No OTP found. Please request a new one.",
    });
  }

  if (userWithOtp.otpExpires < Date.now()) {
    return res.status(400).json({
      status: "error",
      message: "OTP has expired. Please request a new one.",
    });
  }

  if (userWithOtp.otp !== otp) {
    return res.status(400).json({
      status: "error",
      message: "Invalid OTP",
    });
  }

  // Clear OTP
  userWithOtp.otp = undefined;
  userWithOtp.otpExpires = undefined;
  await userWithOtp.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "OTP verified successfully",
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  sendOTP,
  verifyOTP,
};
