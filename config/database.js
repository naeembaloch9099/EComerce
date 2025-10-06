const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Simple, reliable connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log("🔄 Attempting to connect to MongoDB...");
    console.log(
      "🔗 Connection URI:",
      process.env.MONGODB_URI.replace(/\/\/.*:.*@/, "//***:***@")
    );

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
    console.log(`🌐 Connection State: ${conn.connection.readyState}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    // Check if it's an IP whitelist error
    if (error.message.includes("IP") || error.message.includes("whitelist")) {
      console.log(
        "💡 SOLUTION: Add your IP address to MongoDB Atlas whitelist:"
      );
      console.log("   1. Go to https://cloud.mongodb.com/");
      console.log("   2. Navigate to Security → Network Access");
      console.log("   3. Click 'Add IP Address' → 'Add Current IP Address'");
      console.log("   4. Or temporarily add 0.0.0.0/0 for development");
    }

    // For development, try to continue without database
    if (process.env.NODE_ENV === "development") {
      console.log(
        "⚠️  Development mode: Server will continue without database"
      );
      console.log("🔧 To fix: Update your IP whitelist in MongoDB Atlas");
      return;
    }

    process.exit(1);
  }
};

// Mongoose connection event handlers
mongoose.connection.on("connected", () => {
  console.log("📡 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("📴 Mongoose disconnected from MongoDB");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed due to app termination");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during MongoDB disconnection:", error);
    process.exit(1);
  }
});

module.exports = connectDB;
