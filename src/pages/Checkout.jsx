import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    shippingName: user?.name || '',
    shippingEmail: user?.email || '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: 'Mumbai',
    shippingPincode: '',
    paymentMethod: 'cod',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { order } = await api.orders.create(form);
      await clearCart();
      navigate(`/order-success/${order.id}`, { state: { order } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-28">
        <p className="mb-4 text-gray-400">Your cart is empty.</p>
        <Link to="/shop" className="text-accent hover:underline">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-10 font-playfair text-4xl font-bold text-white">Checkout</h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="font-playfair text-2xl font-bold text-white">Shipping Details</h2>

            {error && <p className="rounded-lg bg-red-500/20 p-3 text-sm text-red-300">{error}</p>}

            <input
              name="shippingName"
              value={form.shippingName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
            />
            <input
              name="shippingEmail"
              type="email"
              value={form.shippingEmail}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
            />
            <input
              name="shippingPhone"
              value={form.shippingPhone}
              onChange={handleChange}
              placeholder="Phone (+91)"
              required
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
            />
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              placeholder="Full Address"
              required
              rows={3}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="shippingCity"
                value={form.shippingCity}
                onChange={handleChange}
                placeholder="City"
                required
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
              />
              <input
                name="shippingPincode"
                value={form.shippingPincode}
                onChange={handleChange}
                placeholder="Pincode"
                required
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Payment Method</p>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="accent-accent"
                />
                <span>Cash on Delivery (COD)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent py-4 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-background hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
            </button>
          </form>

          <div className="h-fit rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 font-playfair text-2xl font-bold text-white">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.product.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{item.product.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-accent">${item.subtotal.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-white/10 pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-accent">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
