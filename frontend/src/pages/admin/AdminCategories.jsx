import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../services/category.api';
import { adminApi } from '../../services/admin.api';

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [deletingId, setDeletingId] = useState(null);

  // Fetch categories using existing categoryApi.getCategories
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories,
  });

  const categories = response?.categories || response?.data?.categories || [];

  // Delete category mutation using existing DELETE /api/categories/:categoryId
  const deleteMutation = useMutation({
    mutationFn: (categoryId) => adminApi.deleteCategory(categoryId),
    onSuccess: (data) => {
      setDeletingId(null);
      setFeedback({
        type: 'success',
        message: data?.message || 'Category deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    },
    onError: (err) => {
      setDeletingId(null);
      setFeedback({
        type: 'error',
        message:
          err.response?.data?.message ||
          err.message ||
          'Failed to delete category.',
      });
    },
  });

  const handleDelete = (category) => {
    if (deleteMutation.isPending) return;

    if (
      window.confirm(
        `Are you sure you want to delete the category "${category.name}"? If products belong to this category, deletion will be rejected.`
      )
    ) {
      setDeletingId(category._id);
      setFeedback({ type: '', message: '' });
      deleteMutation.mutate(category._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
              <li className="text-primary-900">Categories</li>
            </ol>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900">
            Category Catalog ({categories.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Organize products into curated boutique collections and departments.
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
            to="/admin/categories/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Category
          </Link>
        </div>
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
          <p className="text-sm font-medium text-gray-500">Loading categories…</p>
        </div>
      )}

      {/* ── State 2: Error ── */}
      {isError && !isLoading && (
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
          <p className="text-sm text-red-600 font-medium mb-3">
            {error?.response?.data?.message || 'Unable to retrieve category listing.'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── State 3: Empty Categories ── */}
      {!isLoading && !isError && categories.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">No categories found</h2>
          <p className="text-xs text-gray-500 mb-6">
            Create your first product category to begin cataloging boutique inventory.
          </p>
          <Link
            to="/admin/categories/create"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Category
          </Link>
        </div>
      )}

      {/* ── State 4: Populated Categories List ── */}
      {!isLoading && !isError && categories.length > 0 && (
        <div>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Category ID</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => {
                  const isItemDeleting = deletingId === category._id;

                  return (
                    <tr key={category._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm">
                          {category.name}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          {category._id}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {category.createdAt
                          ? new Date(category.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 text-xs font-semibold">
                          <Link
                            to={`/admin/categories/${category._id}/edit`}
                            className="text-primary-900 hover:text-primary-700 transition"
                          >
                            Edit
                          </Link>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={() => handleDelete(category)}
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

          {/* Mobile Card List */}
          <div className="md:hidden space-y-3">
            {categories.map((category) => {
              const isItemDeleting = deletingId === category._id;

              return (
                <div
                  key={category._id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {category.name}
                      </h3>
                      <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                        ID: {category._id}
                      </p>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString('en-IN')
                        : ''}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-4 text-xs font-semibold">
                    <Link
                      to={`/admin/categories/${category._id}/edit`}
                      className="text-primary-900 hover:underline"
                    >
                      Edit Category
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
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

export default AdminCategories;