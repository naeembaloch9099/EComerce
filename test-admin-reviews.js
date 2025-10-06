const fetch = require("node-fetch");

async function testAdminReviewsEndpoint() {
  try {
    console.log("🔍 Testing admin reviews endpoint...");

    const API_URL = "http://localhost:5000";

    // Test without authentication first
    console.log("\n1️⃣ Testing without authentication...");
    const responseNoAuth = await fetch(`${API_URL}/api/products/admin/reviews`);
    console.log("Status:", responseNoAuth.status);
    const dataNoAuth = await responseNoAuth.json();
    console.log("Response:", dataNoAuth);

    // You'll need to add a valid refresh token here to test with auth
    console.log(
      "\n2️⃣ To test with authentication, you need a valid refresh token from localStorage"
    );
    console.log(
      'Check your browser\'s localStorage for "refreshToken" when logged in as admin'
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAdminReviewsEndpoint();
