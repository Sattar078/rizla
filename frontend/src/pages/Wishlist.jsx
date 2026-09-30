import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist, useRemoveFromWishlist } from '../hooks/useWishlist';

const Wishlist = () => {
  const { data, isLoading, isError, error, refetch } = useWishlist();
  const removeMutation = useRemoveFromWishlist();

  const wishlistItems = (data?.wishlist || []).filter(
    (product) => product && product._id
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <nav className="flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 space-x-2">
            <Link to="/" className="hover:text-primary-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary-900">Wishlist</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                My Wishlist
              </h1>
              <p className="mt-1 text-sm text-gray-500 font-medium">
                Personalized collection of your saved boutique items.
              </p>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {isLoading ? 'Loading…' : `${wishlistItems.length} item${wishlistItems.length === 1 ? '' : 's'} saved`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-gray-200 bg-white p-4 animate-pulse space-y-4"
              >
                <div className="aspect-[4/5] bg-gray-200 rounded-2xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-10 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-lg mx-auto rounded-3xl border border-red-200 bg-red-50/80 p-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-900">
                Error Loading Wishlist
              </h2>
              <p className="mt-1 text-sm text-red-700 font-medium">
                {error?.message || 'We were unable to load your saved items right now.'}
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
        {!isLoading && !isError && wishlistItems.length === 0 && (
          <div className="max-w-md mx-auto rounded-3xl border border-gray-200 bg-white p-12 text-center space-y-6 shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Your wishlist is empty.
              </h2>
              <p className="mt-2 text-sm text-gray-500 font-medium leading-relaxed">
                Save items you love to your wishlist and review them later.
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

        {/* Wishlist Items Grid */}
        {!isLoading && !isError && wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const imageUrl =
                product.images?.length > 0
                  ? product.images[0].url
                  : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80';

              return (
                <div
                  key={product._id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeMutation.mutate(product._id);
                    }}
                    disabled={
                      removeMutation.isPending &&
                      removeMutation.variables === product._id
                    }
                    title="Remove from wishlist"
                    className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur shadow hover:bg-white text-gray-400 hover:text-red-500 transition-all active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <Link to={`/products/${product._id}`} className="block flex-1">
                    <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      {product.category?.name && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700 mb-1">
                          {product.category.name}
                        </p>
                      )}
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {product.name}
                      </h3>

                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-base font-black text-gray-900">
                          ₹{(product.price || 0).toLocaleString('en-IN')}
                        </p>
                        {product.averageRating > 0 && (
                          <div className="flex items-center text-xs font-bold text-gray-700">
                            <span className="text-amber-400 mr-1">★</span>
                            {product.averageRating?.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="px-5 pb-5 mt-auto">
                    <Link
                      to={`/products/${product._id}`}
                      className="block w-full text-center text-xs font-bold uppercase tracking-wider py-3 rounded-full border border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white transition-colors"
                    >
                      View & Select Options
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
