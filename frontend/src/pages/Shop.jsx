import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Parameters
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlMinPrice = searchParams.get('minPrice') || '';
  const urlMaxPrice = searchParams.get('maxPrice') || '';

  // Local Form Inputs
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [minPriceInput, setMinPriceInput] = useState(urlMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(urlMaxPrice);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setMinPriceInput(urlMinPrice);
  }, [urlMinPrice]);

  useEffect(() => {
    setMaxPriceInput(urlMaxPrice);
  }, [urlMaxPrice]);

  const updateQueryParam = React.useCallback((key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value.toString().trim() !== '') {
      nextParams.set(key, value.toString().trim());
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Debounce search update to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== urlSearch) {
        updateQueryParam('search', searchInput);
      }
    }, 450);
    return () => clearTimeout(handler);
  }, [searchInput, urlSearch, updateQueryParam]);

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.categories || [];

  // Resolve Category ID (supports both ObjectId and name string like 'men', 'women')
  const matchedCategory = useMemo(() => {
    if (!urlCategory) return null;
    return categories.find(
      (c) =>
        c._id === urlCategory ||
        c.name.toLowerCase() === urlCategory.toLowerCase()
    );
  }, [categories, urlCategory]);

  const activeCategoryId = matchedCategory ? matchedCategory._id : urlCategory;

  // Active Query Parameters sent to backend
  const activeParams = useMemo(() => {
    const params = {};
    if (urlSearch.trim()) params.search = urlSearch.trim();
    if (activeCategoryId) params.category = activeCategoryId;
    if (urlMinPrice) params.minPrice = urlMinPrice;
    if (urlMaxPrice) params.maxPrice = urlMaxPrice;
    return params;
  }, [urlSearch, activeCategoryId, urlMinPrice, urlMaxPrice]);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError,
    error,
    refetch,
  } = useProducts(activeParams);

  const products = productsData?.products || [];



  const handleCategorySelect = (categoryId) => {
    updateQueryParam('category', categoryId === urlCategory ? '' : categoryId);
  };

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (minPriceInput.trim()) {
      nextParams.set('minPrice', minPriceInput.trim());
    } else {
      nextParams.delete('minPrice');
    }
    if (maxPriceInput.trim()) {
      nextParams.set('maxPrice', maxPriceInput.trim());
    } else {
      nextParams.delete('maxPrice');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleClearAllFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = Boolean(
    urlSearch || urlCategory || urlMinPrice || urlMaxPrice
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header & Breadcrumb */}
      <div className="border-b border-gray-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <nav className="flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 space-x-2">
            <Link to="/" className="hover:text-primary-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary-900">Products</span>
            {matchedCategory && (
              <>
                <span>/</span>
                <span className="text-primary-700">{matchedCategory.name}</span>
              </>
            )}
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {matchedCategory ? matchedCategory.name : 'All Products'}
              </h1>
              <p className="mt-1 text-sm text-gray-500 font-medium">
                Explore luxury silhouettes, refined essentials, and modern pieces.
              </p>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {productsLoading ? 'Loading…' : `${products.length} product${products.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile / Tablet Horizontal Category Scroll */}
        <div className="lg:hidden mb-6 overflow-x-auto pb-2 scrollbar-none flex gap-2">
          <button
            onClick={() => handleCategorySelect('')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              !urlCategory
                ? 'bg-primary-900 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => {
            const isSelected =
              urlCategory === cat._id ||
              urlCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat._id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-primary-900 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm sticky top-28 space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Search
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Keywords…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Categories
                </h2>
                {urlCategory && (
                  <button
                    onClick={() => updateQueryParam('category', '')}
                    className="text-[11px] font-bold text-primary-900 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    !urlCategory
                      ? 'bg-primary-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => {
                  const isSelected =
                    urlCategory === cat._id ||
                    urlCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <button
                      key={cat._id}
                      onClick={() => handleCategorySelect(cat._id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Price Range (₹)
              </h2>
              <form onSubmit={handleApplyPriceFilter} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-gray-900 hover:bg-primary-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  Apply Filter
                </button>
              </form>
            </div>

            {hasActiveFilters && (
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleClearAllFilters}
                  className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </aside>

          {/* Main Products Area */}
          <main className="flex-1 w-full">
            {/* Search and Active Filter Pills Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 mb-6 flex flex-wrap items-center justify-between gap-4">
              {/* Mobile search bar */}
              <div className="lg:hidden w-full relative">
                <input
                  type="text"
                  placeholder="Search products by keyword…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Active Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">
                  Active Filters:
                </span>
                {!hasActiveFilters && (
                  <span className="text-xs font-medium text-gray-500">None</span>
                )}
                {urlSearch && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                    "{urlSearch}"
                    <button
                      onClick={() => {
                        setSearchInput('');
                        updateQueryParam('search', '');
                      }}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                {matchedCategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100/60 text-primary-900">
                    Category: {matchedCategory.name}
                    <button
                      onClick={() => updateQueryParam('category', '')}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(urlMinPrice || urlMaxPrice) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                    Price: ₹{urlMinPrice || '0'} – ₹{urlMaxPrice || '∞'}
                    <button
                      onClick={() => {
                        setMinPriceInput('');
                        setMaxPriceInput('');
                        const nextParams = new URLSearchParams(searchParams);
                        nextParams.delete('minPrice');
                        nextParams.delete('maxPrice');
                        setSearchParams(nextParams, { replace: true });
                      }}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs font-bold uppercase tracking-wider text-primary-900 hover:text-primary-700 underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Loading Skeleton */}
            {productsLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-gray-200 bg-white p-4 animate-pulse space-y-4"
                  >
                    <div className="aspect-[4/5] bg-gray-200 rounded-xl" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-9 bg-gray-200 rounded-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="rounded-3xl border border-red-200 bg-red-50/70 p-8 text-center space-y-4">
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
                  <h3 className="text-lg font-bold text-red-900">
                    Could not load products
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    {error?.message || 'A network or server error occurred.'}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => refetch()}
                    className="inline-flex rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!productsLoading && !isError && products.length === 0 && (
              <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">
                    No products found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto font-medium">
                    We couldn't find any products matching your selected search criteria.
                  </p>
                </div>
                {hasActiveFilters && (
                  <div className="pt-2">
                    <button
                      onClick={handleClearAllFilters}
                      className="inline-flex rounded-full bg-primary-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-800 transition shadow"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Products Grid */}
            {!productsLoading && !isError && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
