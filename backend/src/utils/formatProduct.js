const formatProduct = (row) => ({
  id: row.id,
  name: row.name,
  brand: row.brand,
  category: row.category,
  price: row.price,
  originalPrice: row.original_price,
  discount: row.discount,
  rating: row.rating,
  reviews: row.reviews,
  image: row.image,
  collection: row.collection,
  inStock: Boolean(row.in_stock),
});

export { formatProduct };
