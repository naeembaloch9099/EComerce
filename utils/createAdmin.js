const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      isEmailVerified: true,
      isActive: true,
    });

    await adminUser.save();

    console.log("🔑 Admin user created successfully");
    console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`🔒 Admin Password: ${process.env.ADMIN_PASSWORD}`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  }
};

module.exports = {
  createAdminUser,
};
