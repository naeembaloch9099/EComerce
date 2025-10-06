const mongoose = require("mongoose");
require("dotenv").config();

// Import the Product model
const Product = require("./models/Product");

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

// Sample products to add
const sampleProducts = [
  {
    name: "Classic Cotton T-Shirt",
    description:
      "Comfortable cotton t-shirt perfect for everyday wear. Made with premium quality fabric that ensures durability and comfort.",
    price: 29.99,
    category: "men",
    subcategory: "T-Shirts",
    brand: "RabbitWear",
    sku: "CCT-001",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        alt: "Classic Cotton T-Shirt Front View",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
        alt: "Classic Cotton T-Shirt Back View",
        isPrimary: false,
      },
    ],
    colors: [
      { name: "Black", code: "#000000", stock: 30 },
      { name: "White", code: "#FFFFFF", stock: 25 },
      { name: "Navy", code: "#000080", stock: 20 },
    ],
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 10 },
    ],
    totalStock: 150,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    tags: ["cotton", "casual", "comfortable"],
    averageRating: 4.5,
  },
  {
    name: "Denim Jacket",
    description:
      "Stylish denim jacket for a classic look. Perfect for layering and adds a timeless appeal to any outfit.",
    price: 89.99,
    category: "men",
    subcategory: "Jackets",
    brand: "RabbitWear",
    sku: "DJ-002",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516830110133-5ccc1c25bfb3?w=500",
        alt: "Denim Jacket Front View",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        alt: "Denim Jacket Side View",
        isPrimary: false,
      },
    ],
    colors: [
      { name: "Light Blue", code: "#ADD8E6", stock: 30 },
      { name: "Dark Blue", code: "#000080", stock: 20 },
    ],
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 },
    ],
    totalStock: 100,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    tags: ["denim", "jacket", "casual"],
    averageRating: 4.3,
  },
  {
    name: "Elegant Summer Dress",
    description:
      "Beautiful dress perfect for special occasions and summer events. Lightweight fabric with elegant design.",
    price: 129.99,
    category: "women",
    subcategory: "Dresses",
    brand: "RabbitWear",
    sku: "ESD-003",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
        alt: "Elegant Summer Dress Front View",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1566479179817-c1b7a7d1e1c1?w=500",
        alt: "Elegant Summer Dress Back View",
        isPrimary: false,
      },
    ],
    colors: [
      { name: "Black", code: "#000000", stock: 15 },
      { name: "Red", code: "#FF0000", stock: 15 },
      { name: "Navy", code: "#000080", stock: 15 },
    ],
    sizes: [
      { size: "XS", stock: 12 },
      { size: "S", stock: 15 },
      { size: "M", stock: 15 },
      { size: "L", stock: 12 },
    ],
    totalStock: 99,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    tags: ["dress", "elegant", "formal"],
    averageRating: 4.7,
  },
  {
    name: "Comfortable Sneakers",
    description:
      "Comfortable sneakers for daily activities and sports. Designed for maximum comfort and durability.",
    price: 79.99,
    category: "shoes",
    subcategory: "Casual",
    brand: "RabbitWear",
    sku: "CS-004",
    images: [
      {
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        alt: "Comfortable Sneakers Side View",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500",
        alt: "Comfortable Sneakers Top View",
        isPrimary: false,
      },
    ],
    colors: [
      { name: "White", code: "#FFFFFF", stock: 40 },
      { name: "Black", code: "#000000", stock: 35 },
    ],
    sizes: [
      { size: "7", stock: 12 },
      { size: "8", stock: 15 },
      { size: "9", stock: 15 },
      { size: "10", stock: 15 },
      { size: "11", stock: 12 },
      { size: "12", stock: 6 },
    ],
    totalStock: 150,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    tags: ["sneakers", "comfortable", "sports"],
    averageRating: 4.6,
  },
  {
    name: "Kids Colorful T-Shirt",
    description:
      "Colorful t-shirt designed for children. Soft fabric with fun designs that kids love.",
    price: 19.99,
    category: "kids",
    subcategory: "T-Shirts",
    brand: "RabbitWear",
    sku: "KCT-005",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
        alt: "Kids Colorful T-Shirt Front View",
        isPrimary: true,
      },
    ],
    colors: [
      { name: "Blue", code: "#0000FF", stock: 25 },
      { name: "Pink", code: "#FFC0CB", stock: 25 },
      { name: "Green", code: "#008000", stock: 25 },
    ],
    sizes: [
      { size: "2T", stock: 20 },
      { size: "3T", stock: 20 },
      { size: "4T", stock: 20 },
      { size: "5T", stock: 15 },
    ],
    totalStock: 150,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    tags: ["kids", "colorful", "cotton"],
    averageRating: 4.4,
  },
  {
    name: "Premium Leather Handbag",
    description:
      "Premium leather handbag for everyday use. Crafted with high-quality leather for durability and style.",
    price: 159.99,
    category: "accessories",
    subcategory: "Bags",
    brand: "RabbitWear",
    sku: "PLH-006",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        alt: "Premium Leather Handbag Front View",
        isPrimary: true,
      },
    ],
    colors: [
      { name: "Brown", code: "#8B4513", stock: 15 },
      { name: "Black", code: "#000000", stock: 10 },
    ],
    sizes: [{ size: "One Size", stock: 25 }],
    totalStock: 50,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    tags: ["leather", "handbag", "premium"],
    averageRating: 4.8,
  },
];

// Function to add sample products
const addSampleProducts = async () => {
  try {
    console.log("🔍 Checking existing products...");
    const existingProducts = await Product.countDocuments();
    console.log(`📊 Found ${existingProducts} existing products`);

    if (existingProducts > 0) {
      console.log("ℹ️  Products already exist. Skipping sample data creation.");
      console.log("💡 To reset products, delete them from the database first.");
      return;
    }

    console.log("📦 Adding sample products...");
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
      console.log(`✅ Added: ${product.name}`);
    }

    console.log(
      `🎉 Successfully added ${sampleProducts.length} sample products!`
    );
  } catch (error) {
    console.error("❌ Error adding sample products:", error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await addSampleProducts();

  console.log("📊 Final product count:", await Product.countDocuments());
  console.log("🏁 Script completed");
  process.exit(0);
};

// Run the script
main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
