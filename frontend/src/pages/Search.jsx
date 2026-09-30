import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const POPULAR_SEARCHES = ['Dress', 'Shirt', 'Silk', 'Cotton', 'Jacket', 'Kurti', 'Tops'];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read search term from URL (backend expects 'search')
  const urlSearch = searchParams.get('search') || searchParams.get('q') || '';
  const [term, setTerm] = useState(urlSearch);

  // Keep input in sync with URL
  useEffect(() => {
    setTerm(urlSearch);
  }, [urlSearch]);

  // Query backend products only if search term exists or fetch all for general exploration
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useProducts(urlSearch ? { search: urlSearch } : undefined);

  const products = data?.products || [];

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    const trimmed = term.trim();
    if (trimmed) {
      setSearchParams({ search: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setTerm('');
    setSearchParams({});
  };

  const handleTagClick = (tag) => {
    setTerm(tag);
    setSearchParams({ search: tag });
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search Bar Container */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary-900/60 mb-2 block">
            Discover Rizla Boutique
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-primary-900 mb-3">
            Search Our Collection
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Find luxury attire, handcrafted designs, and everyday wardrobe essentials.
          </p>

          {/* Search Form Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-sm">
            <div className="absolute left-4 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search by product name, fabric, style..."
              className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-full border border-gray-200 bg-white text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition shadow-sm"
              autoFocus
            />

            {/* Clear Button */}
            {term && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-24 text-gray-400 hover:text-gray-600 p-1"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="absolute right-1.5 sm:right-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-primary-900 text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-primary-800 transition shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Popular Search Suggestions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Trending:</span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                  urlSearch.toLowerCase() === tag.toLowerCase()
                    ? 'bg-primary-900 text-white border-primary-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-primary-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── State 1: Initial Empty State (No query entered) ── */}
        {!urlSearch && !isLoading && (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold font-display text-primary-900 mb-1">
              Start Searching
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter keywords above to discover exclusive styles, fabrics, and curated boutique designs.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/products"
                className="px-6 py-2.5 rounded-full bg-primary-900 text-white text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
              >
                Explore All Products
              </Link>
            </div>
          </div>
        )}

        {/* ── State 2: Loading State ── */}
        {isLoading && (
          <div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="h-8 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── State 5: API Error State ── */}
        {isError && !isLoading && (
          <div className="bg-white rounded-2xl border border-red-200 p-10 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Search temporarily unavailable</h2>
            <p className="text-sm text-gray-500 mb-5">
              {error?.response?.data?.message || 'Unable to load products. Please check your connection and try again.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-5 py-2 rounded-full bg-primary-900 text-white text-xs font-semibold hover:bg-primary-800 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── State 4: No Results State ── */}
        {urlSearch && !isLoading && !isError && products.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold font-display text-gray-900 mb-1">
              No matching products found
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              We couldn't find anything matching <span className="font-semibold text-gray-800">"{urlSearch}"</span>. Try adjusting your search term, checking for typos, or browse all categories.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Clear Search
              </button>
              <Link
                to="/products"
                className="px-5 py-2.5 rounded-full bg-primary-900 text-white text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        )}

        {/* ── State 3: Results State ── */}
        {urlSearch && !isLoading && !isError && products.length > 0 && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-black/5">
              <div>
                <p className="text-sm text-gray-600">
                  Showing <span className="font-bold text-gray-900">{products.length}</span> {products.length === 1 ? 'result' : 'results'} for{' '}
                  <span className="font-semibold text-primary-900">"{urlSearch}"</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/products"
                  className="text-xs font-semibold text-primary-900 hover:text-primary-700 transition"
                >
                  View in Shop →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
