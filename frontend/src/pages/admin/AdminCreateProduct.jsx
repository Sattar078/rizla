import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/admin.api';
import { useCategories } from '../../hooks/useProducts';

// ── Zod schema aligned with backend createProductSchema ──────────────────────
const variantSchema = z.object({
  size: z.string().trim().min(1, 'Size is required'),
  color: z.string().trim().min(1, 'Color is required'),
  stock: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
});

const productSchema = z.object({
  name: z.string().trim().min(2, 'Product name must be at least 2 characters'),
  description: z
    .string()
    .trim()
    .min(5, 'Description must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price cannot be negative'),
  variants: z.array(variantSchema).optional(),
});

// ── Reusable small components ─────────────────────────────────────────────────
const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;

const Label = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
  >
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const inputClass =
  'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition';

// ── Image uploader section ────────────────────────────────────────────────────
const ImageUploader = ({ uploadedImages, onUpload, onRemove, isUploading }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    // Reset input so same file can be re-selected if needed
    e.target.value = '';
    await onUpload(files);
  };

  return (
    <div className="space-y-3">
      {/* Previews */}
      {uploadedImages.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {uploadedImages.map((img, idx) => (
            <div key={img.publicId} className="relative group">
              <img
                src={img.url}
                alt={`Product image ${idx + 1}`}
                className="w-24 h-28 object-cover rounded-xl border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                aria-label={`Remove image ${idx + 1}`}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
              >
                ✕
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] bg-black/50 text-white px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          aria-label="Upload product images"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-600 hover:border-primary-900 hover:text-primary-900 transition disabled:opacity-50 w-full justify-center"
        >
          {isUploading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-primary-900 border-r-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {uploadedImages.length > 0 ? 'Add More Images' : 'Upload Product Images'}
            </>
          )}
        </button>
        <p className="mt-1.5 text-[11px] text-gray-400">
          Supports JPG, PNG, WebP. First image becomes the cover photo.
        </p>
      </div>
    </div>
  );
};

// ── Main page component ────────────────────────────────────────────────────────
const AdminCreateProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [apiError, setApiError] = useState('');

  // Load categories from existing API
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories =
    categoriesData?.categories || categoriesData?.data?.categories || [];

  // React Hook Form with field arrays for variants
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: '',
      variants: [{ size: '', color: '', stock: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  // Upload images mutation using existing backend POST /api/upload/products
  const handleImageUpload = async (files) => {
    setIsUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      const result = await adminApi.uploadProductImages(formData);
      const newImages = result?.images || [];
      setUploadedImages((prev) => [...prev, ...newImages]);
    } catch (err) {
      setUploadError(
        err.message || 'Failed to upload image(s). Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (idx) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Create product mutation using existing POST /api/products
  const createMutation = useMutation({
    mutationFn: (payload) => adminApi.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      navigate('/admin/products');
    },
    onError: (err) => {
      setApiError(err.message || 'Failed to create product. Please try again.');
    },
  });

  const onSubmit = (data) => {
    if (isUploading) return;
    setApiError('');

    // Build payload matching backend createProductSchema
    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category,
      price: Number(data.price),
    };

    // Images are optional in the backend schema
    if (uploadedImages.length > 0) {
      payload.images = uploadedImages; // [{ url, publicId }]
    }

    // Variants are optional in the backend schema
    if (data.variants && data.variants.length > 0) {
      payload.variants = data.variants.map((v) => ({
        size: v.size.trim(),
        color: v.color.trim(),
        stock: Number(v.stock),
      }));
    }

    createMutation.mutate(payload);
  };

  const isSubmitting = createMutation.isPending;
  const canSubmit = !isSubmitting && !isUploading;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <li>
            <Link to="/admin" className="hover:text-primary-900 transition-colors">
              Dashboard
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/admin/products" className="hover:text-primary-900 transition-colors">
              Products
            </Link>
          </li>
          <li>/</li>
          <li className="text-primary-900 font-bold">New Product</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#305f4b]">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900 mt-1">
            Add New Product
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Create a new product listing for the Rizla Boutique catalog.
          </p>
        </div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 bg-white hover:border-gray-400 transition shadow-sm self-start shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
      </div>

      {/* API Error Banner */}
      {apiError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
          <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-red-900">Product Creation Failed</p>
            <p className="text-xs text-red-700 mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-2.5">
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-amber-900">Image Upload Error</p>
            <p className="text-xs text-amber-700 mt-0.5">{uploadError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

        {/* ── Section: Basic Details ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 pb-3 border-b border-gray-100">
            Basic Details
          </h2>

          {/* Product Name */}
          <div>
            <Label htmlFor="name" required>Product Name</Label>
            <input
              id="name"
              type="text"
              {...register('name')}
              placeholder="e.g. Silk Blend Anarkali Kurta"
              className={inputClass}
            />
            <FieldError message={errors.name?.message} />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" required>Description</Label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              placeholder="Describe the product — fabric, occasion, fit, care instructions..."
              className={`${inputClass} resize-y`}
            />
            <FieldError message={errors.description?.message} />
          </div>

          {/* Category + Price row */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="category" required>Category</Label>
              <select
                id="category"
                {...register('category')}
                className={inputClass}
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories…' : 'Select a category'}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.category?.message} />
            </div>

            <div>
              <Label htmlFor="price" required>Price (₹)</Label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register('price', { valueAsNumber: true })}
                className={inputClass}
              />
              <FieldError message={errors.price?.message} />
            </div>
          </div>
        </div>

        {/* ── Section: Product Images ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 pb-3 border-b border-gray-100">
            Product Images
          </h2>
          <ImageUploader
            uploadedImages={uploadedImages}
            onUpload={handleImageUpload}
            onRemove={handleRemoveImage}
            isUploading={isUploading}
          />
        </div>

        {/* ── Section: Variants ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Variants ({fields.length})
            </h2>
            <button
              type="button"
              onClick={() => append({ size: '', color: '', stock: 0 })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-900/5 text-primary-900 text-xs font-semibold rounded-full hover:bg-primary-900/10 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Variant
            </button>
          </div>

          {fields.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              No variants added. Click "Add Variant" to define sizes, colors, and stock.
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Variant #{index + 1}
                    </span>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        aria-label={`Remove variant ${index + 1}`}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <Label htmlFor={`variants.${index}.size`} required>Size</Label>
                      <input
                        id={`variants.${index}.size`}
                        type="text"
                        placeholder="e.g. S, M, L, XL"
                        {...register(`variants.${index}.size`)}
                        className={inputClass}
                      />
                      <FieldError message={errors.variants?.[index]?.size?.message} />
                    </div>

                    <div>
                      <Label htmlFor={`variants.${index}.color`} required>Color</Label>
                      <input
                        id={`variants.${index}.color`}
                        type="text"
                        placeholder="e.g. Black, Navy Blue"
                        {...register(`variants.${index}.color`)}
                        className={inputClass}
                      />
                      <FieldError message={errors.variants?.[index]?.color?.message} />
                    </div>

                    <div>
                      <Label htmlFor={`variants.${index}.stock`} required>Stock</Label>
                      <input
                        id={`variants.${index}.stock`}
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                        className={inputClass}
                      />
                      <FieldError message={errors.variants?.[index]?.stock?.message} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Form Footer ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-7 py-2.5 rounded-full bg-primary-900 text-white text-xs font-semibold hover:bg-primary-800 transition disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-3.5 h-3.5 border-2 border-white border-r-transparent rounded-full animate-spin" />
                Creating Product...
              </span>
            ) : isUploading ? (
              'Uploading Images...'
            ) : (
              'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateProduct;