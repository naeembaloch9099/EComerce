const jwt = require("jsonwebtoken");

// Generate JWT token (now using refresh token approach)
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Generate refresh token (7 days only)
const generateRefreshToken = (userId) => {
  const payload = { id: userId };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d", // 7-day refresh token only
  });
};

// Generate token and send response (using 7-day refresh token only)
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  // Create token with user info including role
  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  console.log("🔑 Generating 7-day refresh token with payload:", tokenPayload);
  const token = generateToken(tokenPayload);
  console.log("🔑 Generated refresh token:", token.substring(0, 50) + "...");
  console.log("🔑 Token length:", token.length);

  // Cookie options for 7-day token
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).cookie("refreshToken", token, options).json({
    status: "success",
    message,
    refreshToken: token, // Now calling it refreshToken
    data: {
      user,
    },
  });
};

// Extract refresh token from request
const extractToken = (req) => {
  let token;

  // Check header for refresh token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check cookie for refresh token
  else if (req.cookies && req.cookies.refreshToken) {
    token = req.cookies.refreshToken;
  }

  return token;
};

// Decode token without verification (for expired tokens)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Generate short-lived token for specific actions
const generateActionToken = (payload, expiresIn = "10m") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Blacklist for invalidated tokens (in production, use Redis)
const tokenBlacklist = new Set();

// Add token to blacklist
const blacklistToken = (token) => {
  tokenBlacklist.add(token);
};

// Check if token is blacklisted
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

// Clear expired tokens from blacklist (cleanup function)
const cleanupBlacklist = () => {
  const tokens = Array.from(tokenBlacklist);
  tokens.forEach((token) => {
    if (isTokenExpired(token)) {
      tokenBlacklist.delete(token);
    }
  });
};

// Run cleanup every hour
setInterval(cleanupBlacklist, 60 * 60 * 1000);

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  sendTokenResponse,
  extractToken,
  decodeToken,
  isTokenExpired,
  generateActionToken,
  blacklistToken,
  isTokenBlacklisted,
};
