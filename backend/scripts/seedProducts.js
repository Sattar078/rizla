require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Category = require("../src/models/Category");
const Product = require("../src/models/Product");

const categoriesData = [
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Trousers",
  "Hoodies",
  "Jackets"
];

const productsData = [
  {
    name: "Classic Premium Cotton T-Shirt",
    description: "A highly comfortable classic premium cotton t-shirt for everyday wear. Made from 100% combed cotton.",
    categoryName: "T-Shirts",
    price: 699,
    images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_tshirt_1" }],
    colors: ["Black", "White", "Navy Blue"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Oversized Streetwear T-Shirt",
    description: "Drop shoulder oversized t-shirt with a relaxed fit. Perfect for streetwear outfits.",
    categoryName: "T-Shirts",
    price: 899,
    images: [{ url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_tshirt_2" }],
    colors: ["Black", "Grey", "Olive"],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    name: "Polo T-Shirt",
    description: "Classic polo t-shirt with a structured collar. Great for casual and semi-formal occasions.",
    categoryName: "T-Shirts",
    price: 1099,
    images: [{ url: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_tshirt_3" }],
    colors: ["Navy Blue", "White", "Black"],
    sizes: ["M", "L", "XL"]
  },
  {
    name: "Slim Fit Casual Shirt",
    description: "A tailored slim fit shirt made of breathable linen-cotton blend.",
    categoryName: "Shirts",
    price: 1299,
    images: [{ url: "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_shirt_1" }],
    colors: ["Navy Blue", "Sky Blue", "Olive"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Premium Oxford Shirt",
    description: "Versatile button-down Oxford shirt. Durable, stylish, and perfect for the office or a night out.",
    categoryName: "Shirts",
    price: 1599,
    images: [{ url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_shirt_2" }],
    colors: ["White", "Sky Blue", "Grey"],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    name: "Full Sleeve Casual Shirt",
    description: "Comfortable full sleeve casual shirt for all seasons.",
    categoryName: "Shirts",
    price: 1199,
    images: [{ url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_shirt_3" }],
    colors: ["Black", "Brown", "Olive"],
    sizes: ["M", "L", "XL"]
  },
  {
    name: "Regular Fit Blue Jeans",
    description: "Classic regular fit blue denim jeans. Built for durability and everyday comfort.",
    categoryName: "Jeans",
    price: 1799,
    images: [{ url: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_jeans_1" }],
    colors: ["Navy Blue", "Sky Blue"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    name: "Black Stretch Jeans",
    description: "Premium stretchable black jeans for a sleek, modern look.",
    categoryName: "Jeans",
    price: 1999,
    images: [{ url: "https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_jeans_2" }],
    colors: ["Black", "Grey"],
    sizes: ["M", "L", "XL"]
  },
  {
    name: "Casual Cotton Trousers",
    description: "Lightweight, breathable cotton trousers perfect for casual outings or semi-formal wear.",
    categoryName: "Trousers",
    price: 1499,
    images: [{ url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_trousers_1" }],
    colors: ["Beige", "Olive", "Black"],
    sizes: ["M", "L", "XL"]
  },
  {
    name: "Premium Cargo Pants",
    description: "Utility cargo pants with multiple pockets. Highly durable and stylish.",
    categoryName: "Trousers",
    price: 1899,
    images: [{ url: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_cargos_1" }],
    colors: ["Olive", "Black", "Grey"],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    name: "Premium Hoodie",
    description: "Warm, thick fleece hoodie with a kangaroo pocket and drawstring hood.",
    categoryName: "Hoodies",
    price: 2199,
    images: [{ url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_hoodie_1" }],
    colors: ["Black", "Grey", "Navy Blue"],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    name: "Denim Jacket",
    description: "Classic blue denim jacket. A wardrobe essential for layering.",
    categoryName: "Jackets",
    price: 2799,
    images: [{ url: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "demo_jacket_1" }],
    colors: ["Navy Blue", "Sky Blue", "Black"],
    sizes: ["S", "M", "L", "XL"]
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    console.log("Connected to database. Starting seed process...");

    // 1. Ensure Categories Exist
    const categoryMap = {};
    for (const catName of categoriesData) {
      let category = await Category.findOne({ name: catName });
      if (!category) {
        category = await Category.create({ name: catName });
        console.log(`Created Category: ${catName}`);
      } else {
        console.log(`Category exists: ${catName}`);
      }
      categoryMap[catName] = category._id;
    }

    // 2. Ensure Products Exist
    let productsInserted = 0;
    let productsSkipped = 0;

    for (const prodData of productsData) {
      const existingProduct = await Product.findOne({ name: prodData.name });

      if (existingProduct) {
        console.log(`Product already exists, skipping: ${prodData.name}`);
        productsSkipped++;
        continue;
      }

      // Generate variants based on colors and sizes
      const variants = [];
      for (const color of prodData.colors) {
        for (const size of prodData.sizes) {
          variants.push({
            size,
            color,
            stock: Math.floor(Math.random() * 30) + 10, // Stock between 10 and 40
          });
        }
      }

      await Product.create({
        name: prodData.name,
        description: prodData.description,
        category: categoryMap[prodData.categoryName],
        price: prodData.price,
        images: prodData.images,
        variants: variants,
        averageRating: Math.floor(Math.random() * 2) + 3, // Rating between 3 and 5
        totalReviews: Math.floor(Math.random() * 50) + 1, // 1 to 50 reviews
      });

      console.log(`Created Product: ${prodData.name}`);
      productsInserted++;
    }

    console.log("\n=================================");
    console.log(`Seed process completed successfully.`);
    console.log(`Categories created/reused: ${categoriesData.length}`);
    console.log(`Products inserted: ${productsInserted}`);
    console.log(`Products skipped (duplicates): ${productsSkipped}`);
    console.log("=================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
