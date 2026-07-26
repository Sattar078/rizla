import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, total, itemCount, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-28 pb-20">
        <FiShoppingBag size={64} className="mb-6 text-gray-600" />
        <h1 className="mb-4 font-playfair text-3xl font-bold text-white">Your bag is empty</h1>
        <p className="mb-8 text-gray-400">Discover our curated collection and add something you love.</p>
        <Link
          to="/shop"
          className="rounded-full bg-accent px-8 py-3 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-background hover:bg-green-600"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-2 font-playfair text-4xl font-bold text-white">Shopping Bag</h1>
        <p className="mb-10 text-gray-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6"
              >
                <Link to={`/product/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-28 w-28 rounded-xl object-cover sm:h-32 sm:w-32"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">{item.product.brand}</p>
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-playfair text-lg font-semibold text-white hover:text-accent">{item.product.name}</h3>
                    </Link>
                    <p className="mt-1 font-poppins text-lg font-bold text-accent">${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-white/20">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 hover:text-accent"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:text-accent">
                        +
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 transition-colors hover:text-red-400">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="hidden font-poppins text-lg font-bold text-white sm:block">${item.subtotal.toFixed(2)}</p>
              </motion.div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="mb-6 font-playfair text-2xl font-bold text-white">Order Summary</h2>
            <div className="mb-4 flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="mb-4 flex justify-between text-gray-300">
              <span>Shipping</span>
              <span className="text-accent">Free</span>
            </div>
            <div className="mb-8 border-t border-white/10 pt-4 flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span className="text-accent">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full rounded-full bg-accent py-4 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-background transition-all hover:bg-green-600"
            >
              Proceed to Checkout
            </button>
            <Link to="/shop" className="mt-4 block text-center text-sm text-gray-400 hover:text-accent">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
