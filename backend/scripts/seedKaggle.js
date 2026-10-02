require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rizla_boutique';
const CSV_FILE_PATH = path.join(__dirname, 'fashion_retail_sales.csv');

// Default fallback images for kaggle products
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1434389678259-2f22b79313ea?auto=format&fit=crop&w=800&q=80";

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected correctly!');

    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.error(`\nERROR: Could not find the dataset at ${CSV_FILE_PATH}`);
      console.log('Please download "atharvasoundankar/fashion-retail-sales" from Kaggle');
      console.log('and save it as "fashion_retail_sales.csv" inside the backend/scripts folder!\n');
      process.exit(1);
    }

    console.log('Reading CSV file and seeding database...');
    const results = [];
    
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        let count = 0;
        let createdCategories = {};

        for (const row of results) {
          // Row fields based on the Fashion Retail Sales Kaggle Dataset:
          // Item Purchased, Category, Purchase Amount (USD), Size, Color, Review Rating, etc.
          const itemName = row['Item Purchased'] || 'Fashion Item';
          const catName = row['Category'] || 'General';
          const price = parseFloat(row['Purchase Amount (USD)']) || 25.0;
          const size = row['Size'] || 'M';
          const color = row['Color'] || 'Black';
          const rating = parseFloat(row['Review Rating']) || 4.0;
          
          // Get or create category
          if (!createdCategories[catName]) {
            let cat = await Category.findOne({ name: catName });
            if (!cat) {
              cat = await Category.create({ 
                name: catName, 
                description: `${catName} category from Kaggle dataset` 
              });
            }
            createdCategories[catName] = cat._id;
          }

          const categoryId = createdCategories[catName];

          // Check if product already exists to avoid massive duplicates if run multiple times
          // We'll append a unique tag to identify it, or just rely on Item name
          // Since Kaggle datasets can have thousands of rows, let's just insert
          
          await Product.create({
            name: `${itemName} - ${color} (${size})`,
            description: `A beautiful ${color} ${itemName} perfect for any occasion.`,
            category: categoryId,
            price: price,
            images: [
              { url: DEFAULT_IMAGE, publicId: 'kaggle_default' }
            ],
            variants: [
              { size: size, color: color, stock: 50 }
            ],
            averageRating: rating,
            totalReviews: Math.floor(Math.random() * 50) + 1
          });
          
          count++;
          if (count % 100 === 0) {
            console.log(`Seeded ${count} items...`);
          }
        }

        console.log(`\nSuccess! Seeded ${count} products from Kaggle dataset.`);
        process.exit(0);
      });

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
