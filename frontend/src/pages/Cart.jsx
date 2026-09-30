import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
  useClearCart,
} from '../hooks/useCart';

const Cart = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useCart();
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeMutation = useRemoveFromCart();
  const clearMutation = useClearCart();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const cart = data?.cart;
  const cartItems = (cart?.items || []).filter((item) => item && item.product);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;

    // Check available stock from product variants
    const matchingVariant = (item.product?.variants || []).find(
      (v) =>
        v.size?.trim().toLowerCase() === item.size?.trim().toLowerCase() &&
        v.color?.trim().toLowerCase() === item.color?.trim().toLowerCase()
    );

    const maxStock = matchingVariant ? matchingVariant.stock : 99;
    if (newQuantity > maxStock) return;

    updateQuantityMutation.mutate({
      itemId: item._id,
      quantity: newQuantity,
    });
  };

  const handleClearCart = () => {
    clearMutation.mutate(undefined, {
      onSuccess: () => setShowClearConfirm(false),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <nav className="flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 space-x-2">
            <Link to="/" className="hover:text-primary-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary-900">Shopping Bag</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Shopping Bag
              </h1>
              <p className="mt-1 text-sm text-gray-500 font-medium">
                Review your selections and proceed to secure checkout.
              </p>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {isLoading ? 'Loading…' : `${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-3xl p-6 border border-gray-200/80 animate-pulse" />
              ))}
            </div>
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="h-64 bg-white rounded-3xl p-6 border border-gray-200/80 animate-pulse" />
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-lg mx-auto rounded-3xl border border-red-200 bg-red-50/80 p-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-900">
                Error Loading Cart
              </h2>
              <p className="mt-1 text-sm text-red-700 font-medium">
                {error?.message || 'Unable to retrieve your shopping bag.'}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => refetch()}
                className="inline-flex rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition shadow"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && cartItems.length === 0 && (
          <div className="max-w-md mx-auto rounded-3xl border border-gray-200 bg-white p-12 text-center space-y-6 shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Your cart is empty.
              </h2>
              <p className="mt-2 text-sm text-gray-500 font-medium leading-relaxed">
                Looks like you haven't added anything to your bag yet.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex w-full justify-center rounded-full bg-primary-900 py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-800 transition shadow-lg"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Cart Contents */}
        {!isLoading && !isError && cartItems.length > 0 && (
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const product = item.product;
                  const itemTotal = (product.price || 0) * item.quantity;
                  const imageUrl =
                    product.images?.length > 0
                      ? product.images[0].url
                      : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80';

                  const matchingVariant = (product.variants || []).find(
                    (v) =>
                      v.size?.trim().toLowerCase() === item.size?.trim().toLowerCase() &&
                      v.color?.trim().toLowerCase() === item.color?.trim().toLowerCase()
                  );
                  const maxStock = matchingVariant ? matchingVariant.stock : 99;

                  return (
                    <div
                      key={item._id}
                      className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        to={`/products/${product._id}`}
                        className="h-28 w-24 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 relative group"
                      >
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Product Details & Variant */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${product._id}`}
                          className="text-base font-bold text-gray-900 hover:text-primary-900 transition-colors truncate block"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-xs font-semibold text-gray-500">
                          Size: <span className="text-gray-900">{item.size}</span> • Color:{' '}
                          <span className="text-gray-900">{item.color}</span>
                        </p>
                        <p className="mt-2 text-sm font-bold text-primary-900">
                          ₹{(product.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity Controls & Line Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center border border-gray-200 rounded-full h-11 px-1 bg-gray-50/50">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                            className="h-9 w-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition font-bold"
                          >
                            −
                          </button>
                          <span className="font-bold text-gray-900 text-xs px-3">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            disabled={item.quantity >= maxStock || updateQuantityMutation.isPending}
                            className="h-9 w-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[5rem]">
                          <p className="text-base font-black text-gray-900">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeMutation.mutate(item._id)}
                            disabled={removeMutation.isPending}
                            className="mt-1 text-xs font-semibold text-red-600 hover:text-red-700 transition hover:underline"
                          >
                            {removeMutation.isPending && removeMutation.variables === item._id
                              ? 'Removing…'
                              : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear Cart / Confirmation */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  to="/products"
                  className="text-xs font-bold uppercase tracking-wider text-primary-900 hover:underline"
                >
                  ← Continue Shopping
                </Link>

                {showClearConfirm ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-600">Clear entire bag?</span>
                    <button
                      onClick={handleClearCart}
                      disabled={clearMutation.isPending}
                      className="text-xs font-bold uppercase tracking-wider text-red-600 hover:underline disabled:opacity-50"
                    >
                      {clearMutation.isPending ? 'Clearing…' : 'Yes, Clear'}
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 transition"
                  >
                    Clear Bag
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span className="font-bold text-gray-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="font-bold text-green-700">Complimentary</span>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                    <span className="text-base font-bold text-gray-900">Estimated Total</span>
                    <span className="text-2xl font-black text-primary-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full h-14 rounded-full bg-primary-900 text-white font-bold text-sm uppercase tracking-wider hover:bg-primary-800 transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout →
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2 text-xs font-medium text-gray-400">
                  <p className="flex items-center gap-2">
                    <span>🔒</span> Secure 256-bit encrypted checkout
                  </p>
                  <p className="flex items-center gap-2">
                    <span>⚡</span> Instant order confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
