import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategories } from '../../hooks/useProducts';
import { adminApi } from '../../services/admin.api';

// Validation schema strictly aligned with backend updateCategorySchema
const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Category name must be at least 2 characters'),
});

const AdminEditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [apiError, setApiError] = useState('');

  // Fetch all categories to locate the target category
  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories();

  const categories = categoriesData?.categories || categoriesData?.data?.categories || [];
  const currentCategory = categories.find((c) => c._id === categoryId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  });

  // Populate form with existing name when loaded
  useEffect(() => {
    if (currentCategory) {
      reset({ name: currentCategory.name || '' });
    }
  }, [currentCategory, reset]);

  // Update mutation using existing PUT /api/categories/:categoryId
  const updateMutation = useMutation({
    mutationFn: (data) =>
      adminApi.updateCategory({ categoryId, data }),
    onSuccess: () => {
      // Invalidate categories query cache
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/admin/categories');
    },
    onError: (err) => {
      setApiError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update category. Check whether the name already exists.'
      );
    },
  });

  const onSubmit = (data) => {
    setApiError('');
    updateMutation.mutate({ name: data.name.trim() });
  };

  const isSubmitting = updateMutation.isPending;

  // ── State 1: Loading Category ──
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-900 border-r-transparent mb-3" />
        <p className="text-sm font-medium text-gray-500">Loading category information...</p>
      </div>
    );
  }

  // ── State 2: Fetch Error ──
  if (isError) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
        <p className="text-sm text-red-600 font-medium mb-3">
          {error?.response?.data?.message || 'Unable to retrieve category information.'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── State 3: Category Not Found ──
  if (!isLoading && !currentCategory) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          Category Not Found
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          No category exists matching identifier "{categoryId}".
        </p>
        <Link
          to="/admin/categories"
          className="px-5 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition inline-block"
        >
          Return to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <li>
            <Link to="/admin" className="hover:text-primary-900 transition-colors">
              Dashboard
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/admin/categories" className="hover:text-primary-900 transition-colors">
              Categories
            </Link>
          </li>
          <li>/</li>
          <li className="text-primary-900 font-bold truncate max-w-[200px]">
            {currentCategory?.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#305f4b]">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900 mt-1">
            Edit Category
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Update category name for "{currentCategory?.name}".
          </p>
        </div>

        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 bg-white hover:border-gray-400 transition shadow-sm self-start"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Categories
        </Link>
      </div>

      {/* Error Banner */}
      {apiError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
          <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-red-900">Update Failed</p>
            <p className="text-xs text-red-700 mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Category Name *
            </label>
            <input
              id="name"
              {...register('name')}
              type="text"
              placeholder="e.g. Silk Sarees"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
            )}
            <p className="mt-1.5 text-[11px] text-gray-400">
              Must be unique across all categories and contain at least 2 characters.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Category Identifier:</span>{' '}
            <span className="font-mono text-gray-600">{categoryId}</span>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/categories"
              className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-primary-900 text-white text-xs font-semibold hover:bg-primary-800 transition disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditCategory;
