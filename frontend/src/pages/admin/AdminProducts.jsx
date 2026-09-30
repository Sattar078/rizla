import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../../services/product.api';
import { adminApi } from '../../services/admin.api';
import { useCategories } from '../../hooks/useProducts';

const AdminProducts = () => {
  const queryClient = useQueryClient();

  // Search & category filter states (supported by backend getAllProducts)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [deletingId, setDeletingId] = useState(null);

  // Load categories for filter dropdown
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.categories || categoriesData?.data?.categories || [];

  // Construct query params supported by existing backend
  const queryParams = {};
  if (searchTerm.trim()) queryParams.search = searchTerm.trim();
  if (selectedCategory) queryParams.category = selectedCategory;

  // Query products with active filters
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminProducts', queryParams],
    queryFn: () => productApi.getProducts(queryParams),
  });

  const products = productsData?.products || productsData?.data?.products || [];

  // Delete product mutation using existing DELETE /api/products/:productId
  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteProduct(id),
    onSuccess: (data) => {
      setDeletingId(null);
      setFeedback({
        type: 'success',
        message: data?.message || 'Product deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    },
    onError: (err) => {
      setDeletingId(null);
      setFeedback({
        type: 'error',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to delete product. Please try again.',
      });
    },
  });

  const handleDelete = (product) => {
    if (deleteMutation.isPending) return;

    if (
      window.confirm(
        `Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`
      )
    ) {
      setDeletingId(product._id);
      setFeedback({ type: '', message: '' });
      deleteMutation.mutate(product._id);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation and Add Product Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <nav aria-label="Breadcrumb" className="mb-1">
            <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <li>
                <Link to="/admin" className="hover:text-primary-900 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>/</li>
              <li className="text-primary-900">Products</li>
            </ol>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900">
            Product Inventory ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your store's luxury catalog, pricing, variants, and stock levels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:border-gray-400 transition shadow-sm disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
          />
        </div>

        {/* Category Dropdown */}
        <div className="w-full sm:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
            className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedCategory) && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs font-semibold text-gray-500 hover:text-primary-900 px-3 py-2"
          >
            Reset
          </button>
        )}
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between border ${
            feedback.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'error' ? (
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback({ type: '', message: '' })}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── State 1: Loading ── */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-900 border-r-transparent mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading catalog inventory...</p>
        </div>
      )}

      {/* ── State 2: Error ── */}
      {isError && !isLoading && (
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
          <p className="text-sm text-red-600 font-medium mb-3">
            {error?.response?.data?.message || 'Unable to retrieve product inventory.'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── State 3: Empty State ── */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">No products found</h2>
          <p className="text-xs text-gray-500 mb-6">
            {searchTerm || selectedCategory
              ? 'No products match your active search or category filter.'
              : 'Your store catalog is currently empty. Add your first boutique garment.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {(searchTerm || selectedCategory) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Clear Filters
              </button>
            )}
            <Link
              to="/admin/products/create"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Product
            </Link>
          </div>
        </div>
      )}

      {/* ── State 4: Populated Products Table / Cards ── */}
      {!isLoading && !isError && products.length > 0 && (
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Inventory</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const totalStock =
                    product.variants?.reduce(
                      (sum, v) => sum + (Number(v.stock) || 0),
                      0
                    ) || 0;
                  const isItemDeleting = deletingId === product._id;
                  const imageUrl = product.images?.[0]?.url;

                  return (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition">
                      {/* Product Thumbnail & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400">No img</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/admin/products/${product._id}`}
                              className="font-semibold text-gray-900 text-sm hover:text-primary-900 line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-gray-400 font-mono block mt-0.5">
                              ID: {product._id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-xs font-medium text-gray-800">
                        {product.category?.name || 'Uncategorized'}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                        ₹{Number(product.price || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Stock & Variants */}
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              totalStock > 0
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                          >
                            {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-1">
                          {product.variants?.length || 0} variant(s)
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-1 font-semibold text-gray-800">
                          <span className="text-amber-400 text-sm">★</span>
                          <span>{product.averageRating ? product.averageRating.toFixed(1) : '0.0'}</span>
                          <span className="text-gray-400 font-normal">
                            ({product.totalReviews || 0})
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2.5 text-xs font-semibold">
                          <Link
                            to={`/admin/products/${product._id}`}
                            className="text-primary-900 hover:text-primary-700 transition"
                          >
                            View
                          </Link>
                          <span className="text-gray-200">|</span>
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="text-primary-900 hover:text-primary-700 transition"
                          >
                            Edit
                          </Link>
                          <span className="text-gray-200">|</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            disabled={isItemDeleting}
                            className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                          >
                            {isItemDeleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.map((product) => {
              const totalStock =
                product.variants?.reduce(
                  (sum, v) => sum + (Number(v.stock) || 0),
                  0
                ) || 0;
              const isItemDeleting = deletingId === product._id;
              const imageUrl = product.images?.[0]?.url;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No img</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="font-bold text-gray-900 text-sm hover:underline line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {product.category?.name || 'Uncategorized'}
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        ₹{Number(product.price || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        totalStock > 0
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                    </span>

                    <div className="flex items-center gap-1 font-semibold text-gray-700">
                      <span className="text-amber-400">★</span>
                      <span>{product.averageRating ? product.averageRating.toFixed(1) : '0.0'}</span>
                      <span className="text-gray-400 font-normal">({product.totalReviews || 0})</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-4 text-xs font-semibold">
                    <Link
                      to={`/admin/products/${product._id}`}
                      className="text-gray-600 hover:text-primary-900"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="text-primary-900 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={isItemDeleting}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      {isItemDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
