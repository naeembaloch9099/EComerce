const mongoose = require("mongoose");
const Order = require("./models/Order");
const Product = require("./models/Product");
const User = require("./models/User");
require("dotenv").config();

const checkOrdersAndReviews = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to database");

    console.log("\n📦 Checking orders...");

    // Get all orders
    const allOrders = await Order.find({});
    console.log(`📊 Total orders: ${allOrders.length}`);

    // Check delivered orders
    const deliveredOrders = await Order.find({ status: "delivered" });
    console.log(`✅ Delivered orders: ${deliveredOrders.length}`);

    if (deliveredOrders.length > 0) {
      console.log("\n🚚 Delivered orders:");
      for (const order of deliveredOrders) {
        console.log(`- Order ${order.orderNumber}`);
        console.log(`  Status: ${order.status}`);
        console.log(`  User ID: ${order.user}`);
        console.log(`  Items: ${order.orderItems.length}`);
        order.orderItems.forEach((item, index) => {
          console.log(
            `    ${index + 1}. Product ID: ${item.product}, Name: ${item.name}`
          );
        });
        console.log("");
      }
    }

    console.log("\n⭐ Checking reviews...");
    const productsWithReviews = await Product.find({
      "reviews.0": { $exists: true },
    });
    console.log(`📊 Products with reviews: ${productsWithReviews.length}`);

    let totalReviews = 0;
    productsWithReviews.forEach((product) => {
      totalReviews += product.reviews.length;
      console.log(`- ${product.name}: ${product.reviews.length} reviews`);
    });
    console.log(`📊 Total reviews: ${totalReviews}`);

    // Test the purchase verification logic
    if (deliveredOrders.length > 0) {
      const testOrder = deliveredOrders[0];
      const testUserId = testOrder.user;
      const testProductId = testOrder.orderItems[0]?.product;

      if (testProductId) {
        console.log(
          `\n🧪 Testing purchase verification for User: ${testUserId}, Product: ${testProductId}`
        );

        const hasPurchased = await Order.findOne({
          user: testUserId,
          "orderItems.product": testProductId,
          status: "delivered",
        });

        console.log(
          `Result: ${hasPurchased ? "CAN REVIEW ✅" : "CANNOT REVIEW ❌"}`
        );
      }
    }

    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from database");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkOrdersAndReviews();
