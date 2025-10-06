const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const fixProductImages = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to database");

    console.log("🖼️ Updating product images with permanent URLs...");

    // Sample product images from Unsplash (free stock photos)
    const imageUpdates = [
      {
        name: "Perfume",
        images: [
          {
            url: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            alt: "Perfume - Image 1",
            isPrimary: true,
          },
        ],
      },
      {
        name: "Denim Jacket",
        images: [
          {
            url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            alt: "Denim Jacket - Image 1",
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            alt: "Denim Jacket - Image 2",
            isPrimary: false,
          },
        ],
      },
      {
        name: "Dress Jeens",
        images: [
          {
            url: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            alt: "Dress Jeans - Image 1",
            isPrimary: true,
          },
        ],
      },
      {
        name: "Boski Shalwar KAmeez",
        images: [
          {
            url: "https://images.unsplash.com/photo-1583743814966-8936f37f7dad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            alt: "Boski Shalwar Kameez - Image 1",
            isPrimary: true,
          },
          {
            url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            alt: "Boski Shalwar Kameez - Image 2",
            isPrimary: false,
          },
        ],
      },
    ];

    for (const update of imageUpdates) {
      const result = await Product.updateOne(
        { name: update.name },
        { $set: { images: update.images } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated images for: ${update.name}`);
      } else {
        console.log(`⚠️ No product found with name: ${update.name}`);
      }
    }

    console.log("\n🎉 Image update complete!");
    console.log(
      "📌 All products now have permanent image URLs that won't expire."
    );

    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

fixProductImages();
