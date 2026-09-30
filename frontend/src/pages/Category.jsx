import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategories, useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Category = () => {
  const { categoryId } = useParams();

  // Fetch all categories to resolve name and metadata
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories();

  const categories = categoriesData?.categories || [];

  // Match category by MongoDB _id or case-insensitive name/slug
  const matchedCategory = useMemo(() => {
    if (!categoryId || categories.length === 0) return null;
    return categories.find(
      (c) =>
        c._id === categoryId ||
        c.name.toLowerCase() === categoryId.toLowerCase()
    );
  }, [categories, categoryId]);

  // If matched, use matchedCategory._id; otherwise use param directly if valid ObjectId
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(categoryId || '');
  const effectiveCategoryId = matchedCategory?._id || (isValidObjectId ? categoryId : null);

  // Fetch products for this category using existing product API filter
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts(
    effectiveCategoryId ? { category: effectiveCategoryId } : undefined
  );

  const products = productsData?.products || [];

  // ── State 1: Category Not Found (Only after categories have finished loading) ──
  const categoryNotFound =
    !isCategoriesLoading &&
    categories.length > 0 &&
    !matchedCategory &&
    !isValidObjectId;

  if (categoryNotFound) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-display font-semibold text-gray-900 mb-2">
            Category Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            We couldn't find a collection matching "{categoryId}". Explore our shop to view all curated styles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-primary-900 text-white text-xs font-semibold hover:bg-primary-800 transition shadow-sm text-center"
            >
              Browse All Products
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryDisplayName =
    matchedCategory?.name || (isValidObjectId ? 'Category Collection' : categoryId);

  return (
    <div className="min-h-screen bg-[#fbfaf7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <li>
              <Link to="/" className="hover:text-primary-900 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/products" className="hover:text-primary-900 transition-colors">
                Shop
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary-900 font-bold">
              {categoryDisplayName}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-black/5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary-900/60 block mb-1">
              Curated Category
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-primary-900">
              {categoryDisplayName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Hand-picked garments and designs crafted for luxury and everyday elegance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 bg-white hover:border-gray-400 transition shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              All Products
            </Link>
          </div>
        </div>

        {/* ── State 2: Products Loading State ── */}
        {(isProductsLoading || isCategoriesLoading) && (
          <div>
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-6" />
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

        {/* ── State 3: API Error State ── */}
        {(isProductsError || isCategoriesError) && !isProductsLoading && (
          <div className="bg-white rounded-2xl border border-red-200 p-10 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Unable to load category products
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              {productsError?.response?.data?.message ||
                productsError?.message ||
                'An unexpected error occurred while fetching items in this category.'}
            </p>
            <button
              onClick={() => refetchProducts()}
              className="px-5 py-2 rounded-full bg-primary-900 text-white text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── State 4: Empty Category State ── */}
        {!isProductsLoading && !isProductsError && products.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold font-display text-gray-900 mb-1">
              No products found in this category
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              New arrivals for <span className="font-semibold text-gray-800">{categoryDisplayName}</span> are coming soon. Check out our other curated collections.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* ── State 5: Populated Products Grid ── */}
        {!isProductsLoading && !isProductsError && products.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-900">{products.length}</span>{' '}
                {products.length === 1 ? 'item' : 'items'} in {categoryDisplayName}
              </p>
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

export default Category;
