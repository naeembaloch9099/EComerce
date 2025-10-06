const { exec } = require("child_process");
const os = require("os");

console.log("🔍 MongoDB Connection Diagnostics\n");

// Get current IP address
const networkInterfaces = os.networkInterfaces();
console.log("🌐 Your Current IP Addresses:");
Object.keys(networkInterfaces).forEach((key) => {
  networkInterfaces[key].forEach((interface) => {
    if (interface.family === "IPv4" && !interface.internal) {
      console.log(`   ${key}: ${interface.address}`);
    }
  });
});

// Check external IP
console.log("\n🔍 Checking your external IP address...");
exec("curl -s https://api.ipify.org", (error, stdout, stderr) => {
  if (error) {
    console.log("❌ Could not get external IP:", error.message);
  } else {
    console.log(`🌍 External IP: ${stdout.trim()}`);
    console.log("\n💡 Add this IP to your MongoDB Atlas whitelist:");
    console.log(`   IP Address: ${stdout.trim()}`);
    console.log(`   Or use: 0.0.0.0/0 (allows all - development only)`);
  }

  console.log("\n📋 MongoDB Atlas Whitelist Steps:");
  console.log("1. Go to: https://cloud.mongodb.com/");
  console.log("2. Select your project");
  console.log("3. Go to Security → Network Access");
  console.log('4. Click "Add IP Address"');
  console.log("5. Either:");
  console.log('   - Click "Add Current IP Address" (automatic)');
  console.log("   - Or manually add your IP from above");
  console.log(
    "   - Or add 0.0.0.0/0 for development (not recommended for production)"
  );
  console.log("\n🔄 After adding, restart your server");
});

// Test MongoDB connection
console.log("\n🧪 Testing MongoDB connection...");
const mongoose = require("mongoose");

const testConnection = async () => {
  try {
    console.log("🔄 Attempting connection...");
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://nbcuilahore_db_user:nbcuilahore_db_user@cluster0.ldoqjb6.mongodb.net/rabbit-ecommerce?retryWrites=true&w=majority&appName=Cluster0",
      {
        serverSelectionTimeoutMS: 5000,
      }
    );
    console.log("✅ MongoDB connection successful!");
    await mongoose.disconnect();
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);

    if (error.message.includes("IP") || error.message.includes("whitelist")) {
      console.log("\n🚨 IP WHITELIST ISSUE DETECTED!");
      console.log("This is the most common MongoDB Atlas connection issue.");
      console.log(
        "Please follow the steps above to whitelist your IP address."
      );
    }
  }
};

testConnection();
