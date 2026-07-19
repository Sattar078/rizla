import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { products } from '../data/products';

const FeaturedProducts = ({ selectedCategory }) => {
  const [wishlist, setWishlist] = useState(new Set());

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  return (
    <section className="w-full bg-background py-16 px-4 sm:px-6">
      <div className="container mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              {/* Product Card */}
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-md">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-white/5 aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-accent text-background px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <motion.button
                    onClick={() => toggleWishlist(product.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-accent flex items-center justify-center transition-all duration-300"
                  >
                    <FiHeart
                      size={20}
                      className={wishlist.has(product.id) ? 'fill-red-500 stroke-red-500' : 'text-white'}
                    />
                  </motion.button>

                  {/* Quick View Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <button className="bg-accent text-background font-montserrat font-bold px-6 py-2.5 rounded-full hover:bg-white hover:text-background transition-all duration-300 uppercase tracking-wider text-sm">
                      Quick View
                    </button>
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-5">
                  {/* Brand */}
                  <p className="text-accent text-xs sm:text-sm font-montserrat font-semibold uppercase tracking-wider mb-2">
                    {product.brand}
                  </p>

                  {/* Name */}
                  <h3 className="text-white font-playfair text-base sm:text-lg font-semibold mb-3 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? '⭐' : '☆'}>
                          {' '}
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs sm:text-sm">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <span className="text-accent text-lg sm:text-xl font-bold font-poppins">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-gray-400 line-through text-sm font-poppins">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See More Button */}
        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-background text-accent font-montserrat font-bold px-8 sm:px-12 py-3.5 sm:py-4 rounded-full border-2 border-accent hover:border-white hover:text-white transition-all duration-300 uppercase tracking-wider text-sm sm:text-base"
          >
            See More
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
