// Sample Products with Image URLs for Testing
const { default: mongoose } = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

// Sample products with high-quality image URLs
const sampleProducts = [
  {
    name: "Classic White T-Shirt",
    description:
      "Premium cotton t-shirt with a comfortable fit. Perfect for everyday wear.",
    price: 29.99,
    comparePrice: 39.99,
    category: "men",
    subcategory: "T-Shirts",
    brand: "RabbitWear",
    gender: "men",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
        alt: "Classic White T-Shirt - Front View",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop&crop=center",
        alt: "Classic White T-Shirt - Side View",
        isPrimary: false,
      },
    ],
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 10 },
    ],
    colors: [
      { name: "White", code: "#FFFFFF", stock: 30 },
      { name: "Black", code: "#000000", stock: 25 },
      { name: "Navy", code: "#001f3f", stock: 15 },
    ],
    totalStock: 70,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    tags: ["cotton", "casual", "basic"],
    rating: 4.5,
    numReviews: 125,
  },
  {
    name: "Elegant Black Dress",
    description:
      "Sophisticated black dress perfect for formal occasions and evening events.",
    price: 89.99,
    comparePrice: 119.99,
    category: "women",
    subcategory: "Dresses",
    brand: "RabbitWear",
    gender: "women",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center",
        alt: "Elegant Black Dress - Front View",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop&crop=center",
        alt: "Elegant Black Dress - Back View",
        isPrimary: false,
      },
    ],
    sizes: [
      { size: "XS", stock: 8 },
      { size: "S", stock: 12 },
      { size: "M", stock: 15 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 5 },
    ],
    colors: [
      { name: "Black", code: "#000000", stock: 35 },
      { name: "Navy", code: "#001f3f", stock: 15 },
    ],
    totalStock: 50,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    tags: ["formal", "elegant", "evening"],
    rating: 4.8,
    numReviews: 89,
  },
  {
    name: "Kids Rainbow Hoodie",
    description:
      "Colorful and cozy hoodie for kids. Made with soft cotton blend for maximum comfort.",
    price: 34.99,
    comparePrice: 44.99,
    category: "kids",
    subcategory: "Hoodies",
    brand: "RabbitWear",
    gender: "kids",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop&crop=center",
        alt: "Kids Rainbow Hoodie - Front View",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1519722417352-7d6959729417?w=400&h=400&fit=crop&crop=center",
        alt: "Kids Rainbow Hoodie - Detail View",
        isPrimary: false,
      },
    ],
    sizes: [
      { size: "4T", stock: 10 },
      { size: "5T", stock: 12 },
      { size: "6T", stock: 15 },
      { size: "7T", stock: 8 },
    ],
    colors: [
      { name: "Rainbow", code: "#FF6B6B", stock: 25 },
      { name: "Pink", code: "#FF69B4", stock: 20 },
    ],
    totalStock: 45,
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    tags: ["kids", "colorful", "hoodie", "cotton"],
    rating: 4.6,
    numReviews: 67,
  },
  {
    name: "Premium Leather Wallet",
    description:
      "Handcrafted leather wallet with multiple card slots and bill compartments.",
    price: 49.99,
    comparePrice: 69.99,
    category: "accessories",
    subcategory: "Wallets",
    brand: "RabbitWear",
    gender: "unisex",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
        alt: "Premium Leather Wallet - Closed",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop&crop=center",
        alt: "Premium Leather Wallet - Open",
        isPrimary: false,
      },
    ],
    sizes: [{ size: "One Size", stock: 30 }],
    colors: [
      { name: "Brown", code: "#8B4513", stock: 20 },
      { name: "Black", code: "#000000", stock: 15 },
      { name: "Tan", code: "#D2B48C", stock: 10 },
    ],
    totalStock: 45,
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    tags: ["leather", "wallet", "accessories", "premium"],
    rating: 4.7,
    numReviews: 203,
  },
  {
    name: "Sport Running Shoes",
    description:
      "Lightweight running shoes with advanced cushioning technology for optimal performance.",
    price: 79.99,
    comparePrice: 99.99,
    category: "shoes",
    subcategory: "Running",
    brand: "RabbitWear",
    gender: "unisex",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center",
        alt: "Sport Running Shoes - Side View",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1595950653106-6c9739b5f446?w=400&h=400&fit=crop&crop=center",
        alt: "Sport Running Shoes - Front View",
        isPrimary: false,
      },
    ],
    sizes: [
      { size: "7", stock: 8 },
      { size: "8", stock: 12 },
      { size: "9", stock: 15 },
      { size: "10", stock: 12 },
      { size: "11", stock: 8 },
      { size: "12", stock: 5 },
    ],
    colors: [
      { name: "White/Blue", code: "#FFFFFF", stock: 35 },
      { name: "Black/Red", code: "#000000", stock: 25 },
    ],
    totalStock: 60,
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    tags: ["shoes", "running", "sport", "performance"],
    rating: 4.4,
    numReviews: 156,
  },
];

async function addSampleProductsWithImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️ Cleared existing products");

    // Add sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(
      `✅ Added ${createdProducts.length} sample products with images:`
    );

    createdProducts.forEach((product, index) => {
      console.log(
        `   ${index + 1}. ${product.name} - ${product.images.length} images`
      );
      console.log(`      Primary Image: ${product.images[0]?.url}`);
    });

    console.log("\n🎉 Sample products with images added successfully!");
    console.log("   You can now see these products in:");
    console.log("   - New Arrivals section");
    console.log("   - Admin Product Management");
    console.log("   - All product displays");
  } catch (error) {
    console.error("❌ Error adding sample products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the script
addSampleProductsWithImages();
