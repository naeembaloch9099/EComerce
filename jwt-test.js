// Quick refresh token test
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-super-secret-jwt-key-for-rabbit-ecommerce-2024";

// Test refresh token generation and verification
const testPayload = {
  id: "12345",
  email: "admin@test.com",
  role: "admin",
};

console.log("🔍 Testing 7-day refresh token generation...");
const refreshToken = jwt.sign(testPayload, JWT_SECRET, { expiresIn: "7d" });
console.log(
  "✅ Refresh token generated:",
  refreshToken.substring(0, 50) + "..."
);
console.log("🔍 Token length:", refreshToken.length);

console.log("\n🔍 Testing refresh token verification...");
try {
  const decoded = jwt.verify(refreshToken, JWT_SECRET);
  console.log("✅ Refresh token verified successfully:", {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
    expiresIn:
      Math.round((decoded.exp - Date.now() / 1000) / (24 * 60 * 60)) + " days",
  });
} catch (error) {
  console.log("❌ Refresh token verification failed:", error.message);
}
