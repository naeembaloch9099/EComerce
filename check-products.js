const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const checkProducts = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to database");

    console.log("📦 Checking products in database...");

    // Get all products (including inactive ones)
    const allProducts = await Product.find({});
    console.log(`📊 Total products in database: ${allProducts.length}`);

    // Get only active products
    const activeProducts = await Product.find({ isActive: true });
    console.log(`✅ Active products: ${activeProducts.length}`);

    // Get inactive products
    const inactiveProducts = await Product.find({ isActive: false });
    console.log(`❌ Inactive products: ${inactiveProducts.length}`);

    if (allProducts.length > 0) {
      console.log("\n📋 Product details:");
      allProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   - ID: ${product._id}`);
        console.log(`   - Active: ${product.isActive}`);
        console.log(`   - Category: ${product.category}`);
        console.log(`   - Price: $${product.price}`);
        console.log(`   - Stock: ${product.totalStock}`);
        console.log(`   - Images: ${product.images?.length || 0} images`);
        if (product.images?.length > 0) {
          console.log(`   - First image: ${product.images[0].url}`);
        }
        console.log("");
      });
    } else {
      console.log("⚠️  No products found in database!");
      console.log("💡 You need to add products through the admin panel first.");
    }

    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkProducts();
