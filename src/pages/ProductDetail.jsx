import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    setLoading(true);
    api.products
      .getById(id)
      .then(({ product: p }) => setProduct(p))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-28">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-accent"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-[2rem] border border-white/10"
          >
            <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-accent">{product.brand}</p>
            <h1 className="mb-4 font-playfair text-4xl font-bold text-white">{product.name}</h1>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(product.rating) ? '⭐' : '☆'}</span>
                ))}
              </div>
              <span className="text-gray-400">({product.reviews} reviews)</span>
            </div>

            <div className="mb-8 flex items-center gap-4">
              <span className="font-poppins text-3xl font-bold text-accent">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-bold text-accent">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            <p className="mb-6 text-gray-300">
              Category: <span className="text-white">{product.category}</span> · Collection:{' '}
              <span className="text-white">{product.collection}</span>
            </p>

            <p className="mb-8 text-gray-300">
              {product.inStock ? (
                <span className="text-accent">✓ In Stock — Ready to ship</span>
              ) : (
                <span className="text-red-400">Out of Stock</span>
              )}
            </p>

            <div className="mb-8 flex items-center gap-4">
              <span className="text-sm text-gray-400">Quantity</span>
              <div className="flex items-center rounded-full border border-white/20">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg hover:text-accent"
                >
                  −
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2 text-lg hover:text-accent">
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || adding}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-background transition-all hover:bg-green-600 disabled:opacity-50"
              >
                <FiShoppingBag size={20} />
                {adding ? 'Adding...' : 'Add to Bag'}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 transition-all hover:border-accent hover:text-accent"
              >
                <FiHeart size={22} className={isInWishlist(product.id) ? 'fill-red-500 stroke-red-500' : ''} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
