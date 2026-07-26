import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const FeaturedProducts = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    setLoading(true);
    const params = { limit: 8 };
    if (selectedCategory !== 'all') params.category = selectedCategory;

    api.products
      .getAll(params)
      .then(({ products: prods }) => setProducts(prods))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="collection">
      <section>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 text-center md:text-left">
            <br />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Featured Picks</p>
            <h2 className="font-playfair text-3xl font-bold text-white sm:text-4xl">
              Elevated essentials for modern dressing
            </h2>
            <br />
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-2xl hover:shadow-black/30">
                    <div className="relative aspect-square overflow-hidden bg-white/5">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>

                      {product.discount > 0 && (
                        <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-sm font-bold text-background">
                          -{product.discount}%
                        </div>
                      )}

                      <motion.button
                        onClick={() => toggleWishlist(product.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-accent"
                      >
                        <FiHeart
                          size={20}
                          className={isInWishlist(product.id) ? 'fill-red-500 stroke-red-500' : 'text-white'}
                        />
                      </motion.button>

                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity duration-300 backdrop-blur-sm"
                      >
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="rounded-full bg-accent px-6 py-3 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-background transition-all hover:bg-white hover:text-background"
                        >
                          Quick View
                        </button>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-background hover:bg-accent"
                          aria-label="Add to cart"
                        >
                          <FiShoppingBag size={18} />
                        </button>
                      </motion.div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <p className="mb-2 font-montserrat text-xs font-semibold uppercase tracking-[0.3em] text-accent sm:text-sm">
                        {product.brand}
                      </p>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="mb-3 font-playfair text-base font-semibold text-white hover:text-accent sm:text-lg">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < Math.floor(product.rating) ? '⭐' : '☆'}</span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 sm:text-sm">({product.reviews})</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-poppins text-lg font-bold text-accent sm:text-xl">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <br />
          <br />

          <div className="mt-12 flex justify-center">
            <motion.button
              onClick={() => navigate('/shop')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center rounded-full border-2 border-accent px-8 py-3.5 font-montserrat text-sm font-bold uppercase tracking-[0.25em] text-accent transition-all duration-300 hover:bg-gray-800 hover:text-white sm:px-12 sm:py-4"
            >
              See More
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturedProducts;
