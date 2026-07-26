import db from './database.js';

const products = [
  {
    name: 'Premium White T-Shirt',
    brand: 'RIZLA Essentials',
    category: 'Start',
    price: 45.0,
    original_price: 59.99,
    discount: 25,
    rating: 4.8,
    reviews: 142,
    image: 'https://i.pinimg.com/1200x/9c/a4/53/9ca453f5c06fbcfc0f3bed3989e48954.jpg',
    collection: 'Street Style',
    in_stock: 1,
  },
  {
    name: 'Maroon Crew Socks',
    brand: 'RIZLA Sport',
    category: 'Sock',
    price: 18.0,
    original_price: 24.99,
    discount: 28,
    rating: 4.6,
    reviews: 89,
    image: 'https://i.pinimg.com/736x/3c/25/68/3c2568c228304c77ee8b1cd394220d61.jpg',
    collection: 'Basics',
    in_stock: 1,
  },
  {
    name: 'Khaki Cargo Pants',
    brand: 'RIZLA Urban',
    category: 'Trouser',
    price: 72.5,
    original_price: 95.0,
    discount: 24,
    rating: 4.7,
    reviews: 156,
    image: 'https://i.pinimg.com/control1/1200x/da/cc/66/dacc66e9b05e5d7224f19831d11bb233.jpg',
    collection: 'Casual Wear',
    in_stock: 1,
  },
  {
    name: 'Charcoal Oversized Hoodie',
    brand: 'RIZLA Comfort',
    category: 'Hoodie',
    price: 89.99,
    original_price: 119.99,
    discount: 25,
    rating: 4.9,
    reviews: 203,
    image: 'https://i.pinimg.com/736x/4e/b7/81/4eb78153fded8746fdac2877aa13f892.jpg',
    collection: 'Winter Collection',
    in_stock: 1,
  },
  {
    name: 'Black Minimalist Coach Jacket',
    brand: 'RIZLA Premium',
    category: 'Jacket',
    price: 125.0,
    original_price: 165.0,
    discount: 24,
    rating: 4.8,
    reviews: 128,
    image: 'https://i.pinimg.com/1200x/f9/3b/60/f93b6046b8a855bfb70ccf32af4abf80.jpg',
    collection: 'Premium Collection',
    in_stock: 1,
  },
  {
    name: 'Grey Casual T-Shirt',
    brand: 'RIZLA Basics',
    category: 'Start',
    price: 32.5,
    original_price: 45.0,
    discount: 28,
    rating: 4.5,
    reviews: 94,
    image: 'https://i.pinimg.com/control1/1200x/8a/07/44/8a0744041268ab90265e8bd7fd6ea55c.jpg',
    collection: 'Everyday Wear',
    in_stock: 1,
  },
  {
    name: 'Navy Button-Up Shirt',
    brand: 'RIZLA Formal',
    category: 'Trouser',
    price: 68.0,
    original_price: 89.99,
    discount: 24,
    rating: 4.6,
    reviews: 67,
    image: 'https://i.pinimg.com/1200x/fb/6b/de/fb6bdea78483adcbecc19424077c4aeb.jpg',
    collection: 'Smart Casual',
    in_stock: 1,
  },
  {
    name: 'Black Tote Bag',
    brand: 'RIZLA Accessories',
    category: 'Shoe',
    price: 95.0,
    original_price: 129.99,
    discount: 27,
    rating: 4.7,
    reviews: 112,
    image: 'https://i.pinimg.com/736x/1a/70/5a/1a705acfbecaa4bc533856d7ad445b55.jpg',
    collection: 'Accessories',
    in_stock: 1,
  },
  {
    name: 'White Canvas Sneakers',
    brand: 'RIZLA Footwear',
    category: 'Shoe',
    price: 79.99,
    original_price: 109.99,
    discount: 27,
    rating: 4.8,
    reviews: 185,
    image: 'https://i.pinimg.com/736x/b0/b3/2a/b0b32a59ae0b0783c2c5f885620a5157.jpg',
    collection: 'Street Style',
    in_stock: 1,
  },
  {
    name: 'Brown Leather Belt',
    brand: 'RIZLA Accessories',
    category: 'Shoe',
    price: 45.0,
    original_price: 59.99,
    discount: 25,
    rating: 4.6,
    reviews: 43,
    image: 'https://i.pinimg.com/736x/29/ed/19/29ed19310dbbfa140a9d895f46d071fa.jpg',
    collection: 'Accessories',
    in_stock: 1,
  },
  {
    name: 'Burgundy Bomber Jacket',
    brand: 'RIZLA Premium',
    category: 'Jacket',
    price: 135.0,
    original_price: 179.99,
    discount: 25,
    rating: 4.9,
    reviews: 97,
    image: 'https://i.pinimg.com/736x/74/4b/10/744b10d616017a57f2fcad498440db16.jpg',
    collection: 'Premium Collection',
    in_stock: 1,
  },
  {
    name: 'Black Watch Cap',
    brand: 'RIZLA Essentials',
    category: 'Cap',
    price: 28.5,
    original_price: 39.99,
    discount: 29,
    rating: 4.5,
    reviews: 56,
    image: 'https://i.pinimg.com/1200x/1f/b5/59/1fb5599e8bb6ebb9dbe21a6e6f5c70a7.jpg',
    collection: 'Street Style',
    in_stock: 1,
  },
];

const categories = [
  { slug: 'all', label: 'All' },
  { slug: 'start', label: 'Start' },
  { slug: 'cap', label: 'Cap' },
  { slug: 'trouser', label: 'Trouser' },
  { slug: 'shorts', label: 'Shorts' },
  { slug: 'shoe', label: 'Shoe' },
  { slug: 'sock', label: 'Sock' },
  { slug: 'jacket', label: 'Jacket' },
  { slug: 'hoodie', label: 'Hoodie' },
  { slug: 'glasses', label: 'Glasses' },
  { slug: 'watch', label: 'Watch' },
];

const collections = [
  {
    name: 'Street Style Collection',
    description: 'Contemporary streetwear that defines urban fashion.',
    image: 'https://i.pinimg.com/564x/e3/9d/c9/e39dc93f35c31925b50009a47513544c.jpg',
    color: 'from-green-500',
  },
  {
    name: 'Korean Style Collection',
    description: 'The latest K-fashion trends with our curated selection.',
    image: 'https://i.pinimg.com/564x/f9/3c/03/f93c03f44531d8d2111818c11a255854.jpg',
    color: 'from-blue-500',
  },
  {
    name: 'Vintage Vibes Collection',
    description: 'Timeless pieces with a retro twist for the fashion-forward.',
    image: 'https://i.pinimg.com/564x/8c/6f/a0/8c6fa0d414a9f3334a628437445c0351.jpg',
    color: 'from-purple-500',
  },
];

const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();

if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (name, brand, category, price, original_price, discount, rating, reviews, image, collection, in_stock)
    VALUES (@name, @brand, @category, @price, @original_price, @discount, @rating, @reviews, @image, @collection, @in_stock)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) insertProduct.run(item);
  });

  insertMany(products);

  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (slug, label) VALUES (?, ?)');
  for (const cat of categories) insertCategory.run(cat.slug, cat.label);

  const insertCollection = db.prepare(
    'INSERT INTO collections (name, description, image, color) VALUES (?, ?, ?, ?)'
  );
  for (const col of collections) insertCollection.run(col.name, col.description, col.image, col.color);

  console.log(`Seeded ${products.length} products, ${categories.length} categories, ${collections.length} collections`);
} else {
  console.log('Database already seeded, skipping.');
}

export { products, categories, collections };
