import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/admin.api';
import { useProduct, useCategories } from '../../hooks/useProducts';

// ── Zod schema aligned with backend updateProductSchema (all optional) ────────
const variantSchema = z.object({
  size: z.string().trim().min(1, 'Size is required'),
  color: z.string().trim().min(1, 'Color is required'),
  stock: z
    .number({ invalid_type_error: 'Stock must be a number' })
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
});

const editProductSchema = z.object({
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

// ── Small reusable components ─────────────────────────────────────────────────
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

// ── Main component ────────────────────────────────────────────────────────────
const AdminEditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for images
  const [existingImages, setExistingImages] = useState([]); // [{_id, url, publicId}]
  const [newImages, setNewImages] = useState([]); // [{url, publicId}] — freshly uploaded
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [apiError, setApiError] = useState('');
  const [formPopulated, setFormPopulated] = useState(false);

  const fileInputRef = useRef(null);

  // Load categories
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories =
    categoriesData?.categories || categoriesData?.data?.categories || [];

  // Load existing product
  const {
    data,
    isLoading: productLoading,
    isError: productError,
    error: productFetchError,
    refetch,
  } = useProduct(productId);

  const product = data?.product || data?.data?.product;

  // React Hook Form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: 0,
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  // Pre-populate form once product is loaded
  useEffect(() => {
    if (product && !formPopulated) {
      reset({
        name: product.name || '',
        description: product.description || '',
        category: product.category?._id || product.category || '',
        price: product.price ?? 0,
        variants:
          product.variants?.map((v) => ({
            size: v.size || '',
            color: v.color || '',
            stock: Number(v.stock) || 0,
          })) || [],
      });
      // Store existing images (backend subdocs have _id)
      setExistingImages(product.images || []);
      setFormPopulated(true);
    }
  }, [product, formPopulated, reset]);

  // ── Upload new images via existing backend POST /api/upload/products ──────
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    e.target.value = '';
    setIsUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      const result = await adminApi.uploadProductImages(formData);
      const uploaded = result?.images || [];
      setNewImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image(s). Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove new (not yet saved) image from staging list
  const handleRemoveNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Delete existing image via backend DELETE /api/products/:productId/images/:imageId ──
  const deleteImageMutation = useMutation({
    mutationFn: ({ imageId }) => adminApi.deleteProductImage({ productId, imageId }),
    onMutate: ({ imageId }) => setDeletingImageId(imageId),
    onSuccess: (_, { imageId }) => {
      setDeletingImageId(null);
      setExistingImages((prev) => prev.filter((img) => img._id !== imageId));
      // Invalidate so product detail query re-fetches fresh data
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onError: (err) => {
      setDeletingImageId(null);
      setApiError(err.message || 'Failed to delete image. Please try again.');
    },
  });

  const handleDeleteExistingImage = (image) => {
    if (deletingImageId) return;
    if (
      window.confirm(
        'Delete this image? This will remove it from Cloudinary and cannot be undone.'
      )
    ) {
      deleteImageMutation.mutate({ imageId: image._id });
    }
  };

  // ── Update product mutation via backend PUT /api/products/:productId ───────
  const updateMutation = useMutation({
    mutationFn: (payload) => adminApi.updateProduct({ productId, data: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      navigate(`/admin/products/${productId}`);
    },
    onError: (err) => {
      setApiError(err.message || 'Failed to update product. Please check the fields and try again.');
    },
  });

  const onSubmit = (data) => {
    if (isUploading) return;
    setApiError('');

    // Build final images array:
    // Keep existing images that weren't deleted + newly uploaded images
    const finalImages = [
      ...existingImages.map((img) => ({ url: img.url, publicId: img.publicId })),
      ...newImages,
    ];

    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category,
      price: Number(data.price),
      images: finalImages,
      variants:
        data.variants && data.variants.length > 0
          ? data.variants.map((v) => ({
              size: v.size.trim(),
              color: v.color.trim(),
              stock: Number(v.stock),
            }))
          : [],
    };

    updateMutation.mutate(payload);
  };

  const isSubmitting = updateMutation.isPending;
  const canSubmit = !isSubmitting && !isUploading && !deletingImageId;

  // ── Loading state ──────────────────────────────────────────────────────────
  if (productLoading) {
    return (
      <div className="space-y-6">
        <div className="h-4 w-56 bg-gray-200 animate-pulse rounded" />
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error / not found state ────────────────────────────────────────────────
  if (productError || !product) {
    return (
      <div className="space-y-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <li><Link to="/admin" className="hover:text-primary-900 transition-colors">Dashboard</Link></li>
            <li>/</li>
            <li><Link to="/admin/products" className="hover:text-primary-900 transition-colors">Products</Link></li>
            <li>/</li>
            <li className="text-red-500">Not Found</li>
          </ol>
        </nav>
        <div className="bg-white rounded-2xl border border-red-200 p-10 text-center shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Product Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">
            {productFetchError?.message || 'This product could not be loaded.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setFormPopulated(false); refetch(); }}
              className="px-5 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Retry
            </button>
            <Link
              to="/admin/products"
              className="px-5 py-2 bg-primary-900 text-white rounded-full text-xs font-semibold hover:bg-primary-800 transition"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <li><Link to="/admin" className="hover:text-primary-900 transition-colors">Dashboard</Link></li>
          <li>/</li>
          <li><Link to="/admin/products" className="hover:text-primary-900 transition-colors">Products</Link></li>
          <li>/</li>
          <li>
            <Link to={`/admin/products/${productId}`} className="hover:text-primary-900 transition-colors truncate max-w-[120px] inline-block">
              {product.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-primary-900 font-bold">Edit</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#305f4b]">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-gray-900 mt-1">
            Edit Product
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">ID: {productId}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/admin/products/${productId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 bg-white hover:border-gray-400 transition shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            View Details
          </Link>
        </div>
      </div>

      {/* API Error Banner */}
      {apiError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
          <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-red-900">Update Failed</p>
            <p className="text-xs text-red-700 mt-0.5">{apiError}</p>
          </div>
          <button
            onClick={() => setApiError('')}
            className="ml-auto text-red-600 hover:text-red-800 transition"
          >
            ✕
          </button>
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
          <button onClick={() => setUploadError('')} className="ml-auto text-amber-600 hover:text-amber-800 transition">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

        {/* ── Section: Basic Details ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 pb-3 border-b border-gray-100">
            Basic Details
          </h2>

          <div>
            <Label htmlFor="edit-name" required>Product Name</Label>
            <input
              id="edit-name"
              type="text"
              {...register('name')}
              placeholder="Product name"
              className={inputClass}
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <Label htmlFor="edit-description" required>Description</Label>
            <textarea
              id="edit-description"
              {...register('description')}
              rows={4}
              placeholder="Product description"
              className={`${inputClass} resize-y`}
            />
            <FieldError message={errors.description?.message} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-category" required>Category</Label>
              <select
                id="edit-category"
                {...register('category')}
                className={inputClass}
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? 'Loading…' : 'Select a category'}
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
              <Label htmlFor="edit-price" required>Price (₹)</Label>
              <input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className={inputClass}
              />
              <FieldError message={errors.price?.message} />
            </div>
          </div>
        </div>

        {/* ── Section: Images ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 pb-3 border-b border-gray-100">
            Product Images
          </h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                Current Images ({existingImages.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, idx) => (
                  <div key={img._id || img.publicId || idx} className="relative group">
                    <img
                      src={img.url}
                      alt={`Current image ${idx + 1}`}
                      className="w-24 h-28 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] bg-black/50 text-white px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(img)}
                      disabled={deletingImageId === img._id}
                      aria-label={`Delete image ${idx + 1}`}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow disabled:opacity-50"
                    >
                      {deletingImageId === img._id ? (
                        <span className="inline-block w-3 h-3 border border-white border-r-transparent rounded-full animate-spin" />
                      ) : (
                        '✕'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New staged images (not yet saved) */}
          {newImages.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                New Images to Save ({newImages.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {newImages.map((img, idx) => (
                  <div key={img.publicId || idx} className="relative group">
                    <img
                      src={img.url}
                      alt={`New image ${idx + 1}`}
                      className="w-24 h-28 object-cover rounded-xl border-2 border-dashed border-primary-900/40 shadow-sm"
                    />
                    <span className="absolute top-1 left-1 text-[9px] bg-primary-900 text-white px-1.5 py-0.5 rounded">
                      New
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(idx)}
                      aria-label={`Remove new image ${idx + 1}`}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
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
              aria-label="Upload more product images"
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
                  Upload More Images
                </>
              )}
            </button>
            <p className="mt-1.5 text-[11px] text-gray-400">
              Supports JPG, PNG, WebP. New images will be saved when you click "Save Changes".
            </p>
          </div>

          {existingImages.length === 0 && newImages.length === 0 && (
            <p className="text-xs text-amber-600 py-1">
              ⚠ This product currently has no images. Upload at least one image to improve visibility.
            </p>
          )}
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
              No variants. Click "Add Variant" to define sizes, colors, and stock levels.
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Variant #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Remove variant ${index + 1}`}
                      className="text-xs font-semibold text-red-600 hover:text-red-800 transition"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <Label htmlFor={`edit-variants.${index}.size`} required>Size</Label>
                      <input
                        id={`edit-variants.${index}.size`}
                        type="text"
                        placeholder="e.g. S, M, L, XL"
                        {...register(`variants.${index}.size`)}
                        className={inputClass}
                      />
                      <FieldError message={errors.variants?.[index]?.size?.message} />
                    </div>

                    <div>
                      <Label htmlFor={`edit-variants.${index}.color`} required>Color</Label>
                      <input
                        id={`edit-variants.${index}.color`}
                        type="text"
                        placeholder="e.g. Black, Navy Blue"
                        {...register(`variants.${index}.color`)}
                        className={inputClass}
                      />
                      <FieldError message={errors.variants?.[index]?.color?.message} />
                    </div>

                    <div>
                      <Label htmlFor={`edit-variants.${index}.stock`} required>Stock</Label>
                      <input
                        id={`edit-variants.${index}.stock`}
                        type="number"
                        min="0"
                        step="1"
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
            to={`/admin/products/${productId}`}
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
                Saving Changes...
              </span>
            ) : isUploading ? (
              'Uploading Images...'
            ) : deletingImageId ? (
              'Deleting Image...'
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;