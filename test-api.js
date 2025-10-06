const fetch = require("node-fetch");

async function testProductsAPI() {
  try {
    console.log("🔍 Testing /api/products endpoint...");

    const response = await fetch("http://localhost:5000/api/products");
    const data = await response.json();

    console.log("📡 API Response Status:", response.status);
    console.log("📊 Response Structure:", {
      status: data.status,
      productCount: data.data?.products?.length || 0,
    });

    if (data.data && data.data.products) {
      console.log("\n📦 Products received:");
      data.data.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   - ID: ${product._id}`);
        console.log(`   - Category: ${product.category}`);
        console.log(`   - Active: ${product.isActive}`);
        console.log(`   - Price: $${product.price}`);
        console.log(`   - Images: ${product.images?.length || 0} images`);
        if (product.images && product.images[0]) {
          console.log(`   - First image URL: ${product.images[0].url}`);
        }
        console.log("");
      });
    } else {
      console.log("❌ No products in response");
    }
  } catch (error) {
    console.error("❌ Error testing API:", error.message);
  }
}

testProductsAPI();
