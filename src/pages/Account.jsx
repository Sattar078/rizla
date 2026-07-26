import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';

const Account = () => {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const { itemCount } = useCart();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login');
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      api.orders.getAll().then(({ orders: o }) => setOrders(o));
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-28">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-playfair text-4xl font-bold text-white">My Account</h1>
            <p className="mt-2 text-gray-400">Welcome back, {user.name}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-2 text-sm hover:border-red-400 hover:text-red-400"
          >
            <FiLogOut /> Sign Out
          </button>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Link to="/cart" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-accent">
            <FiShoppingBag size={28} className="mb-3 text-accent" />
            <p className="font-playfair text-xl font-bold text-white">{itemCount} Items</p>
            <p className="text-sm text-gray-400">In your bag</p>
          </Link>
          <Link to="/wishlist" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-accent">
            <FiHeart size={28} className="mb-3 text-accent" />
            <p className="font-playfair text-xl font-bold text-white">{wishlistItems.length} Items</p>
            <p className="text-sm text-gray-400">In wishlist</p>
          </Link>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-playfair text-xl font-bold text-white">{user.email}</p>
          </div>
        </div>

        <h2 className="mb-6 font-playfair text-2xl font-bold text-white">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400">No orders yet. <Link to="/shop" className="text-accent hover:underline">Start shopping</Link></p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex flex-wrap justify-between gap-2">
                  <span className="font-bold text-white">Order #{order.id}</span>
                  <span className="text-accent">${order.total.toFixed(2)}</span>
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase text-accent">{order.status}</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <span className="text-sm text-gray-300">{item.product.name} × {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
