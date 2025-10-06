require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample users to add
const sampleUsers = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    password: "password123",
    role: "user",
    isActive: true,
    isEmailVerified: true,
    phone: "+1-555-0101",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: "password123",
    role: "user",
    isActive: true,
    isEmailVerified: true,
    phone: "+1-555-0102",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
  },
  {
    name: "Mike Davis",
    email: "mike.davis@example.com",
    password: "password123",
    role: "user",
    isActive: false,
    isEmailVerified: false,
    phone: "+1-555-0103",
    address: {
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
  },
  {
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    password: "password123",
    role: "user",
    isActive: true,
    isEmailVerified: true,
    phone: "+1-555-0104",
    address: {
      street: "321 Elm St",
      city: "Houston",
      state: "TX",
      zipCode: "77001",
      country: "USA",
    },
  },
  {
    name: "David Brown",
    email: "david.brown@example.com",
    password: "password123",
    role: "user",
    isActive: true,
    isEmailVerified: false,
    phone: "+1-555-0105",
    address: {
      street: "654 Maple Dr",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85001",
      country: "USA",
    },
  },
];

// Function to add sample users
const addSampleUsers = async () => {
  try {
    console.log("🔍 Checking existing users...");
    const existingUsers = await User.countDocuments({ role: "user" });
    console.log(`📊 Found ${existingUsers} existing regular users`);

    if (existingUsers >= 5) {
      console.log(
        "ℹ️  Sufficient users already exist. Skipping sample data creation."
      );
      console.log("💡 To reset users, delete some from the database first.");
      return;
    }

    console.log("👥 Adding sample users...");
    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      await user.save();
      console.log(`✅ Added: ${user.name} (${user.email})`);
    }

    console.log(`🎉 Sample users processing completed!`);
  } catch (error) {
    console.error("❌ Error adding sample users:", error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await addSampleUsers();

  const totalUsers = await User.countDocuments();
  const regularUsers = await User.countDocuments({ role: "user" });
  const adminUsers = await User.countDocuments({ role: "admin" });

  console.log("📊 Final user counts:");
  console.log(`   Total: ${totalUsers}`);
  console.log(`   Regular users: ${regularUsers}`);
  console.log(`   Admin users: ${adminUsers}`);
  console.log("🏁 Script completed");
  process.exit(0);
};

// Run the script
main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
