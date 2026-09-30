import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/admin.api';

// Validation schema aligned strictly with backend createCategorySchema
const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Category name must be at least 2 characters'),
});

const AdminCreateCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => adminApi.createCategory(data),
    onSuccess: () => {
      // Invalidate category cache across the application
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate('/admin/categories');
    },
    onError: (err) => {
      setApiError(
        err.response?.data?.message ||
          err.message ||
          'Failed to create category. Please verify the name is unique.'
      );
    },
  });

  const onSubmit = (data) => {
    setApiError('');
    createMutation.mutate({ name: data.name.trim() });
  };

  const isSubmitting = createMutation.isPending;

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
          <li className="text-primary-900 font-bold">New Category</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#305f4b]">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900 mt-1">
            Create New Category
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Add a department or curated collection for organizing boutique products.
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
            <p className="font-semibold text-red-900">Creation Error</p>
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
              autoFocus
              placeholder="e.g. Silk Sarees, Designer Kurtis, Menswear"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
            )}
            <p className="mt-1.5 text-[11px] text-gray-400">
              Must be unique across the catalog and contain at least 2 characters.
            </p>
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
              {isSubmitting ? 'Creating Category...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateCategory;
