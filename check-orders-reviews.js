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

    console.log("\n📦 Checking orders in database...");

    // Get all orders
    const allOrders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.product", "name");
    console.log(`📊 Total orders in database: ${allOrders.length}`);

    if (allOrders.length > 0) {
      console.log("\n📋 Order details:");
      allOrders.forEach((order, index) => {
        console.log(`${index + 1}. Order ${order.orderNumber}`);
        console.log(
          `   - User: ${order.user?.name || "Unknown"} (${
            order.user?.email || "No email"
          })`
        );
        console.log(`   - Status: ${order.status}`);
        console.log(`   - Is Delivered: ${order.isDelivered}`);
        console.log(
          `   - Delivered At: ${order.deliveredAt || "Not delivered"}`
        );
        console.log(`   - Items: ${order.orderItems?.length || 0} items`);
        if (order.orderItems && order.orderItems.length > 0) {
          order.orderItems.forEach((item, itemIndex) => {
            console.log(
              `     ${itemIndex + 1}. ${item.name} (Product ID: ${
                item.product
              })`
            );
          });
        }
        console.log("");
      });

      // Check specifically for delivered orders
      const deliveredOrders = await Order.find({ status: "delivered" })
        .populate("user", "name email")
        .populate("orderItems.product", "name");
      console.log(`✅ Delivered orders: ${deliveredOrders.length}`);

      if (deliveredOrders.length > 0) {
        console.log("\n🚚 Delivered order details:");
        deliveredOrders.forEach((order, index) => {
          console.log(`${index + 1}. Order ${order.orderNumber}`);
          console.log(`   - User: ${order.user?.name || "Unknown"}`);
          console.log(`   - Items that can be reviewed:`);
          order.orderItems.forEach((item, itemIndex) => {
            console.log(
              `     ${itemIndex + 1}. ${item.name} (ID: ${item.product})`
            );
          });
          console.log("");
        });
      }
    } else {
      console.log("⚠️  No orders found in database!");
      console.log(
        "💡 You need to create some test orders and mark them as delivered."
      );
    }

    console.log("\n⭐ Checking existing reviews...");
    const productsWithReviews = await Product.find({
      "reviews.0": { $exists: true },
    }).select("name reviews");
    console.log(`📊 Products with reviews: ${productsWithReviews.length}`);

    let totalReviews = 0;
    productsWithReviews.forEach((product) => {
      totalReviews += product.reviews.length;
      console.log(`- ${product.name}: ${product.reviews.length} reviews`);
    });
    console.log(`📊 Total reviews in database: ${totalReviews}`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkOrdersAndReviews();
