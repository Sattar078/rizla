import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-28 pb-20">
        <FiHeart size={64} className="mb-6 text-gray-600" />
        <h1 className="mb-4 font-playfair text-3xl font-bold text-white">Your wishlist is empty</h1>
        <p className="mb-8 text-gray-400">Save items you love and shop them later.</p>
        <Link
          to="/shop"
          className="rounded-full bg-accent px-8 py-3 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-background hover:bg-green-600"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-10 font-playfair text-4xl font-bold text-white">My Wishlist</h1>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ product }) => (
            <div key={product.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
              </Link>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">{product.brand}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-playfair text-lg font-semibold text-white hover:text-accent">{product.name}</h3>
                </Link>
                <p className="my-2 font-poppins text-lg font-bold text-accent">${product.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-2 text-sm font-bold uppercase text-background hover:bg-green-600"
                  >
                    <FiShoppingBag size={16} /> Add to Bag
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-red-400 hover:border-red-400"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
